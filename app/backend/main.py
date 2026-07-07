import os
import sys
import asyncpg
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import our validation contracts and structural enums
from models import OrderCreate, OrderItemCreate, OrderStatus, MockCheckoutRequest

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@postgres:5432/brewai")

pool = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global pool
    pool = await asyncpg.create_pool(DATABASE_URL)
    
    # Initialize Schema and Data
    async with pool.acquire() as conn:
        try:
            await conn.fetchval("SELECT 1 FROM orders LIMIT 1")
        except asyncpg.exceptions.UndefinedTableError:
            with open("schema.sql", "r") as f:
                schema_sql = f.read()
            await conn.execute(schema_sql)
            
            # Check if menu is empty, if so, insert mock data
            count = await conn.fetchval("SELECT COUNT(*) FROM menu_items")
            if count == 0:
                await conn.execute("INSERT INTO categories (id, name, description) VALUES (1, 'Coffee', 'Freshly brewed coffee') ON CONFLICT DO NOTHING")
                await conn.execute("""
                    INSERT INTO menu_items (id, category_id, name, description, price_cents, allergens) VALUES 
                    (1, 1, 'Espresso', 'Strong and concentrated', 300, '{}'),
                    (2, 1, 'Caramel Macchiato', 'Sweet and creamy', 550, '{"dairy"}'),
                    (3, 1, 'Oat Milk Cold Brew', 'Smooth and refreshing', 500, '{}')
                    ON CONFLICT DO NOTHING
                """)
                # Reset sequences just in case
                await conn.execute("SELECT setval('menu_items_id_seq', (SELECT MAX(id) FROM menu_items))")
                await conn.execute("SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories))")

    yield
    await pool.close()

app = FastAPI(
    title="BrewAI Core API",
    description="Transactional Backend and AI Service Router for BrewAI",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- OPERATIONAL CONTROLLERS ---

@app.post("/orders", status_code=status.HTTP_201_CREATED, tags=["Transactions"])
async def create_order(order_input: OrderCreate):
    async with pool.acquire() as conn:
        # Create an order
        order_id = await conn.fetchval(
            "INSERT INTO orders (status, total_price_cents, special_instructions) VALUES ($1, $2, $3) RETURNING id",
            OrderStatus.PENDING.value, 0, order_input.special_instructions
        )
        return {
            "id": order_id,
            "status": OrderStatus.PENDING,
            "items": [],
            "total_price_cents": 0,
            "special_instructions": order_input.special_instructions
        }

@app.put("/orders/{order_id}/items", tags=["Transactions"])
async def add_item_to_order(order_id: int, item: OrderItemCreate):
    async with pool.acquire() as conn:
        async with conn.transaction():
            order = await conn.fetchrow("SELECT id, status, total_price_cents FROM orders WHERE id = $1", order_id)
            if not order:
                raise HTTPException(status_code=404, detail="Target order basket not found")
            if order["status"] != OrderStatus.PENDING.value:
                raise HTTPException(status_code=400, detail="Cannot alter an order after final submission")
                
            menu_item = await conn.fetchrow("SELECT id, name, price_cents FROM menu_items WHERE id = $1", item.menu_item_id)
            if not menu_item:
                raise HTTPException(status_code=404, detail="Selected menu item does not exist")
                
            item_cost = menu_item["price_cents"] * item.quantity
            
            await conn.execute(
                """INSERT INTO order_items (order_id, menu_item_id, quantity, selected_size, price_at_purchase_cents)
                   VALUES ($1, $2, $3, $4, $5)""",
                order_id, item.menu_item_id, item.quantity, item.selected_size.value, menu_item["price_cents"]
            )
            
            new_total = order["total_price_cents"] + item_cost
            await conn.execute("UPDATE orders SET total_price_cents = $1 WHERE id = $2", new_total, order_id)
            
            # Fetch the updated order items
            items_rows = await conn.fetch(
                """SELECT oi.menu_item_id, mi.name, oi.quantity, oi.selected_size, oi.price_at_purchase_cents 
                   FROM order_items oi
                   JOIN menu_items mi ON oi.menu_item_id = mi.id
                   WHERE oi.order_id = $1""",
                order_id
            )
            
            return {
                "id": order_id,
                "status": order["status"],
                "total_price_cents": new_total,
                "items": [dict(r) for r in items_rows]
            }

@app.post("/orders/confirm", tags=["Transactions"])
async def confirm_order(payload: MockCheckoutRequest):
    async with pool.acquire() as conn:
        async with conn.transaction():
            order = await conn.fetchrow("SELECT id, status, total_price_cents FROM orders WHERE id = $1", payload.order_id)
            if not order:
                raise HTTPException(status_code=404, detail="Order reference not found")
            if order["status"] != OrderStatus.PENDING.value:
                raise HTTPException(status_code=400, detail="Order is already processed or voided")
                
            item_count = await conn.fetchval("SELECT count(*) FROM order_items WHERE order_id = $1", payload.order_id)
            if item_count == 0:
                raise HTTPException(status_code=400, detail="Cannot execute checkout processing on an empty basket")
                
            await conn.execute("UPDATE orders SET status = $1 WHERE id = $2", OrderStatus.CONFIRMED.value, payload.order_id)
            
            return {
                "message": "Simulated transaction execution successful. Order routed to kitchen terminal.",
                "order_id": order["id"],
                "final_status": OrderStatus.CONFIRMED.value,
                "total_amount_cents": order["total_price_cents"]
            }

@app.get("/orders/{order_id}", tags=["Transactions"])
async def get_order_status(order_id: int):
    async with pool.acquire() as conn:
        order = await conn.fetchrow("SELECT id, status, total_price_cents, special_instructions FROM orders WHERE id = $1", order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
            
        items = await conn.fetch(
            """SELECT oi.menu_item_id, mi.name, oi.quantity, oi.selected_size, oi.price_at_purchase_cents 
               FROM order_items oi
               JOIN menu_items mi ON oi.menu_item_id = mi.id
               WHERE oi.order_id = $1""",
            order_id
        )
        
        return {
            "id": order["id"],
            "status": order["status"],
            "total_price_cents": order["total_price_cents"],
            "special_instructions": order["special_instructions"],
            "items": [dict(r) for r in items]
        }

@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "healthy", "environment": os.getenv("NODE_ENV", "development")}

# --- AI ROUTING ENDPOINT ---
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "ai"))
from agent import BrewAIAgent

ai_agent = BrewAIAgent(kb_path=os.path.join(os.path.dirname(__file__), "..", "ai", "knowledge_base.json"))

class ChatMessage(BaseModel):
    message: str

@app.post("/ai/chat", tags=["AI"])
async def chat_with_ai(chat: ChatMessage):
    intent_data = ai_agent.predict_intent(chat.message)
    if intent_data["intent"] == "INFO_RETRIEVAL":
        reply = ai_agent.fallback_rag_search(chat.message)
        return {"reply": reply, "intent": intent_data}
    else:
        return {"reply": f"I noticed you want to {intent_data['intent']}! I am currently a mock agent, but soon I'll trigger the backend transaction for you.", "intent": intent_data}
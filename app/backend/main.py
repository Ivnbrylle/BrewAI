from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import os

# Import our validation contracts and structural enums
from models import OrderCreate, OrderItemCreate, OrderStatus, MockCheckoutRequest

app = FastAPI(
    title="BrewAI Core API",
    description="Transactional Backend and AI Service Router for BrewAI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MOCK DATA PLATFORM ---
# Simulating database records for rapid prototype iteration without Docker engine dependencies
MOCK_MENU: Dict[int, Dict] = {
    1: {"name": "Espresso", "price_cents": 300, "allergens": []},
    2: {"name": "Caramel Macchiato", "price_cents": 550, "allergens": ["dairy"]},
    3: {"name": "Oat Milk Cold Brew", "price_cents": 500, "allergens": []}
}

MOCK_ORDERS_DB: Dict[int, Dict] = {}
order_id_counter = 1

# --- OPERATIONAL CONTROLLERS ---

@app.post("/orders", status_code=status.HTTP_201_CREATED, tags=["Transactions"])
async def create_order(order_input: OrderCreate):
    """
    Initializes a new draft order basket. Driven by either the frontend UI checkout click
    or intercepted conversational triggers from the AI Agent loop.
    """
    global order_id_counter
    new_order = {
        "id": order_id_counter,
        "status": OrderStatus.PENDING,
        "items": [],
        "total_price_cents": 0,
        "special_instructions": order_input.special_instructions
    }
    MOCK_ORDERS_DB[order_id_counter] = new_order
    order_id_counter += 1
    return new_order

@app.put("/orders/{order_id}/items", tags=["Transactions"])
async def add_item_to_order(order_id: int, item: OrderItemCreate):
    """
    Appends or alters beverage items inside the transactional state basket.
    Multi-turn conversational loops update quantities asynchronously through this endpoint.
    """
    if order_id not in MOCK_ORDERS_DB:
        raise HTTPException(status_code=404, detail="Target order basket not found")
    
    order = MOCK_ORDERS_DB[order_id]
    if order["status"] != OrderStatus.PENDING:
        raise HTTPException(status_code=400, detail="Cannot alter an order after final submission")
    
    if item.menu_item_id not in MOCK_MENU:
        raise HTTPException(status_code=404, detail="Selected menu item does not exist")
        
    menu_item = MOCK_MENU[item.menu_item_id]
    
    # Calculate price based on historical baseline
    item_cost = menu_item["price_cents"] * item.quantity
    
    order_item_record = {
        "menu_item_id": item.menu_item_id,
        "name": menu_item["name"],
        "quantity": item.quantity,
        "selected_size": item.selected_size,
        "price_at_purchase_cents": menu_item["price_cents"]
    }
    
    order["items"].append(order_item_record)
    order["total_price_cents"] += item_cost
    return order

@app.post("/orders/confirm", tags=["Transactions"])
async def confirm_order(payload: MockCheckoutRequest):
    """
    PORTFOLIO SPECIFIC ARCHITECTURE ARCHTYPE: Simulated Checkout Machine.
    Interceptors explicitly catch incoming requests, validate integrity, and instantly
    pivot operational state flags to CONFIRMED. Bypasses live gateway provider requirements.
    """
    if payload.order_id not in MOCK_ORDERS_DB:
        raise HTTPException(status_code=404, detail="Order reference not found")
        
    order = MOCK_ORDERS_DB[payload.order_id]
    if order["status"] != OrderStatus.PENDING:
        raise HTTPException(status_code=400, detail="Order is already processed or voided")
        
    if not order["items"]:
        raise HTTPException(status_code=400, detail="Cannot execute checkout processing on an empty basket")
        
    # Transition the status flag to confirm transaction execution
    order["status"] = OrderStatus.CONFIRMED
    return {
        "message": "Simulated transaction execution successful. Order routed to kitchen terminal.",
        "order_id": order["id"],
        "final_status": order["status"],
        "total_amount_cents": order["total_price_cents"]
    }

@app.get("/orders/{order_id}", tags=["Transactions"])
async def get_order_status(order_id: int):
    """
    Real-time status lookup engine for customer trackers and AI Agent queries.
    """
    if order_id not in MOCK_ORDERS_DB:
        raise HTTPException(status_code=404, detail="Order not found")
    return MOCK_ORDERS_DB[order_id]

@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "healthy", "environment": os.getenv("NODE_ENV", "development")}
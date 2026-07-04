from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from enum import Enum

# 1. Matching Python Enums to our PostgreSQL Schema Types
class OrderStatus(str, Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    PREPARING = "PREPARING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class ItemSize(str, Enum):
    SMALL = "SMALL"
    MEDIUM = "MEDIUM"
    LARGE = "LARGE"

# 2. Pydantic Models for Data Validation & Request Handling
class MenuItemBase(BaseModel):
    name: str = Field(..., example="Caramel Macchiato")
    description: str
    price_cents: int = Field(..., gt=0, description="Price in cents (e.g., 450 for $4.50)")
    allergens: List[str] = []

class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int = Field(default=1, ge=1)
    selected_size: ItemSize = ItemSize.MEDIUM

class OrderCreate(BaseModel):
    special_instructions: Optional[str] = None

class MockCheckoutRequest(BaseModel):
    order_id: int
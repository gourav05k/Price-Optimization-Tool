from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal
from datetime import datetime
import uuid

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    cost_price: Decimal = Field(..., gt=0)
    selling_price: Decimal = Field(..., gt=0)
    category: str = Field(..., min_length=1, max_length=100)
    stock_available: int = Field(..., ge=0)
    units_sold: int = Field(default=0, ge=0)
    customer_rating: Optional[Decimal] = Field(None, ge=0, le=5)
    demand_forecast: Optional[int] = Field(None, ge=0)
    optimized_price: Optional[Decimal] = Field(None, gt=0)

class ProductCreate(ProductBase):
    pass  # No product_id needed - will be auto-generated

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    cost_price: Optional[Decimal] = Field(None, gt=0)
    selling_price: Optional[Decimal] = Field(None, gt=0)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    stock_available: Optional[int] = Field(None, ge=0)
    units_sold: Optional[int] = Field(None, ge=0)
    customer_rating: Optional[Decimal] = Field(None, ge=0, le=5)
    demand_forecast: Optional[int] = Field(None, ge=0)
    optimized_price: Optional[Decimal] = Field(None, gt=0)
    is_active: Optional[bool] = None

class ProductResponse(ProductBase):
    id: uuid.UUID
    product_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    # Computed fields
    profit_margin: Optional[float] = None
    profit_per_unit: Optional[float] = None
    
    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    products: list[ProductResponse]
    total: int
    page: int
    size: int
    
class ProductSearchParams(BaseModel):
    search: Optional[str] = None
    category: Optional[str] = None
    min_price: Optional[Decimal] = None
    max_price: Optional[Decimal] = None
    page: int = Field(default=1, ge=1)
    size: int = Field(default=10, ge=1, le=100)

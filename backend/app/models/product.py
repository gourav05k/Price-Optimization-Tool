from sqlalchemy import Column, String, Integer, Numeric, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from ..database import Base

class Product(Base):
    __tablename__ = "products"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    product_id = Column(Integer, unique=True, index=True, nullable=False)  # From CSV
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    cost_price = Column(Numeric(10, 2), nullable=False)
    selling_price = Column(Numeric(10, 2), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    stock_available = Column(Integer, default=0)
    units_sold = Column(Integer, default=0)
    customer_rating = Column(Numeric(3, 2), nullable=True)  # e.g., 4.5
    demand_forecast = Column(Integer, nullable=True)
    optimized_price = Column(Numeric(10, 2), nullable=True)
    is_active = Column(Boolean, default=True)
    
    # Foreign key to user who created the product
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    creator = relationship("User", backref="products")
    forecasts = relationship("DemandForecast", back_populates="product", cascade="all, delete-orphan")
    pricing_optimizations = relationship("PricingOptimization", back_populates="product", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Product(id={self.product_id}, name='{self.name}', category='{self.category}')>"
    
    @property
    def profit_margin(self):
        """Calculate profit margin percentage"""
        if self.selling_price and self.cost_price:
            return float((self.selling_price - self.cost_price) / self.selling_price * 100)
        return 0.0
    
    @property
    def profit_per_unit(self):
        """Calculate profit per unit"""
        if self.selling_price and self.cost_price:
            return float(self.selling_price - self.cost_price)
        return 0.0

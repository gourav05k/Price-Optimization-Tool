from sqlalchemy import Column, String, Numeric, Boolean, DateTime, ForeignKey, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from ..database import Base

class PricingOptimization(Base):
    __tablename__ = "pricing_optimizations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False, index=True)
    
    # Pricing data
    current_price = Column(Numeric(10, 2), nullable=False)
    optimized_price = Column(Numeric(10, 2), nullable=False)
    expected_demand = Column(Numeric(10, 2), nullable=True)
    expected_revenue = Column(Numeric(12, 2), nullable=True)
    profit_margin = Column(Numeric(5, 2), nullable=True)  # Percentage
    
    # Optimization factors and metadata
    optimization_factors = Column(JSON, nullable=True)  # Store factors used in optimization
    algorithm_used = Column(String(100), nullable=True)  # Algorithm name/version
    confidence_score = Column(Numeric(5, 4), nullable=True)  # 0.0 to 1.0
    
    # Status and validity
    is_active = Column(Boolean, default=True)
    is_applied = Column(Boolean, default=False)  # Whether this optimization has been applied
    
    # Timestamps
    calculated_at = Column(DateTime(timezone=True), server_default=func.now())
    applied_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    product = relationship("Product", back_populates="pricing_optimizations")
    
    def __repr__(self):
        return f"<PricingOptimization(product_id={self.product_id}, current={self.current_price}, optimized={self.optimized_price})>"
    
    @property
    def price_change_percentage(self):
        """Calculate percentage change from current to optimized price"""
        if self.current_price and self.optimized_price:
            return float((self.optimized_price - self.current_price) / self.current_price * 100)
        return 0.0
    
    @property
    def potential_revenue_increase(self):
        """Calculate potential revenue increase"""
        if self.expected_revenue and self.expected_demand and self.current_price:
            current_revenue = float(self.expected_demand * self.current_price)
            return float(self.expected_revenue - current_revenue)
        return 0.0

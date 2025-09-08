from sqlalchemy import Column, String, Integer, Numeric, DateTime, Date, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from ..database import Base

class DemandForecast(Base):
    __tablename__ = "demand_forecasts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False, index=True)
    
    # Forecast data
    forecasted_demand = Column(Numeric(10, 2), nullable=False)
    price_point = Column(Numeric(10, 2), nullable=False)
    forecast_date = Column(Date, nullable=False)
    forecast_period = Column(String(50), nullable=False)  # 'weekly', 'monthly', 'quarterly'
    
    # Additional forecast metadata
    forecast_data = Column(JSON, nullable=True)  # Store additional forecast details
    confidence_score = Column(Numeric(5, 4), nullable=True)  # 0.0 to 1.0
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    product = relationship("Product", back_populates="forecasts")
    
    def __repr__(self):
        return f"<DemandForecast(product_id={self.product_id}, demand={self.forecasted_demand}, date={self.forecast_date})>"

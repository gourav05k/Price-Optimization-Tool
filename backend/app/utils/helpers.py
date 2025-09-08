from datetime import datetime
from typing import Optional

def get_current_timestamp() -> datetime:
    """Get current UTC timestamp"""
    return datetime.utcnow()

def format_currency(amount: float) -> str:
    """Format amount as currency"""
    return f"${amount:.2f}"

def calculate_profit_margin(selling_price: float, cost_price: float) -> float:
    """Calculate profit margin percentage"""
    if selling_price <= 0:
        return 0.0
    return ((selling_price - cost_price) / selling_price) * 100

def calculate_profit_per_unit(selling_price: float, cost_price: float) -> float:
    """Calculate profit per unit"""
    return selling_price - cost_price

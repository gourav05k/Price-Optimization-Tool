import os
from typing import Optional

class Settings:
    # Database Configuration
    DATABASE_URL: str = "postgresql://postgres:12345678@127.0.0.1:5432/price_optimization"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "12345678"
    POSTGRES_DB: str = "price_optimization"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    
    # JWT Configuration
    SECRET_KEY: str = "your-secret-key-change-this-in-production-bcgx-price-optimization-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Application Configuration
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    
    # CORS Configuration
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",  # Vite default port
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]

settings = Settings()

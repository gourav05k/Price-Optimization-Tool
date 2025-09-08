import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import auth_router, products_router

# Create FastAPI application
app = FastAPI(
    title="Price Optimization Tool API",
    description="BCG X Price Optimization Tool - Backend API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include API routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(products_router, prefix="/api/v1")

# Root endpoint
@app.get("/")
def read_root():
    return {
        "message": "Price Optimization Tool API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

# Health check endpoint
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "price-optimization-api",
        "version": "1.0.0"
    }


from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from decimal import Decimal
from app.database import get_db
from app.schemas.product import (
    ProductCreate, ProductUpdate, ProductResponse, 
    ProductListResponse, ProductSearchParams
)
from app.services.product_service import ProductService
from app.dependencies import get_current_active_user, get_current_user_optional
from app.models.user import User

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/", response_model=ProductListResponse)
def get_products(
    search: Optional[str] = Query(None, description="Search in product name and description"),
    category: Optional[str] = Query(None, description="Filter by category"),
    min_price: Optional[Decimal] = Query(None, description="Minimum price filter"),
    max_price: Optional[Decimal] = Query(None, description="Maximum price filter"),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Page size"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Get products with search and pagination"""
    search_params = ProductSearchParams(
        search=search,
        category=category,
        min_price=min_price,
        max_price=max_price,
        page=page,
        size=size
    )
    
    return ProductService.get_products(db, search_params, current_user)

@router.get("/categories", response_model=List[str])
def get_categories(
    db: Session = Depends(get_db)
):
    """Get all product categories"""
    return ProductService.get_categories(db)

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Get product by ID"""
    product = ProductService.get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new product"""
    return ProductService.create_product(db, product_data, current_user)

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update an existing product"""
    return ProductService.update_product(db, product_id, product_data, current_user)

@router.delete("/{product_id}")
def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a product"""
    success = ProductService.delete_product(db, product_id, current_user)
    if success:
        return {"message": "Product deleted successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete product"
        )

@router.get("/search/advanced")
def advanced_product_search(
    q: Optional[str] = Query(None, description="Search query"),
    categories: Optional[List[str]] = Query(None, description="Categories to filter"),
    price_range: Optional[str] = Query(None, description="Price range (e.g., '10-50')"),
    rating_min: Optional[float] = Query(None, ge=0, le=5, description="Minimum rating"),
    in_stock: Optional[bool] = Query(None, description="Filter by stock availability"),
    db: Session = Depends(get_db)
):
    """Advanced product search with multiple filters"""
    # This is a placeholder for advanced search functionality
    # You can implement more complex search logic here
    return {"message": "Advanced search endpoint", "query": q}

# Bulk operations
@router.post("/bulk/update-prices")
def bulk_update_prices(
    updates: dict,  # {product_id: {field: value}}
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Bulk update product prices"""
    product_ids = list(updates.keys())
    updated_products = ProductService.bulk_update_prices(
        db, product_ids, updates, current_user
    )
    return {
        "message": f"Updated {len(updated_products)} products",
        "updated_products": [str(p.id) for p in updated_products]
    }

# Health check
@router.get("/health/check")
def products_health_check():
    """Products service health check"""
    return {"status": "healthy", "service": "products"}

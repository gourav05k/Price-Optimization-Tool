from sqlalchemy.orm import Session
from sqlalchemy import and_, func, or_
from fastapi import HTTPException, status
from typing import List, Optional
from decimal import Decimal
from app.models.product import Product
from app.models.user import User
from app.schemas.product import ProductCreate, ProductUpdate, ProductSearchParams, ProductListResponse

class ProductService:
    """Product service for business logic"""
    
    @staticmethod
    def get_products(
        db: Session, 
        search_params: ProductSearchParams,
        current_user: Optional[User] = None
    ) -> ProductListResponse:
        """Get products with search and pagination"""
        query = db.query(Product).filter(Product.is_active == True)
        
        # Apply search filters
        if search_params.search:
            search_term = f"%{search_params.search}%"
            query = query.filter(
                or_(
                    Product.name.ilike(search_term),
                    Product.description.ilike(search_term)
                )
            )
        
        if search_params.category:
            query = query.filter(Product.category == search_params.category)
        
        if search_params.min_price:
            query = query.filter(Product.selling_price >= search_params.min_price)
        
        if search_params.max_price:
            query = query.filter(Product.selling_price <= search_params.max_price)
        
        # Get total count
        total = query.count()
        
        # Sort by creation date (newest first) to show recently added products first
        query = query.order_by(Product.created_at.desc())
        
        # Apply pagination
        offset = (search_params.page - 1) * search_params.size
        products = query.offset(offset).limit(search_params.size).all()
        
        return ProductListResponse(
            products=products,
            total=total,
            page=search_params.page,
            size=search_params.size
        )
    
    @staticmethod
    def get_product_by_id(db: Session, product_id: str) -> Optional[Product]:
        """Get product by UUID"""
        return db.query(Product).filter(
            and_(Product.id == product_id, Product.is_active == True)
        ).first()
    
    @staticmethod
    def get_product_by_product_id(db: Session, product_id: int) -> Optional[Product]:
        """Get product by product_id (integer)"""
        return db.query(Product).filter(
            and_(Product.product_id == product_id, Product.is_active == True)
        ).first()
    
    @staticmethod
    def create_product(
        db: Session, 
        product_data: ProductCreate, 
        current_user: User
    ) -> Product:
        """Create a new product"""
        # Auto-generate product_id
        max_product_id = db.query(func.max(Product.product_id)).scalar() or 0
        new_product_id = max_product_id + 1
        
        # Create new product
        product_dict = product_data.dict()
        db_product = Product(
            **product_dict,
            product_id=new_product_id,  # Auto-generated
            created_by=current_user.id,
            is_active=True
        )
        
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product
    
    @staticmethod
    def update_product(
        db: Session, 
        product_id: str, 
        product_data: ProductUpdate,
        current_user: User
    ) -> Optional[Product]:
        """Update an existing product"""
        product = ProductService.get_product_by_id(db, product_id)
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        # Update product fields
        update_data = product_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(product, field, value)
        
        db.commit()
        db.refresh(product)
        return product
    
    @staticmethod
    def delete_product(db: Session, product_id: str, current_user: User) -> bool:
        """Soft delete a product"""
        product = ProductService.get_product_by_id(db, product_id)
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        # Soft delete
        product.is_active = False
        db.commit()
        return True
    
    @staticmethod
    def get_categories(db: Session) -> List[str]:
        """Get all unique product categories"""
        categories = db.query(Product.category).filter(
            Product.is_active == True
        ).distinct().all()
        return [category[0] for category in categories]
    
    @staticmethod
    def bulk_update_prices(
        db: Session, 
        product_ids: List[str], 
        price_updates: dict,
        current_user: User
    ) -> List[Product]:
        """Bulk update product prices"""
        products = db.query(Product).filter(
            and_(
                Product.id.in_(product_ids),
                Product.is_active == True
            )
        ).all()
        
        if not products:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No products found for update"
            )
        
        updated_products = []
        for product in products:
            if str(product.id) in price_updates:
                update_data = price_updates[str(product.id)]
                for field, value in update_data.items():
                    if hasattr(product, field):
                        setattr(product, field, value)
                updated_products.append(product)
        
        db.commit()
        return updated_products

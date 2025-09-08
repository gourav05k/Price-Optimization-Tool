#!/usr/bin/env python3
"""
Script to import product data from CSV into the database
"""
import sys
import os
import csv
from decimal import Decimal

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import Product

def import_products_from_csv(csv_file_path):
    """Import products from CSV file"""
    db = SessionLocal()
    
    try:
        # Clear existing products (for fresh import)
        db.query(Product).delete()
        db.commit()
        print("🗑️  Cleared existing products")
        
        # Read and import CSV data
        with open(csv_file_path, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            products_added = 0
            
            for row in csv_reader:
                # Skip empty rows
                if not row.get('product_id'):
                    continue
                    
                # Create product object
                product = Product(
                    product_id=int(row['product_id']),
                    name=row['name'],
                    description=row['description'],
                    cost_price=Decimal(row['cost_price']),
                    selling_price=Decimal(row['selling_price']),
                    category=row['category'],
                    stock_available=int(row['stock_available']),
                    units_sold=int(row['units_sold']),
                    customer_rating=Decimal(row['customer_rating']) if row['customer_rating'] else None,
                    demand_forecast=int(row['demand_forecast']) if row['demand_forecast'] else None,
                    optimized_price=Decimal(row['optimized_price']) if row['optimized_price'] else None,
                    is_active=True
                )
                
                db.add(product)
                products_added += 1
                print(f"➕ Added: {product.name} (ID: {product.product_id})")
            
            # Commit all changes
            db.commit()
            print(f"\n✅ Successfully imported {products_added} products!")
            
            # Display summary
            print("\n📊 Import Summary:")
            categories = db.query(Product.category).distinct().all()
            for (category,) in categories:
                count = db.query(Product).filter(Product.category == category).count()
                print(f"   - {category}: {count} products")
                
    except Exception as e:
        db.rollback()
        print(f"❌ Error importing data: {e}")
        return False
    finally:
        db.close()
    
    return True

def verify_import():
    """Verify the imported data"""
    db = SessionLocal()
    
    try:
        total_products = db.query(Product).count()
        print(f"\n🔍 Verification:")
        print(f"   Total products in database: {total_products}")
        
        # Show first few products
        products = db.query(Product).limit(3).all()
        print(f"\n📋 Sample products:")
        for product in products:
            print(f"   - {product.name} | ${product.selling_price} | {product.category}")
            
    except Exception as e:
        print(f"❌ Error verifying data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("📥 Importing Product Data from CSV...")
    
    # Path to CSV file (adjust if needed)
    csv_path = "../product_data.csv"
    
    if not os.path.exists(csv_path):
        print(f"❌ CSV file not found: {csv_path}")
        print("💡 Make sure product_data.csv is in the parent directory")
        sys.exit(1)
    
    # Import data
    if import_products_from_csv(csv_path):
        verify_import()
        print("\n🎉 Data import completed successfully!")
    else:
        print("❌ Data import failed!")
        sys.exit(1)

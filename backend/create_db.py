#!/usr/bin/env python3
"""
Script to create the database and tables
"""
import sys
import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Database connection parameters
DB_HOST = "127.0.0.1"
DB_PORT = "5432"
DB_USER = "postgres"
DB_PASSWORD = "12345678"
DB_NAME = "price_optimization"

def create_database():
    """Create the price_optimization database if it doesn't exist"""
    try:
        # Connect to the default postgres database
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database="postgres"
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (DB_NAME,))
        exists = cursor.fetchone()
        
        if not exists:
            cursor.execute(f'CREATE DATABASE "{DB_NAME}"')
            print(f"✅ Database '{DB_NAME}' created successfully!")
        else:
            print(f"✅ Database '{DB_NAME}' already exists!")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        return False

def create_tables():
    """Create tables using SQLAlchemy"""
    try:
        # Add the current directory to Python path
        sys.path.append(os.path.dirname(os.path.abspath(__file__)))
        
        from app.database import engine, Base
        from app.models import User, Product, DemandForecast, PricingOptimization
        
        # Test connection to our database
        with engine.connect() as connection:
            print("✅ Database connection successful!")
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        
        print("\n🎉 Database setup complete!")
        print("📊 Tables created:")
        print("   - users")
        print("   - products") 
        print("   - demand_forecasts")
        print("   - pricing_optimizations")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Setting up Price Optimization Database...")
    
    # Step 1: Create database
    if create_database():
        # Step 2: Create tables
        create_tables()
    else:
        print("❌ Failed to create database. Exiting.")
        sys.exit(1)

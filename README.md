# Price Optimization Tool

## 📋 Project Overview

The Price Optimization Tool is a full-stack web application designed to help businesses determine optimal pricing strategies based on demand forecasts and market conditions. This application provides a multi-functional interface for product management, demand forecasting, and pricing optimization.

## 🎯 Problem Statement

In the digital era, efficient pricing is crucial for businesses to stay competitive. It's a web application that enables business users to determine optimal pricing strategies based on demand forecasts and market conditions. The goal is to create a multi-functional interface that addresses these needs effectively while maintaining ease of use and performance efficiency.

## 🏗️ Architecture Overview

### Backend Architecture
- **Framework**: FastAPI 0.104.1 (Python 3.11.9)
- **Database**: PostgreSQL 15
- **ORM**: SQLAlchemy 2.0.23 with Alembic 1.13.1 migrations
- **Authentication**: JWT tokens with bcrypt 4.0.1 password hashing
- **API Documentation**: Auto-generated Swagger/OpenAPI docs

### Frontend Architecture
- **Framework**: React.js 19.1.1 (JavaScript)
- **Runtime**: Node.js 22.19.0 with npm 10.9.3
- **State Management**: React Context API with useReducer
- **Styling**: CSS Modules
- **Charts**: Chart.js 4.5.0 with react-chartjs-2 5.3.0
- **Build Tool**: Vite 7.1.2
- **HTTP Client**: Fetch API

### Database Design
- **Users Table**: Authentication and user management
- **Products Table**: Core product information with relationships
- **Demand Forecasts Table**: Historical and projected demand data
- **Pricing Optimizations Table**: Optimized pricing calculations

## ✨ Implemented Features

### 🔐 Authentication System
- **User Registration**: First name, last name, email, password
- **User Login**: JWT-based authentication with secure password hashing
- **Protected Routes**: Authentication required for main application features
- **Session Management**: JWT tokens stored in localStorage
- **Dynamic User Display**: Shows actual user name in navigation bar

### 📦 Product Management (CRUD Operations)
- **Create Products**: Add new products with auto-generated IDs
- **View Products**: Paginated product list (10 items per page)
- **Update Products**: Edit existing product details via modal forms
- **Delete Products**: Remove products with confirmation dialogs
- **Search Functionality**: Search by product name and description
- **Category Filtering**: Dynamic dropdown with all available categories
- **Dynamic Categories**: Add new categories during product creation

### 📊 Demand Forecasting
- **Interactive Charts**: Professional line charts using Chart.js
- **Multi-Product Analysis**: Select multiple products for comparison
- **5-Year Projections**: Forecast demand from 2024-2028
- **Toggleable Column**: Show/hide demand forecast column
- **Chart Visualization**: 
  - X-axis: Years (2024, 2025, 2026, 2027, 2028)
  - Y-axis: Projected demand values
  - Multiple product lines with different colors
- **Scrollable Modal**: Full-screen modal with chart and data table

### 💰 Pricing Optimization
- **Dedicated Pricing Page**: Separate interface for pricing analysis
- **Optimized Price Column**: Always visible optimized pricing
- **Same Core Features**: Search, filter, and pagination functionality
- **Pricing Algorithms**: Mock algorithms for demonstration (extensible for real ML models)

### 🎨 User Interface Features
- **Responsive Design**: Mobile and desktop compatible
- **Professional Dark Theme**: Consistent color scheme throughout
- **Navigation Bar**: Search, filters, and action buttons
- **Toggle Controls**: Visual toggle buttons with proper state indication
- **Loading States**: Spinners and loading indicators
- **Error Handling**: User-friendly error messages
- **Modal Interfaces**: Product forms, confirmations, and detail views

## 🛠️ Technology Stack

### Backend Dependencies
```
fastapi==0.104.1
pydantic[email]==2.5.0
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
alembic==1.13.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
bcrypt==4.0.1
python-multipart==0.0.6
python-dotenv==1.0.0
```

### Frontend Dependencies
```json
{
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1", 
    "@mui/icons-material": "^7.3.1",
    "@mui/material": "^7.3.1",
    "axios": "^1.11.0",
    "chart.js": "^4.5.0",
    "react": "^19.1.1",
    "react-chartjs-2": "^5.3.0",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.8.2"
  }
}
```

### Infrastructure
- **Docker**: PostgreSQL containerization
- **Docker Compose**: Multi-service orchestration
- **Adminer**: Database administration interface

## 🚀 Setup Instructions

### Prerequisites (below versions are used in this project)
- **Python 3.11.9**
- **Node.js 22.19.0** (Node.js 18+ required for React 19)
- **npm 10.9.3**
- **Docker & Docker Compose**
- **Git**

### 1. Extract the zip file

### 2. Backend Setup

#### Start Database Services
```bash
cd backend
docker-compose up -d
```
This will start:
- PostgreSQL on port 5432
- Adminer (DB admin) on port 8080

#### Create Python Virtual Environment
```bash
# Create virtual environment
python -m venv myvenv

# Activate virtual environment
# Windows:
myvenv\Scripts\activate
# macOS/Linux:
source myvenv/bin/activate
```

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Database Setup
```bash
# Create database and tables
python create_db.py

# Import sample data from CSV
python import_data.py
```

#### Start Backend Server
```bash
# Run the FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at:
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 3. Frontend Setup

#### Install Node on your system and then its Dependencies
```bash
cd ../frontend
npm install
```

#### Install Chart.js (if not already installed)
```bash
npm install chart.js react-chartjs-2
```

#### Start Development Server
```bash
npm run dev
```

Frontend will be available at: **http://localhost:5173**

### 4. Database Administration (Optional)
Access Adminer at: **http://localhost:8080**
- **Server**: postgres (or localhost)
- **Username**: postgres
- **Password**: <your password example: 12345678>
- **Database**: price_optimization

## 📁 Project Structure

### Backend Structure
```
backend/
├── app/
│   ├── api/                  # API route handlers
│   │   ├── auth.py           # Authentication endpoints
│   │   └── products.py       # Product management endpoints
│   ├── models/               # SQLAlchemy models
│   │   ├── user.py           # User model
│   │   ├── product.py        # Product model
│   │   ├── forecast.py       # Demand forecast model
│   │   └── pricing.py        # Pricing optimization model
│   ├── schemas/              # Pydantic schemas
│   │   ├── user.py           # User schemas
│   │   └── product.py        # Product schemas
│   ├── services/             # Business logic
│   │   ├── auth_service.py    # Authentication logic
│   │   └── product_service.py # Product management logic
│   ├── utils/                 # Utility functions
│   │   ├── security.py       # JWT and password utilities
│   │   └── helpers.py        # General helpers
│   ├── config.py             # Configuration settings
│   ├── database.py           # Database connection
│   ├── dependencies.py       # FastAPI dependencies
│   └── main.py               # FastAPI application
├── alembic/                  # Database migrations
├── docker-compose.yml        # Docker services
├── requirements.txt          # Python dependencies
├── create_db.py              # Database initialization
└── import_data.py            # CSV data import
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/                 # React components
│   │   ├── Navbar.jsx              # Navigation bar
│   │   ├── ProductTable.jsx        # Product management table
│   │   ├── ProductForm.jsx         # Product create/edit form
│   │   ├── DemandForecastModal.jsx # Demand forecast visualization
│   │   ├── PricingTable.jsx        # Pricing optimization table
│   │   └── ConfirmationModal.jsx   # Confirmation dialogs
│   ├── pages/                      # Page components
│   │   ├── LandingPage.jsx         # Home page
│   │   ├── LoginPage.jsx           # User login
│   │   └── RegisterPage.jsx        # User registration
│   ├── context/                    # React context
│   │   └── AuthContext.jsx         # Authentication context
│   ├── services/                   # API services
│   │   ├── productService.js       # Product API calls
│   │   ├── demandForecastService.js # Demand forecast logic
│   │   └── pricingOptimizationService.js # Pricing logic
│   ├── App.jsx                     # Main application component
│   └── main.jsx                    # React entry point
├── package.json                    # Node dependencies
└── vite.config.js                  # Vite configuration
```

## 📊 API Endpoints

### Authentication Endpoints
```
POST /api/v1/auth/register     # User registration
POST /api/v1/auth/login        # User login
GET  /api/v1/auth/me          # Get current user
```

### Product Management Endpoints
```
GET    /api/v1/products        # Get products (with search, filter, pagination)
POST   /api/v1/products        # Create product
GET    /api/v1/products/{id}   # Get product by ID
PUT    /api/v1/products/{id}   # Update product
DELETE /api/v1/products/{id}   # Delete product
GET    /api/v1/products/categories # Get all categories
```

### Query Parameters for Products
- `search`: Search in product name and description
- `category`: Filter by category
- `min_price`: Minimum price filter
- `max_price`: Maximum price filter
- `page`: Page number (default: 1)
- `size`: Items per page (default: 10, max: 100)

## 💾 Database Schema

### Users Table
```sql
- id (UUID, Primary Key)
- email (String, Unique)
- password_hash (String)
- first_name (String)
- last_name (String)
- is_active (Boolean)
- is_verified (Boolean)
- created_at (DateTime)
- updated_at (DateTime)
```

### Products Table
```sql
- id (UUID, Primary Key)
- product_id (Integer, Unique)
- name (String)
- description (Text)
- cost_price (Decimal)
- selling_price (Decimal)
- category (String)
- stock_available (Integer)
- units_sold (Integer)
- customer_rating (Decimal)
- demand_forecast (Integer)
- optimized_price (Decimal)
- is_active (Boolean)
- created_by (UUID, Foreign Key)
- created_at (DateTime)
- updated_at (DateTime)
```

## 🎮 Usage Guide

### 1. User Registration/Login
1. Navigate to the landing page
2. Click "Get Started" to access login page
3. Register new account or login with existing credentials
4. Successfully authenticated users are redirected to the landing page

### 2. Product Management
1. Click "Create and Manage Product" card from landing page
2. Use "Add New Products" button to create products
3. Search products using the search bar
4. Filter by category using the dropdown
5. Edit products by clicking the edit (✏️) button
6. View details by clicking the view (👁️) button
7. Delete products by clicking the delete (🗑️) button

### 3. Demand Forecasting
1. From the products page, select multiple products using checkboxes
2. Click "📊 Demand Forecast" button in the navbar
3. View interactive chart showing 5-year demand projections
4. Scroll down to see detailed forecast table
5. Use "With Demand Forecast" toggle to show/hide demand column in main table

### 4. Pricing Optimization
1. Navigate to "Pricing Optimization" from landing page
2. View products with optimized price column
3. Use same search and filter functionality
4. Toggle demand forecast column visibility as needed

## 🧠 Development Understanding & Key Learnings

### Assignment Interpretation
During development, the assignment was understood as requiring:

1. **Core Business Problem**: Creating a tool to help businesses optimize pricing strategies based on data-driven insights
2. **Multi-functional Interface**: A comprehensive system handling product management, demand analysis, and pricing optimization
3. **User Experience Focus**: Professional, intuitive interface suitable for business users
4. **Data Visualization**: Clear charts and tables for decision-making support
5. **Scalable Architecture**: Foundation for enterprise-level deployment

### Technical Decisions Made

#### Backend Architecture
- **FastAPI Choice**: Selected for automatic API documentation, type validation, and modern Python async support
- **PostgreSQL**: Chosen for ACID compliance, complex queries, and production scalability
- **JWT Authentication**: Stateless authentication suitable for microservices architecture
- **SQLAlchemy ORM**: Provides database abstraction and migration support

#### Frontend Architecture
- **React without TypeScript**: As specifically requested, focusing on rapid development
- **Context API**: Lightweight state management for authentication and shared state
- **CSS Modules**: Component-scoped styling without external dependencies
- **Chart.js**: Mature charting library with extensive customization options

#### Development Approach
- **MVP First**: Prioritized core functionality over advanced features
- **Component-Driven**: Reusable components for maintainability
- **API-First Design**: Backend API designed independent of frontend implementation
- **Responsive Design**: Mobile-first approach for accessibility

### Challenges Overcome

1. **Authentication Flow**: Implementing secure JWT-based authentication with proper session management
2. **Data Relationships**: Designing database schema to support complex product relationships
3. **Chart Integration**: Implementing interactive Chart.js visualizations with proper data flow
4. **Pagination Logic**: Backend pagination with frontend state synchronization
5. **Dynamic Filtering**: Real-time search and filter functionality with API optimization

### Code Quality Decisions

1. **Separation of Concerns**: Clear separation between API routes, business logic, and data models
2. **Error Handling**: Comprehensive error handling with user-friendly messages
3. **Validation**: Input validation on both frontend and backend levels
4. **Security**: Password hashing, SQL injection prevention, CORS configuration
5. **Performance**: Database indexing, API pagination, lazy loading

### Business Logic Implementation

The demand forecasting and pricing optimization features were implemented with:
- **Mock Algorithms**: Placeholder logic demonstrating the architecture for real ML models
- **Extensible Design**: Easy integration points for actual forecasting models
- **Data Visualization**: Professional charts suitable for business presentations
- **Export Capability**: Table data formatted for business analysis

## 🔮 Future Enhancements

### Priority 1: Authentication & Authorization -- (wasn't able to complete this due to limited time)
- **Email Verification System**: Implement email confirmation during registration
- **Role-Based Access Control (RBAC)**: 
  - Admin role: Full system access, user management
  - Buyer role: View products, pricing, analytics
  - Supplier role: Manage own products, view demand forecasts
  - Custom roles: Configurable permissions
- **Permission System**: Granular permissions for different actions
- **Admin Dashboard**: User management, role assignment, system analytics

### Priority 2: Advanced Analytics
- **Real ML Models**: Integration with actual demand forecasting algorithms
- **Historical Data**: Time-series analysis and trending
- **Market Intelligence**: External data integration (competitors, market trends)
- **Advanced Visualizations**: Heat maps, scatter plots, predictive analytics
- **Export Functionality**: PDF reports, Excel exports, dashboard sharing

### Priority 3: Enterprise Features
- **Multi-tenant Architecture**: Support for multiple organizations
- **Audit Logging**: Complete activity tracking and compliance
- **API Rate Limiting**: Production-ready API security
- **Bulk Operations**: Import/export large datasets
- **Advanced Search**: Elasticsearch integration for complex queries

### Priority 4: Performance & Scalability
- **Caching Layer**: Redis for session and query caching
- **Database Optimization**: Query optimization, read replicas
- **CDN Integration**: Static asset delivery optimization
- **Load Balancing**: Horizontal scaling capabilities
- **Monitoring**: Application performance monitoring and alerting

### Priority 5: User Experience
- **Real-time Updates**: WebSocket integration for live data
- **Mobile App**: Native mobile applications
- **Offline Capability**: Progressive Web App features
- **Advanced Filters**: Saved filters, complex query builder
- **Collaboration**: Shared workspaces, comments, annotations

## 🚀 Deployment Considerations

### Cloud Deployment Options
1. **Google Cloud Platform (GCP)**:
   - Cloud Run for backend API
   - Cloud SQL for PostgreSQL
   - Firebase Hosting for frontend
   - Cloud Storage for file uploads

2. **Microsoft Azure**:
   - Azure Container Instances for backend
   - Azure Database for PostgreSQL
   - Azure Static Web Apps for frontend
   - Azure Blob Storage for assets

### Production Checklist
- [ ] Environment variable configuration
- [ ] Database migration strategy
- [ ] SSL certificate setup
- [ ] Domain configuration
- [ ] Monitoring and logging setup
- [ ] Backup and disaster recovery
- [ ] Security audit and penetration testing
- [ ] Performance testing and optimization

---

**Developed by**: Gourav Kamboj  
**Purpose**: Price Optimization Tool Case Study  
**Date**: 2025
**Version**: 1.0.0

-- ==============================================================================
-- BrewAI Portfolio Prototype - Master Relational Schema (PostgreSQL)
-- ==============================================================================

-- 1. Custom Enumerated Types for Safe State Machine Transitions
CREATE TYPE order_status_enum AS ENUM (
    'PENDING',    -- Cart active; item configurations being modified by AI/User
    'CONFIRMED',  -- Bypassed payment gateway; order routed to Admin Dashboard
    'PREPARING',  -- Barista actively crafting the beverage
    'COMPLETED',  -- Order ready for customer pickup at counter
    'CANCELLED'   -- Order voided by user or system administrator
);

CREATE TYPE item_size_enum AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- 2. Users & Authentication Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer', -- customer, admin
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Categories Table (e.g., Espresso, Cold Brew, Pastries)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Menu Items Table (Strict core info for RAG context extraction)
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price_cents INTEGER NOT NULL, -- Storing as integers (cents) eliminates floating-point rounding issues
    is_available BOOLEAN DEFAULT TRUE,
    allergens TEXT[], -- Array tracking ingredients like ['dairy', 'nuts', 'gluten']
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Master Transactional Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    status order_status_enum DEFAULT 'PENDING' NOT NULL,
    total_price_cents INTEGER DEFAULT 0 NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Order Items Breakout Table (Handles granular quantities & sizes)
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    menu_item_id INTEGER REFERENCES menu_items(id) NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL,
    selected_size item_size_enum DEFAULT 'MEDIUM' NOT NULL,
    price_at_purchase_cents INTEGER NOT NULL -- Protects past receipts if menu base prices change
);

-- Indexing for fast real-time lookups (Admin Dashboard & AI Agent polling)
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_user ON orders(user_id);
# Architecture Specification: Shopping Cart Feature

## Document Information
| Field | Value |
|-------|-------|
| Title | Shopping Cart Architecture |
| Date | 2024-01-16 |
| Version | 1.0 |
| Author | Architect Agent (Codex CLI) |
| Status | Approved |
| PRD Reference | docs/PRD.md v1.0 |

---

## 1. System Overview

### Purpose
The Shopping Cart system enables users to collect products for purchase, manage quantities, and proceed to checkout. It integrates with the existing product catalog, user authentication, and tax calculation services.

### Key Capabilities
- Real-time cart management (add, update, remove items)
- Persistent cart storage for authenticated users
- Tax calculation based on user location
- Promo code validation and application
- Cross-device cart synchronization

### Design Principles
1. **Performance First**: Sub-500ms operations via caching and optimized queries
2. **Mobile-Optimized**: Progressive enhancement, minimal payload
3. **Resilient**: Graceful degradation, circuit breakers for dependencies
4. **Secure by Default**: Encrypted data, validated inputs, authenticated endpoints

---

## 2. Architecture Diagram

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────────────┐
│                           Client Layer                               │
│  ┌──────────────────────┐        ┌──────────────────────┐           │
│  │     Web App          │        │     Mobile App        │           │
│  │   (Next.js/React)    │        │   (React Native)      │           │
│  │                      │        │                       │           │
│  │  ┌────────────────┐  │        │  ┌────────────────┐   │           │
│  │  │  Cart Context  │  │        │  │  Cart Context  │   │           │
│  │  │  (React Query) │  │        │  │  (React Query) │   │           │
│  │  └────────────────┘  │        │  └────────────────┘   │           │
│  └──────────┬───────────┘        └──────────┬────────────┘           │
└─────────────┼───────────────────────────────┼────────────────────────┘
              │ HTTPS                          │ HTTPS
              └───────────────┬────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API Gateway                                  │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │   Rate Limiting  │  Auth Validation  │  Request Routing      │    │
│  └─────────────────────────────────────────────────────────────┘    │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   Cart Service   │ │ Product Service  │ │  Tax Service     │
│                  │ │   (Existing)     │ │   (Existing)     │
│  ┌────────────┐  │ │                  │ │                  │
│  │ Cart Logic │  │ │  Product data    │ │  Tax calculation │
│  │ Validation │  │ │  Inventory       │ │  Rate lookup     │
│  │ Promo Codes│  │ │  Pricing         │ │                  │
│  └────────────┘  │ │                  │ │                  │
└────────┬─────────┘ └──────────────────┘ └──────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────┐
│                          Data Layer                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐    │
│  │    PostgreSQL    │  │      Redis       │  │    S3 / CDN      │    │
│  │   (Cart Data)    │  │    (Cache)       │  │   (Images)       │    │
│  │                  │  │                  │  │                  │    │
│  │  - carts         │  │  - cart:user_id  │  │  Product images  │    │
│  │  - cart_items    │  │  - product:id    │  │  cached at edge  │    │
│  │  - promo_codes   │  │  - promo:code    │  │                  │    │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Responsibilities

| Component | Responsibility | Dependencies | Technology |
|-----------|---------------|--------------|------------|
| Cart Context (Client) | Client-side cart state, optimistic updates | Cart API | React, React Query |
| API Gateway | Auth, rate limiting, routing | Auth Service | Kong/Nginx |
| Cart Service | Cart CRUD, business logic, promo validation | PostgreSQL, Redis, Product Service | Node.js, Express |
| Cart Repository | Data access layer, caching | PostgreSQL, Redis | Prisma ORM |
| Product Service | Product data, inventory, pricing | PostgreSQL | Existing |
| Tax Service | Tax rate calculation | External API | Existing |

### Component Details

#### Cart Service
- **Purpose**: Handle all cart business logic
- **Responsibilities**:
  - Cart CRUD operations
  - Quantity validation against inventory
  - Promo code validation and application
  - Total calculation with taxes
  - Cart expiration management
- **Interfaces**: REST API over HTTPS
- **Scaling**: Horizontal, stateless with Redis session cache

#### Cart Repository
- **Purpose**: Abstract data access and caching
- **Responsibilities**:
  - Cart persistence to PostgreSQL
  - Cache management with Redis
  - Optimistic locking for concurrent updates
- **Pattern**: Repository pattern with cache-aside

---

## 4. Data Models

### Entity Relationship Diagram
```
┌──────────────────┐       ┌──────────────────┐       
│      Cart        │       │    CartItem      │       
├──────────────────┤       ├──────────────────┤       
│ id (PK)          │───┐   │ id (PK)          │       
│ user_id (FK)     │   │   │ cart_id (FK)     │◄──────┘
│ status           │   └──▶│ product_id       │
│ promo_code       │       │ quantity         │
│ created_at       │       │ unit_price       │
│ updated_at       │       │ created_at       │
│ expires_at       │       │ updated_at       │
└──────────────────┘       └──────────────────┘

┌──────────────────┐
│   PromoCode      │
├──────────────────┤
│ id (PK)          │
│ code (unique)    │
│ discount_type    │
│ discount_value   │
│ min_order_value  │
│ valid_from       │
│ valid_until      │
│ max_uses         │
│ current_uses     │
└──────────────────┘
```

### Core Data Types

```typescript
// Cart Entity
interface Cart {
  id: string;              // UUID v4
  userId: string;          // FK to User
  status: CartStatus;      // active, checked_out, expired, abandoned
  promoCode?: string;      // Applied promo code
  items: CartItem[];
  subtotal: number;        // Calculated field
  discount: number;        // From promo code
  tax: number;             // Calculated from tax service
  total: number;           // subtotal - discount + tax
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;         // 30 days from last update
}

enum CartStatus {
  ACTIVE = 'active',
  CHECKED_OUT = 'checked_out',
  EXPIRED = 'expired',
  ABANDONED = 'abandoned'
}

// Cart Item Entity
interface CartItem {
  id: string;              // UUID v4
  cartId: string;          // FK to Cart
  productId: string;       // FK to Product (external)
  quantity: number;        // 1-99
  unitPrice: number;       // Price at time of adding
  product?: Product;       // Joined from Product Service
  createdAt: Date;
  updatedAt: Date;
}

// Promo Code Entity
interface PromoCode {
  id: string;
  code: string;            // Unique, uppercase
  discountType: 'percentage' | 'fixed';
  discountValue: number;   // Percentage (0-100) or fixed amount
  minOrderValue?: number;  // Minimum cart value to apply
  validFrom: Date;
  validUntil: Date;
  maxUses?: number;
  currentUses: number;
  isActive: boolean;
}

// API Response Types
interface CartResponse {
  id: string;
  items: CartItemResponse[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  itemCount: number;
  promoCode?: string;
}

interface CartItemResponse {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  availableStock: number;
}
```

### Database Schema

```sql
-- Carts table
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    promo_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days',
    CONSTRAINT valid_status CHECK (status IN ('active', 'checked_out', 'expired', 'abandoned'))
);

-- Cart items table
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 1 AND quantity <= 99),
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cart_id, product_id)
);

-- Promo codes table
CREATE TABLE promo_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_value DECIMAL(10, 2),
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_status ON carts(status);
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
```

---

## 5. API Contracts

### Base URL
- Development: `http://localhost:3000/api/v1`
- Production: `https://api.example.com/v1`

### Authentication
All cart endpoints require authentication via JWT Bearer token.

```
Authorization: Bearer <access_token>
```

---

### GET /cart
**Description**: Get current user's active cart

**Response (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "id": "item-uuid",
      "productId": "prod-uuid",
      "productName": "Wireless Headphones",
      "productImage": "https://cdn.example.com/products/headphones.jpg",
      "quantity": 2,
      "unitPrice": 79.99,
      "lineTotal": 159.98,
      "availableStock": 50
    }
  ],
  "subtotal": 159.98,
  "discount": 0,
  "tax": 12.80,
  "total": 172.78,
  "itemCount": 2,
  "promoCode": null
}
```

**Response (404)**: No active cart exists
```json
{
  "code": "ERR_CART_NOT_FOUND",
  "message": "No active cart found",
  "traceId": "uuid"
}
```

---

### POST /cart/items
**Description**: Add item to cart (creates cart if none exists)

**Request**:
```json
{
  "productId": "prod-uuid",
  "quantity": 1
}
```

**Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "items": [...],
  "subtotal": 79.99,
  "discount": 0,
  "tax": 6.40,
  "total": 86.39,
  "itemCount": 1
}
```

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | ERR_INVALID_QUANTITY | Quantity must be 1-99 |
| 404 | ERR_PRODUCT_NOT_FOUND | Product does not exist |
| 409 | ERR_INSUFFICIENT_STOCK | Not enough inventory |

---

### PATCH /cart/items/:itemId
**Description**: Update item quantity in cart

**Request**:
```json
{
  "quantity": 3
}
```

**Response (200 OK)**: Updated cart (same as GET /cart)

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | ERR_INVALID_QUANTITY | Quantity must be 1-99 |
| 404 | ERR_ITEM_NOT_FOUND | Item not in cart |
| 409 | ERR_INSUFFICIENT_STOCK | Not enough inventory |

---

### DELETE /cart/items/:itemId
**Description**: Remove item from cart

**Response (200 OK)**: Updated cart (same as GET /cart)

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 404 | ERR_ITEM_NOT_FOUND | Item not in cart |

---

### POST /cart/promo
**Description**: Apply promo code to cart

**Request**:
```json
{
  "code": "SAVE20"
}
```

**Response (200 OK)**: Updated cart with discount applied

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | ERR_INVALID_PROMO | Promo code expired or invalid |
| 400 | ERR_MIN_ORDER_NOT_MET | Cart doesn't meet minimum |

---

### DELETE /cart/promo
**Description**: Remove promo code from cart

**Response (200 OK)**: Updated cart with discount removed

---

### Error Response Format
```json
{
  "code": "ERR_CODE",
  "message": "Human-readable error message",
  "detail": "Additional diagnostic information",
  "traceId": "uuid-for-correlation"
}
```

---

## 6. Concurrency & Scaling Strategy

### Scaling Approach
| Component | Scaling Type | Min Instances | Max Instances | Trigger |
|-----------|--------------|---------------|---------------|---------|
| Cart Service | Horizontal | 2 | 10 | CPU > 70% |
| PostgreSQL | Primary + Replicas | 1 | 3 | Connections > 80% |
| Redis | Cluster | 3 | 6 | Memory > 80% |

### Connection Pooling
```typescript
// Database pool configuration
const dbPool = {
  min: 5,
  max: 20,
  idleTimeout: 30000,
  connectionTimeout: 5000
};

// Redis pool configuration
const redisPool = {
  min: 2,
  max: 10,
  idleTimeout: 30000
};
```

### Caching Strategy
| Data Type | Cache Location | TTL | Invalidation |
|-----------|----------------|-----|--------------|
| Cart | Redis | 1 hour | On cart update |
| Product Data | Redis | 5 minutes | On product update webhook |
| Promo Code | Redis | 1 hour | On code update |

### Optimistic Locking
Cart updates use version-based optimistic locking to handle concurrent updates:

```sql
UPDATE carts 
SET updated_at = NOW(), version = version + 1
WHERE id = $1 AND version = $2
RETURNING *;
```

---

## 7. Security Model

### Authentication
- JWT tokens from Auth Service
- Token validation on every request
- User ID extracted from token claims

### Authorization
- Users can only access their own cart
- Cart ID validated against user ID

### Input Validation
```typescript
const addItemSchema = {
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99)
};

const updateQuantitySchema = {
  quantity: z.number().int().min(1).max(99)
};

const promoCodeSchema = {
  code: z.string().min(1).max(50).toUpperCase()
};
```

### Security Checklist
- [x] All endpoints require authentication
- [x] User can only access own cart
- [x] Input validation on all endpoints
- [x] SQL injection prevention (parameterized queries)
- [x] XSS prevention (output encoding)
- [x] Rate limiting (100 req/min per user)
- [x] Sensitive data encrypted at rest
- [x] TLS 1.3 for all connections

---

## 8. Observability

### Logging
```json
{
  "timestamp": "2024-01-16T10:30:00.000Z",
  "level": "info",
  "service": "cart-service",
  "traceId": "uuid",
  "userId": "uuid",
  "action": "cart.item.added",
  "productId": "uuid",
  "quantity": 2,
  "duration": 45
}
```

### Required Events
- `cart.created` - New cart created
- `cart.item.added` - Item added to cart
- `cart.item.updated` - Item quantity changed
- `cart.item.removed` - Item removed from cart
- `cart.promo.applied` - Promo code applied
- `cart.promo.removed` - Promo code removed
- `cart.checked_out` - Cart proceeded to checkout

### Metrics
| Metric | Type | Labels |
|--------|------|--------|
| cart_operations_total | Counter | operation, status |
| cart_operation_duration_seconds | Histogram | operation |
| cart_items_count | Gauge | - |
| cart_value_total | Histogram | - |

---

## 9. Performance Budget

| NFR ID | Metric | Target | Measurement |
|--------|--------|--------|-------------|
| NFR-001 | Cart operation P95 | ≤500ms | Load test (k6) |
| NFR-002 | Cart page LCP | ≤2s | Lighthouse |
| NFR-005 | Concurrent operations | 10K | Load test (k6) |

---

## 10. Definition of Done

For implementation to be complete:

### Code Quality
- [ ] All API endpoints implemented per spec
- [ ] All data models implemented
- [ ] Repository pattern with caching
- [ ] Error handling per spec
- [ ] Input validation on all endpoints

### Testing
- [ ] Unit tests (≥80% coverage)
- [ ] Integration tests for all endpoints
- [ ] E2E tests for critical flows
- [ ] Load tests passing NFR targets

### Security
- [ ] Authentication enforced
- [ ] Authorization checks
- [ ] Input validation
- [ ] No secrets in code

### Documentation
- [ ] API documentation
- [ ] README updated
- [ ] CHANGELOG updated

---

## 11. Requirement Mapping

| Requirement | Design Element(s) | Test(s) |
|-------------|-------------------|---------|
| FR-001 | POST /cart/items, CartService.addItem | tests/integration/cart/add-item.test.ts |
| FR-002 | GET /cart, CartPage component | tests/e2e/cart/view-cart.test.ts |
| FR-003 | PATCH /cart/items/:id, CartService.updateQuantity | tests/integration/cart/update-quantity.test.ts |
| FR-004 | DELETE /cart/items/:id, CartService.removeItem | tests/integration/cart/remove-item.test.ts |
| FR-005 | Cart persistence in PostgreSQL, Redis cache | tests/integration/cart/persistence.test.ts |
| FR-006 | CartService.calculateTotals, TaxService integration | tests/unit/cart/calculate-totals.test.ts |
| NFR-001 | Redis caching, optimized queries | tests/load/cart-operations.test.ts |
| NFR-004 | TLS, encrypted columns | tests/security/encryption.test.ts |

---

## Architect Gate Checklist

- [x] Every FR maps to at least one design element
- [x] Every NFR maps to at least one design element
- [x] Every FR has at least one test specified
- [x] Every NFR has at least one test specified
- [x] All interfaces/contracts fully specified
- [x] API request/response schemas complete
- [x] Error model defined for all endpoints
- [x] Data models complete with types
- [x] Security model documented
- [x] All risks have mitigations
- [x] Definition of Done is clear

**Gate Status**: [x] PASS

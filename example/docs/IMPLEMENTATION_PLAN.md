# Implementation Plan: Shopping Cart Feature

## Document Information
| Field | Value |
|-------|-------|
| Title | Shopping Cart Implementation Plan |
| Date | 2024-01-16 |
| Version | 1.0 |
| Author | Architect Agent (Codex CLI) |
| PRD Reference | docs/PRD.md v1.0 |
| Architecture Reference | docs/ARCHITECTURE.md v1.0 |

---

## 1. Work Breakdown Structure (WBS)

### Phase 1: Foundation (Tasks T-001 to T-005)

| Task ID | Task | Component | Dependencies | Owner | Test Requirement |
|---------|------|-----------|--------------|-------|------------------|
| T-001 | Initialize project structure | All | None | Developer | Verify structure |
| T-002 | Configure database connection | Database | T-001 | Developer | Connection test |
| T-003 | Create cart schema migrations | Database | T-002 | Developer | Migration runs |
| T-004 | Configure Redis connection | Cache | T-001 | Developer | Redis ping |
| T-005 | Set up test infrastructure | Tests | T-001 | Developer | Sample test runs |

### Phase 2: Data Layer (Tasks T-006 to T-010)

| Task ID | Task | Component | Dependencies | Owner | Test Requirement |
|---------|------|-----------|--------------|-------|------------------|
| T-006 | Implement Cart entity | Models | T-003 | Developer | Unit: Cart CRUD |
| T-007 | Implement CartItem entity | Models | T-006 | Developer | Unit: CartItem CRUD |
| T-008 | Implement PromoCode entity | Models | T-003 | Developer | Unit: PromoCode CRUD |
| T-009 | Implement CartRepository | Repository | T-006, T-007 | Developer | Unit: Repository |
| T-010 | Implement Redis caching layer | Cache | T-004, T-009 | Developer | Unit: Cache hit/miss |

### Phase 3: Business Logic (Tasks T-011 to T-016)

| Task ID | Task | Component | Dependencies | Owner | Test Requirement |
|---------|------|-----------|--------------|-------|------------------|
| T-011 | Implement CartService.addItem | Service | T-009 | Developer | Unit: Add logic |
| T-012 | Implement CartService.updateQuantity | Service | T-009 | Developer | Unit: Update logic |
| T-013 | Implement CartService.removeItem | Service | T-009 | Developer | Unit: Remove logic |
| T-014 | Implement CartService.calculateTotals | Service | T-011 | Developer | Unit: Calculations |
| T-015 | Implement PromoCodeService | Service | T-008 | Developer | Unit: Promo validation |
| T-016 | Integrate Tax Service | Service | T-014 | Developer | Integration: Tax API |

### Phase 4: API Layer (Tasks T-017 to T-022)

| Task ID | Task | Component | Dependencies | Owner | Test Requirement |
|---------|------|-----------|--------------|-------|------------------|
| T-017 | Implement GET /cart endpoint | API | T-011 | Developer | Integration: Get cart |
| T-018 | Implement POST /cart/items endpoint | API | T-011 | Developer | Integration: Add item |
| T-019 | Implement PATCH /cart/items/:id endpoint | API | T-012 | Developer | Integration: Update |
| T-020 | Implement DELETE /cart/items/:id endpoint | API | T-013 | Developer | Integration: Remove |
| T-021 | Implement POST /cart/promo endpoint | API | T-015 | Developer | Integration: Apply promo |
| T-022 | Implement DELETE /cart/promo endpoint | API | T-015 | Developer | Integration: Remove promo |

### Phase 5: Client Integration (Tasks T-023 to T-026)

| Task ID | Task | Component | Dependencies | Owner | Test Requirement |
|---------|------|-----------|--------------|-------|------------------|
| T-023 | Create Cart API client | Client | T-017-T-022 | Developer | Unit: API client |
| T-024 | Implement CartContext provider | Client | T-023 | Developer | Unit: Context |
| T-025 | Implement CartPage component | Client | T-024 | Developer | E2E: View cart |
| T-026 | Implement AddToCartButton component | Client | T-024 | Developer | E2E: Add to cart |

### Phase 6: Quality & Polish (Tasks T-027 to T-032)

| Task ID | Task | Component | Dependencies | Owner | Test Requirement |
|---------|------|-----------|--------------|-------|------------------|
| T-027 | Implement error handling | All | T-022, T-026 | Developer | Integration: Errors |
| T-028 | Implement logging/observability | All | T-027 | Developer | Verify logs |
| T-029 | Write E2E test suite | Tests | T-026 | Developer | E2E pass |
| T-030 | Perform load testing | Tests | T-029 | Developer | NFR targets met |
| T-031 | Security review and fixes | Security | T-030 | Developer | No high/critical |
| T-032 | Update documentation | Docs | T-031 | Developer | Docs complete |

---

## 2. Dependency Graph

```
Phase 1: Foundation
T-001 ──┬──▶ T-002 ──▶ T-003
        │
        ├──▶ T-004
        │
        └──▶ T-005

Phase 2: Data Layer
T-003 ──┬──▶ T-006 ──▶ T-007 ──┐
        │                      │
        └──▶ T-008             │
                               ▼
T-004 ─────────────────────▶ T-009 ──▶ T-010

Phase 3: Business Logic
T-009 ──┬──▶ T-011 ──▶ T-014 ──▶ T-016
        │
        ├──▶ T-012
        │
        └──▶ T-013

T-008 ──────▶ T-015

Phase 4: API Layer
T-011 ──▶ T-017, T-018
T-012 ──▶ T-019
T-013 ──▶ T-020
T-015 ──▶ T-021, T-022

Phase 5: Client
T-017-T-022 ──▶ T-023 ──▶ T-024 ──▶ T-025, T-026

Phase 6: Quality
T-026 ──▶ T-027 ──▶ T-028 ──▶ T-029 ──▶ T-030 ──▶ T-031 ──▶ T-032
```

### Critical Path
`T-001 → T-002 → T-003 → T-006 → T-007 → T-009 → T-011 → T-018 → T-023 → T-024 → T-026 → T-029 → T-030 → T-032`

---

## 3. Test Plan Linkage

| Task ID | Unit Tests | Integration Tests | E2E Tests |
|---------|------------|-------------------|-----------|
| T-006 | `tests/unit/models/cart.test.ts` | - | - |
| T-007 | `tests/unit/models/cart-item.test.ts` | - | - |
| T-008 | `tests/unit/models/promo-code.test.ts` | - | - |
| T-009 | `tests/unit/repositories/cart.test.ts` | - | - |
| T-010 | `tests/unit/cache/cart-cache.test.ts` | - | - |
| T-011 | `tests/unit/services/cart.add.test.ts` | - | - |
| T-012 | `tests/unit/services/cart.update.test.ts` | - | - |
| T-013 | `tests/unit/services/cart.remove.test.ts` | - | - |
| T-014 | `tests/unit/services/cart.totals.test.ts` | - | - |
| T-015 | `tests/unit/services/promo.test.ts` | - | - |
| T-016 | - | `tests/integration/tax-service.test.ts` | - |
| T-017 | - | `tests/integration/api/get-cart.test.ts` | - |
| T-018 | - | `tests/integration/api/add-item.test.ts` | - |
| T-019 | - | `tests/integration/api/update-quantity.test.ts` | - |
| T-020 | - | `tests/integration/api/remove-item.test.ts` | - |
| T-021 | - | `tests/integration/api/apply-promo.test.ts` | - |
| T-022 | - | `tests/integration/api/remove-promo.test.ts` | - |
| T-025 | - | - | `tests/e2e/cart/view-cart.test.ts` |
| T-026 | - | - | `tests/e2e/cart/add-to-cart.test.ts` |
| T-029 | - | - | `tests/e2e/cart/full-flow.test.ts` |
| T-030 | - | - | `tests/load/cart-operations.test.ts` |

---

## 4. Risks & Mitigations

| Risk ID | Risk | Probability | Impact | Affected Tasks | Mitigation |
|---------|------|-------------|--------|----------------|------------|
| R-001 | Product Service API changes | Low | Medium | T-011, T-014 | Use versioned API, add adapter layer |
| R-002 | Tax Service unavailable | Medium | Medium | T-016 | Circuit breaker, cached rates fallback |
| R-003 | Redis cache fails | Low | Medium | T-010 | Fallback to direct DB queries |
| R-004 | Concurrent cart updates cause conflicts | Medium | Medium | T-011, T-012 | Optimistic locking implemented |
| R-005 | Load test fails NFR targets | Medium | High | T-030 | Profile and optimize early, add indices |

---

## 5. Exit Criteria (Developer Gate)

### Code Completion
- [ ] All T-001 through T-032 tasks complete
- [ ] All source files in `/src` directory
- [ ] All test files in `/tests` directory

### Quality Gates
- [ ] `npm run lint` passes (exit 0)
- [ ] `npm run type-check` passes (exit 0)
- [ ] `npm run test` passes (exit 0)
- [ ] Code coverage ≥80%

### Functional Verification
- [ ] FR-001: Add to cart works (AC-001, AC-002)
- [ ] FR-002: View cart works (AC-003, AC-004)
- [ ] FR-003: Update quantity works (AC-005, AC-006)
- [ ] FR-004: Remove item works (AC-007)
- [ ] FR-005: Cart persists (AC-008)
- [ ] FR-006: Totals correct (AC-009, AC-010)

### Performance
- [ ] NFR-001: Cart operations ≤500ms P95 (AC-020)
- [ ] NFR-005: 10K concurrent ops supported (AC-024)

### Security
- [ ] No high/critical vulnerabilities
- [ ] All security checklist items complete

### Documentation
- [ ] README updated
- [ ] CHANGELOG updated
- [ ] Implementation Report complete

---

## 6. Implementation Notes

### Task T-006: Implement Cart Entity
```typescript
// src/models/cart.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({ default: 'active' })
  status: CartStatus;

  @Column({ nullable: true })
  promoCode: string;

  @OneToMany(() => CartItem, item => item.cart)
  items: CartItem[];

  @Column('timestamp with time zone', { default: () => 'NOW()' })
  createdAt: Date;

  @Column('timestamp with time zone', { default: () => 'NOW()' })
  updatedAt: Date;

  @Column('timestamp with time zone')
  expiresAt: Date;
}
```

### Task T-011: Implement CartService.addItem
```typescript
// src/services/cart.service.ts
async addItem(userId: string, productId: string, quantity: number): Promise<Cart> {
  // 1. Get or create cart
  let cart = await this.cartRepository.findActiveByUserId(userId);
  if (!cart) {
    cart = await this.cartRepository.create(userId);
  }

  // 2. Verify product exists and has stock
  const product = await this.productService.getById(productId);
  if (!product) {
    throw new ProductNotFoundError(productId);
  }
  if (product.stock < quantity) {
    throw new InsufficientStockError(productId, product.stock);
  }

  // 3. Check if item already in cart
  const existingItem = cart.items.find(i => i.productId === productId);
  if (existingItem) {
    return this.updateQuantity(userId, existingItem.id, existingItem.quantity + quantity);
  }

  // 4. Add new item
  const item = await this.cartRepository.addItem(cart.id, {
    productId,
    quantity,
    unitPrice: product.price
  });

  // 5. Invalidate cache and return updated cart
  await this.cacheService.invalidate(`cart:${userId}`);
  return this.getCart(userId);
}
```

---

## Appendix: File Structure

```
src/
├── models/
│   ├── cart.ts           # T-006
│   ├── cart-item.ts      # T-007
│   └── promo-code.ts     # T-008
├── repositories/
│   ├── cart.repository.ts    # T-009
│   └── promo.repository.ts   # T-008
├── services/
│   ├── cart.service.ts       # T-011, T-012, T-013, T-014
│   ├── promo.service.ts      # T-015
│   └── tax.service.ts        # T-016
├── api/
│   ├── routes/
│   │   └── cart.routes.ts    # T-017-T-022
│   ├── middleware/
│   │   └── auth.middleware.ts
│   └── validators/
│       └── cart.validators.ts
├── cache/
│   └── cart.cache.ts         # T-010
└── client/
    ├── api/
    │   └── cart.api.ts       # T-023
    ├── context/
    │   └── CartContext.tsx   # T-024
    └── components/
        ├── CartPage.tsx      # T-025
        └── AddToCartButton.tsx # T-026

tests/
├── unit/
│   ├── models/
│   ├── repositories/
│   ├── services/
│   └── cache/
├── integration/
│   └── api/
├── e2e/
│   └── cart/
└── load/
```

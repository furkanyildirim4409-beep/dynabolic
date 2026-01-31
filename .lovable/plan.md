
# Bug Fix & Mağaza Restructure Implementation Plan

## Overview

This plan addresses two critical bugs and implements a major UI enhancement to the Keşfet > Mağaza section.

---

## Critical Bug Fixes

### Bug 1: Checkout Payment Modal Freeze

**Root Cause Analysis:**
- The `UniversalCartDrawer` renders at `z-index: 110` with a fixed backdrop
- The `PaymentModal` uses Radix Dialog which creates its own portal with default `z-index: 50`
- When the payment modal opens, it renders BEHIND the cart drawer's backdrop
- The user cannot interact with the payment modal because the cart backdrop intercepts clicks

**Solution:**
1. Close the cart drawer BEFORE opening the payment modal (cleaner flow)
2. Add explicit `z-index: 9999` to the `PaymentModal`'s `DialogContent` wrapper
3. Modify `handleCheckout` in `UniversalCartDrawer.tsx` to close cart first, then open modal with a small delay

**File Changes:**
- `src/components/UniversalCartDrawer.tsx` - Update checkout flow
- `src/components/PaymentModal.tsx` - Add higher z-index to dialog content

### Bug 2: Supplement "Sipariş Ver" UI Freeze

**Root Cause Analysis:**
- The `addToCart` function in `CartContext` triggers `setIsCartOpen(true)` immediately
- This causes the `UniversalCartDrawer` to open, which renders over the current view
- Multiple rapid state updates may cause React to batch updates awkwardly

**Solution:**
1. Add `requestAnimationFrame` wrapper around cart open to prevent blocking
2. Ensure `addToCart` completes before opening cart UI
3. The flow should be: Add item -> Show toast -> Open cart (in sequence)

**File Changes:**
- `src/context/CartContext.tsx` - Defer cart open with RAF

---

## Feature: Mağaza Tab Restructure

### Current State Issues

1. **Duplicate Cart Systems:** Keşfet.tsx uses a LOCAL cart state (`useState<CartItem[]>`) instead of the global `CartContext`
2. **Legacy CartView:** There's an old `CartView.tsx` component that duplicates `UniversalCartDrawer.tsx` functionality
3. **No Supplement Shop:** The Mağaza section only shows coach products, not standalone supplements

### New Architecture

**Mağaza Tab Layout:**
```text
┌─────────────────────────────────────────┐
│ 💳 Bakiye: 2,450 BIO                    │
├─────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐     │
│  │   ÜRÜNLER    │ │ SUPPLEMENTLER │     │
│  └──────────────┘ └──────────────┘     │
├─────────────────────────────────────────┤
│                                         │
│     [Products Grid / Supplements Grid]  │
│                                         │
└─────────────────────────────────────────┘
```

### Implementation Steps

#### Step 1: Add Supplement Shop Mock Data

**File:** `src/lib/mockData.ts`

Add new data structure for purchasable supplements:

```text
shopSupplements = [
  {
    id: "shop-sup-1",
    name: "Gold Standard Whey",
    brand: "Optimum Nutrition",
    price: 899,
    image: "...",
    flavors: ["Çikolata", "Vanilya", "Çilek"],
    servings: 30,
    rating: 4.8,
    reviews: 1247,
    category: "protein"
  },
  {
    id: "shop-sup-2",
    name: "BCAA Energy",
    brand: "EVL",
    price: 449,
    image: "...",
    flavors: ["Karpuz", "Mango"],
    servings: 30,
    category: "amino"
  },
  // ... more items
]
```

#### Step 2: Refactor Keşfet.tsx to Use Global Cart

**File:** `src/pages/Kesfet.tsx`

Changes:
- Remove local `cart` state and related handlers (`handleAddToCart`, `handleRemoveFromCart`, etc.)
- Import and use `useCart` from `CartContext`
- Remove the legacy `<CartView />` component usage
- The global `UniversalCartDrawer` in App.tsx handles cart display

#### Step 3: Create Supplement Shop Grid Component

**New File:** `src/components/SupplementShop.tsx`

A dedicated component for browsing purchasable supplements with:
- Product cards with image, name, brand, price
- Flavor selector (dropdown or chips)
- "Sepete Ekle" button that uses global `addToCart`
- Bio-Coin discount toggle (reuse existing logic)

#### Step 4: Update Mağaza Tab with Sub-Tabs

**File:** `src/pages/Kesfet.tsx`

Restructure the Mağaza `TabsContent`:
- Add nested `Tabs` component with "ÜRÜNLER" and "SUPPLEMENTLER" options
- "ÜRÜNLER" shows existing coach products grid
- "SUPPLEMENTLER" shows the new `SupplementShop` component

---

## Technical Details

### Z-Index Hierarchy (Fixed)

```text
Level 0:   Main App Content
Level 50:  Splash Screen (temporary)
Level 100: Floating Cart Button
Level 110: Cart Drawer (backdrop + panel)
Level 200: Payment Modal (NEW - elevated)
Level 9999: Story Viewer
```

### Updated Component Flow

```text
User Flow: Supplement Order

1. User in Beslenme > Supplementler tab
2. Sees low-stock alert on Vitamin D3
3. Clicks "SİPARİŞ VER"
4. addToCart() called with supplement data
5. Toast shows "Sepete Eklendi"
6. After RAF delay, cart drawer opens
7. User clicks "ÖDEMEYE GEÇ"
8. Cart closes first (immediate)
9. Payment Modal opens (z-200, no obstruction)
10. User completes payment
11. Success callback fires confetti
```

### File Change Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/components/PaymentModal.tsx` | UPDATE | Add z-index 200 to DialogContent |
| `src/components/UniversalCartDrawer.tsx` | UPDATE | Close cart before opening modal |
| `src/context/CartContext.tsx` | UPDATE | Defer cart open with RAF |
| `src/lib/mockData.ts` | UPDATE | Add shopSupplements data array |
| `src/components/SupplementShop.tsx` | CREATE | New supplement marketplace grid |
| `src/pages/Kesfet.tsx` | UPDATE | Use global cart, add sub-tabs to Mağaza |
| `src/components/CartView.tsx` | DEPRECATE | No longer needed (replaced by UniversalCartDrawer) |

---

## Mock Data: Shop Supplements

New supplement products for the Mağaza > Supplementler tab:

1. **Gold Standard Whey** - Optimum Nutrition - 899 TL
   - Flavors: Cikolata, Vanilya, Cilek
   - 30 servings, 4.8 rating

2. **BCAA Energy** - EVL - 449 TL
   - Flavors: Karpuz, Mango
   - 30 servings

3. **Pre-Workout X** - Cellucor C4 - 549 TL
   - Flavors: Nar, Limon
   - 60 servings

4. **Kreatin Monohidrat** - MyProtein - 299 TL
   - Unflavored, 100 servings

5. **Omega-3 Fish Oil** - NOW Foods - 279 TL
   - 180 softgels

6. **Vitamin D3 5000IU** - Nature Made - 189 TL
   - 90 tablets

---

## Design Notes

### Supplement Shop Card Layout

```text
┌─────────────────────────┐
│    [Product Image]      │
│    ★★★★☆ (4.8) 1.2K     │
├─────────────────────────┤
│  Gold Standard Whey     │
│  Optimum Nutrition      │
├─────────────────────────┤
│  ○ Çikolata ○ Vanilya   │
├─────────────────────────┤
│  ₺899         [+SEPET]  │
└─────────────────────────┘
```

### Bio-Coin Integration

Same logic as existing products:
- Toggle to apply Bio-Coin discount
- Show coins needed and remaining balance
- Max discount cannot exceed (price - 10 TL)

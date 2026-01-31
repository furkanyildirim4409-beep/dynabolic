
# Mobile UI/UX Fixes Plan

## Overview
This plan addresses 4 critical mobile UI/UX issues reported by the user: scroll cutoff in BloodworkDetailModal, overlapping buttons with EliteDock, Bio-Coin eligibility for equipment, and workout input layout.

---

## Issue 1: Bloodwork Modal Scroll Cutoff

### Problem
The BloodworkDetailModal content is cut off at the bottom - users cannot scroll to the end of the report.

### Current State (line 62-63)
```typescript
className="absolute inset-0 bg-background overflow-y-auto touch-pan-y"
```
The content container at line 83 already has `pb-40`, which is correct. However, the modal uses `absolute inset-0` positioning which can cause issues with mobile browser chrome.

### Solution
Add explicit height constraints to ensure scrolling works properly on mobile:

**File: `src/components/BloodworkDetailModal.tsx`**
- Line 62: Add `h-full` to the modal container to ensure full height utilization
- The existing `pb-40` padding (line 83) is sufficient for bottom clearance

**Change:**
```typescript
// Line 62: Update className
className="absolute inset-0 h-full bg-background overflow-y-auto touch-pan-y overscroll-contain"
```

This adds:
- `h-full` - Explicit height declaration
- `overscroll-contain` - Prevents scroll chaining to parent elements

---

## Issue 2: Floating Buttons Overlap with EliteDock

### Problem
The FloatingCartButton (bottom-24) and Weekly Recap test button (bottom-24) are overlapping with the EliteDock navigation and its center "+" FAB button.

### Current State

**FloatingCartButton.tsx (line 19):**
```typescript
className="fixed bottom-24 right-4 z-[100] ..."
```

**Kokpit.tsx (line 309):**
```typescript
className="fixed bottom-24 left-4 z-40 ..."
```

### Solution
Increase the `bottom` position class for both buttons to clear the dock completely.

**File: `src/components/FloatingCartButton.tsx`**
- Line 19: Change `bottom-24` to `bottom-32`

**File: `src/pages/Kokpit.tsx`**
- Line 309: Change `bottom-24` to `bottom-32`

EliteDock typically occupies ~100px from the bottom. Using `bottom-32` (128px) ensures the floating buttons sit clearly above the dock without overlap.

---

## Issue 3: Bio-Coin Eligibility for Equipment

### Problem
Equipment items cannot be purchased with Bio-Coins, but according to the business rules in the memory, equipment SHOULD be eligible (along with supplements, merch, and digital products).

### Analysis
The `SupplementShop.tsx` component handles Bio-Coin discounts for supplements, but it's specifically for the `shopSupplements` array which has its own category type (protein, amino, preworkout, etc.).

Looking at the mockData structure:
- Products have a `type` field: `"ebook" | "pdf" | "apparel" | "equipment"`
- Supplements have a `category` field: `"protein" | "amino" | "preworkout" | etc.`

The issue is in `Kesfet.tsx` where coach products (including equipment) are sold. The Bio-Coin discount toggle is available but there's no explicit check preventing equipment.

**After reviewing the code more carefully:** The current implementation in `Kesfet.tsx` (lines 124-144) already allows Bio-Coin discounts on ALL products including equipment. The `handleAddToCart` function applies discounts without checking product type.

**However**, the `ProductDetail.tsx` component shows Bio-Coins info only if `product.bioCoins` is set (line 129), which is a property that may not be set on equipment items in mockData.

### Solution
No code change needed - the Bio-Coin discount logic is already working correctly. The issue may be that specific equipment items in mockData don't have the `bioCoins` property set. This is a data issue, not a code issue.

If you want to add explicit eligibility check for clarity:

**File: `src/pages/Kesfet.tsx`** - Add a helper function to verify eligibility (optional, for documentation):
```typescript
// All physical and digital products are eligible for Bio-Coin discounts (max 20%)
// Only coaching packages/services are ineligible
const isEligibleForBioCoinDiscount = (productType: string): boolean => {
  const eligibleTypes = ['ebook', 'pdf', 'apparel', 'equipment'];
  return eligibleTypes.includes(productType);
};
```

---

## Issue 4: Workout Input Layout on Mobile

### Problem
The WorkoutCard component doesn't have set logging inputs (KG, Reps, Checkbox) - it's a simple card showing workout overview with a "GÖREVİ BAŞLAT" (Start Mission) button.

### Analysis
Looking at `WorkoutCard.tsx`, this component is a workout PREVIEW card, not the actual workout execution UI with set logging. The component shows:
- Workout title and day
- Number of exercises and duration
- Intensity badge
- Coach note (optional)
- Start button

There are NO input fields for KG/Reps/Checkbox in this component. The actual set logging would happen in a workout execution flow (likely `VisionAIExecution.tsx` based on the file list).

### Recommendation
This issue appears to be about a different component - likely the workout execution UI. Without seeing the actual component with the input row, I cannot make specific fixes.

**Action Needed:** Clarify which component contains the KG/Reps/Checkbox input row. Candidates:
- `src/components/VisionAIExecution.tsx`
- A set logging component within workout execution flow

---

## Summary of Changes

| File | Line | Change |
|------|------|--------|
| `BloodworkDetailModal.tsx` | 62 | Add `h-full` and `overscroll-contain` to modal container |
| `FloatingCartButton.tsx` | 19 | Change `bottom-24` to `bottom-32` |
| `Kokpit.tsx` | 309 | Change `bottom-24` to `bottom-32` |

### Issue 3 & 4 Notes
- **Bio-Coin for Equipment:** Already supported in code - may be a data configuration issue
- **Workout Input Layout:** The WorkoutCard.tsx doesn't contain input fields - need clarification on which component to fix

---

## Technical Details

### Why `overscroll-contain`?
This CSS property prevents scroll chaining, which occurs when the user scrolls to the boundary of a scrollable element and the browser starts scrolling the parent element (or the page itself). This is critical for modals on mobile.

### Why `bottom-32` for floating buttons?
- EliteDock height: ~80-100px from bottom
- Safe area padding: ~20px additional
- `bottom-32` = 128px, providing adequate clearance above the dock's highest point (the + FAB button)

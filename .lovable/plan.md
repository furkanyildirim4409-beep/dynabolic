

# Financials & Nutrition Extension Implementation Plan

## Overview

This plan addresses two key features to close the loop on the MVP:

1. **Payment Execution Flow** - Add "PAY NOW" functionality to pending/overdue invoices with a secure-looking payment modal offering Credit Card and Bank Transfer options, complete with confetti celebration on success.

2. **Supplement Tracking Module** - Create a new "Supplementler" tab in Beslenme.tsx with daily checklist, stock tracking, low-stock alerts, and quick refill functionality.

---

## Task 1: Payment Execution Flow

### 1.1 Update Payments Page with Pay Now Button

**File:** `src/pages/Payments.tsx`

**Changes:**
- Convert invoice data to local state to allow status updates
- Add "ODE" (Pay Now) button for pending/overdue invoices
- Add payment modal trigger state
- Track selected invoice for payment

**UI Enhancement per Invoice:**
```
┌─────────────────────────────────────────────┐
│  Aylık Koçluk           [🟡 Bekliyor]       │
│  27 Ocak 2026                               │
│  Son ödeme: 1 Şubat 2026                    │
│                                             │
│                          ₺300      [ÖDE]    │
└─────────────────────────────────────────────┘
```

### 1.2 Create Payment Modal Component

**New File:** `src/components/PaymentModal.tsx`

A trust-inspiring payment dialog with two tabs:

**Visual Design:**
```
┌─────────────────────────────────────────────┐
│  🔒 GÜVENLİ ÖDEME                     [X]   │
├─────────────────────────────────────────────┤
│  Aylık Koçluk                    ₺1,500     │
├─────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐           │
│  │ 💳 KART    │ │ 🏦 HAVALE   │           │
│  └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────┤
│                                             │
│  CREDIT CARD TAB:                           │
│  ┌─────────────────────────────────────┐   │
│  │ Kart Numarası                       │   │
│  │ [•••• •••• •••• ••••]               │   │
│  ├──────────────────┬──────────────────┤   │
│  │ Son Kullanma     │ CVV              │   │
│  │ [MM/YY]          │ [•••]            │   │
│  ├──────────────────┴──────────────────┤   │
│  │ Kart Üzerindeki İsim                │   │
│  │ [                                ]   │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │       💳 ₺1,500 ÖDE                │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  🔐 256-bit SSL ile korunmaktadır          │
└─────────────────────────────────────────────┘

  BANK TRANSFER TAB:
  ┌─────────────────────────────────────┐
  │ 🏦 HAVALE BİLGİLERİ                 │
  ├─────────────────────────────────────┤
  │ Banka: DYNABOLIC A.Ş.              │
  │ IBAN: TR12 3456 7890 1234 5678     │
  │                        [📋 Kopyala] │
  ├─────────────────────────────────────┤
  │ Referans Kodu: DYN-2026-001        │
  │                        [📋 Kopyala] │
  └─────────────────────────────────────┘
  
  ⚠️ Referans kodunu açıklamaya ekleyin
```

**Component Features:**
- Tabs component for Credit Card / Bank Transfer toggle
- Mock credit card form with proper formatting
- Card number auto-formatting (4-digit groups)
- Expiry date formatting (MM/YY)
- Copy-to-clipboard for IBAN and Reference Code
- Processing state with spinner animation
- Success callback to parent

### 1.3 Add Confetti Celebration

**In:** `src/pages/Payments.tsx`

- Import `canvas-confetti` (already installed)
- Trigger confetti burst on successful payment
- Update invoice status to "paid" locally
- Show success toast notification

**Success Animation Flow:**
1. User clicks "ODE" in modal
2. Show 2-second processing state
3. Close modal
4. Fire confetti animation
5. Update invoice card to green "Ödendi" status
6. Show toast: "Ödeme başarılı!"

---

## Task 2: Supplement Tracking Module

### 2.1 Add Mock Supplement Data

**File:** `src/lib/mockData.ts`

Add new data structure for assigned supplements:

```typescript
export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  timing: string; // "Sabah" | "Öğle" | "Akşam" | "Antrenman Öncesi" | "Antrenman Sonrası"
  servingsLeft: number;
  totalServings: number;
  takenToday: boolean;
  icon: string;
  color: string;
}

export const assignedSupplements: Supplement[] = [
  {
    id: "sup-1",
    name: "Kreatin Monohidrat",
    dosage: "5g",
    timing: "Antrenman Sonrası",
    servingsLeft: 12,
    totalServings: 30,
    takenToday: true,
    icon: "💪",
    color: "text-purple-500"
  },
  {
    id: "sup-2",
    name: "Whey Protein",
    dosage: "30g (1 scoop)",
    timing: "Antrenman Sonrası",
    servingsLeft: 4,
    totalServings: 30,
    takenToday: false,
    icon: "🥤",
    color: "text-amber-500"
  },
  {
    id: "sup-3",
    name: "Omega-3",
    dosage: "2 kapsül",
    timing: "Sabah",
    servingsLeft: 18,
    totalServings: 60,
    takenToday: true,
    icon: "🐟",
    color: "text-blue-500"
  },
  {
    id: "sup-4",
    name: "Vitamin D3",
    dosage: "2000 IU",
    timing: "Sabah",
    servingsLeft: 3,
    totalServings: 90,
    takenToday: false,
    icon: "☀️",
    color: "text-yellow-500"
  },
  {
    id: "sup-5",
    name: "Magnezyum",
    dosage: "400mg",
    timing: "Akşam",
    servingsLeft: 25,
    totalServings: 60,
    takenToday: false,
    icon: "💊",
    color: "text-green-500"
  }
];
```

### 2.2 Create Supplement Tracker Component

**New File:** `src/components/SupplementTracker.tsx`

**Features:**
- Daily checklist with satisfying check-off animation
- Stock progress bar per supplement
- Low stock visual alert (amber/red when < 5 servings)
- Quick "Yenile" (Refill) button
- Timing badges (morning, post-workout, etc.)

**Visual Design:**
```
┌─────────────────────────────────────────────┐
│ 💊 GÜNLÜK SUPPLEMENT TAKİBİ                │
│    3/5 alındı                               │
├─────────────────────────────────────────────┤
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ [✓] 💪 Kreatin Monohidrat              ││
│ │     5g • Antrenman Sonrası              ││
│ │     ▓▓▓▓▓▓▓▓░░░░  12/30 porsiyon       ││
│ └─────────────────────────────────────────┘│
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ [○] 🥤 Whey Protein      ⚠️ STOK DÜŞÜK ││
│ │     30g • Antrenman Sonrası             ││
│ │     ▓░░░░░░░░░░░  4/30      [YENİLE]   ││
│ └─────────────────────────────────────────┘│
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ [○] ☀️ Vitamin D3        🔴 KRİTİK     ││
│ │     2000 IU • Sabah                     ││
│ │     ░░░░░░░░░░░░  3/90      [YENİLE]   ││
│ │     ⚠️ 3 gün kaldı - Yenile!           ││
│ └─────────────────────────────────────────┘│
│                                             │
└─────────────────────────────────────────────┘
```

**Interactions:**
- Checkbox toggle with scale animation + haptic feedback
- Progress bar color: Green > 10, Amber 5-10, Red < 5
- Refill button resets servingsLeft to totalServings
- Toast notifications for actions

### 2.3 Integrate into Beslenme Page

**File:** `src/pages/Beslenme.tsx`

**Changes:**
- Add tab navigation at top: "ÖĞÜNLER" | "SUPPLEMENTLER"
- Import SupplementTracker component
- Show component when Supplementler tab is active
- Maintain existing meal tracking in Öğünler tab

**New Tab Structure:**
```
┌───────────────────────────────────────────┐
│ BESLENME PLANI                            │
│ Hedefine 450 kcal kaldı                   │
├───────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐        │
│ │   ÖĞÜNLER    │ │ SUPPLEMENTLER │        │
│ └──────────────┘ └──────────────┘        │
├───────────────────────────────────────────┤
│                                           │
│     [Tab Content Here]                    │
│                                           │
└───────────────────────────────────────────┘
```

---

## Technical Implementation Details

### File Structure
```
src/
├── components/
│   ├── PaymentModal.tsx          (NEW)
│   └── SupplementTracker.tsx     (NEW)
├── lib/
│   └── mockData.ts               (UPDATE - add supplements)
└── pages/
    ├── Payments.tsx              (UPDATE - add pay flow)
    └── Beslenme.tsx              (UPDATE - add tabs)
```

### Design System Compliance
- Background: Pure black (#000000)
- Primary: Neon Lime (hsl 68 100% 50%)
- Success: Green (#22c55e)
- Warning: Amber (#f59e0b)
- Critical: Red (#ef4444)
- Glass effects: `backdrop-blur-xl bg-white/[0.03]`
- Borders: `border border-white/[0.08]`
- Font: Inter (font-display for headers)

### Component Dependencies
- `canvas-confetti` - Already installed for success animation
- `framer-motion` - Animations and transitions
- `lucide-react` - Icons (CreditCard, Building2, Copy, Check, RefreshCw, AlertTriangle)
- Existing UI: Dialog, Tabs, Button, Input, Progress, Checkbox

### Security UX Elements for Payment Modal
- Lock icon in header (Shield icon)
- "256-bit SSL" security badge
- Card brand logos (visual only)
- Secure input field styling (darker bg, no autocomplete)

---

## Summary of Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/PaymentModal.tsx` | CREATE | Credit card form + bank transfer modal |
| `src/components/SupplementTracker.tsx` | CREATE | Daily checklist with stock tracking |
| `src/lib/mockData.ts` | UPDATE | Add assignedSupplements array |
| `src/pages/Payments.tsx` | UPDATE | Add PAY NOW button + modal integration |
| `src/pages/Beslenme.tsx` | UPDATE | Add tabs for meals/supplements |

---

## Visual Previews

### Payment Modal - Credit Card Tab
```
╔═════════════════════════════════════════════╗
║  🔒 GÜVENLİ ÖDEME                     ✕    ║
╠═════════════════════════════════════════════╣
║                                             ║
║  📄 Aylık Koçluk                   ₺1,500  ║
║                                             ║
╠═════════════════════════════════════════════╣
║  ┌─────────────┬─────────────┐             ║
║  │  💳 KART   │  🏦 HAVALE  │             ║
║  │  ▀▀▀▀▀▀▀▀▀ │             │             ║
║  └─────────────┴─────────────┘             ║
║                                             ║
║  Kart Numarası                              ║
║  ┌─────────────────────────────────────┐   ║
║  │ •••• •••• •••• ••••                 │   ║
║  └─────────────────────────────────────┘   ║
║                                             ║
║  ┌────────────────┐ ┌────────────────┐     ║
║  │ Son Kullanma   │ │ CVV            │     ║
║  │ MM/YY          │ │ •••            │     ║
║  └────────────────┘ └────────────────┘     ║
║                                             ║
║  Kart Sahibinin Adı                         ║
║  ┌─────────────────────────────────────┐   ║
║  │                                     │   ║
║  └─────────────────────────────────────┘   ║
║                                             ║
║  ┌─────────────────────────────────────┐   ║
║  │        💳  ₺1,500 ÖDE              │   ║
║  └─────────────────────────────────────┘   ║
║                                             ║
║  🔐 256-bit SSL şifreleme ile korunur      ║
╚═════════════════════════════════════════════╝
```

### Supplement Tracker
```
╔═════════════════════════════════════════════╗
║  💊 SUPPLEMENT TAKİBİ          3/5 alındı  ║
╠═════════════════════════════════════════════╣
║                                             ║
║  ┌─────────────────────────────────────┐   ║
║  │ ☑️  💪 Kreatin Monohidrat           │   ║
║  │     5g • Antrenman Sonrası          │   ║
║  │     ████████░░░░  12/30             │   ║
║  └─────────────────────────────────────┘   ║
║                                             ║
║  ┌─────────────────────────────────────┐   ║
║  │ ☐  🥤 Whey Protein    ⚠️ STOK DÜŞÜK │   ║
║  │     30g • Antrenman Sonrası         │   ║
║  │     █░░░░░░░░░░░  4/30    [YENİLE]  │   ║
║  └─────────────────────────────────────┘   ║
║                                             ║
║  ┌─────────────────────────────────────┐   ║
║  │ ☐  ☀️ Vitamin D3       🔴 KRİTİK   │   ║
║  │     2000 IU • Sabah                 │   ║
║  │     ░░░░░░░░░░░░  3/90    [YENİLE]  │   ║
║  │     ⚡ 3 gün kaldı - Hemen sipariş!  │   ║
║  └─────────────────────────────────────┘   ║
║                                             ║
╚═════════════════════════════════════════════╝
```


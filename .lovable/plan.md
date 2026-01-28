
# Coach Admin Panel Synchronization - Implementation Plan

This plan implements 4 phases of features to synchronize the athlete mobile app with the Coach Admin Panel: shared data types, daily check-in modal, payments page, and stories ring component.

---

## Overview

| Phase | Feature | New Files | Modified Files |
|-------|---------|-----------|----------------|
| 1.1 | Shared Data Types | `src/types/shared-models.ts` | - |
| 1.2 | Daily Check-In Modal | `src/components/DailyCheckIn.tsx` | `src/pages/Kokpit.tsx` |
| 1.3 | Payments Page | `src/pages/Payments.tsx` | `src/App.tsx`, `src/components/EliteDock.tsx`, `src/lib/mockData.ts` |
| 2.1 | Stories Ring | `src/components/StoriesRing.tsx` | `src/pages/Kokpit.tsx` |

---

## Phase 1.1: Shared Data Types

**Create:** `src/types/shared-models.ts`

This file establishes the shared contract between the mobile app and the Coach Admin Panel.

### Interfaces to Create:
- `UserProfile` - Athlete profile with tier, compliance, readiness, injury risk
- `DailyCheckIn` - Mood, sleep, soreness, stress ratings (1-10)
- `Invoice` - Payment tracking with status badges
- `ProgramExercise` - Exercise details with sets, reps, RPE
- `AssignedProgram` - Coach-assigned workout programs
- `CoachStory` - Story content with categories
- `CoachAdjustment` - Real-time program modifications

---

## Phase 1.2: Daily Check-In Modal

**Create:** `src/components/DailyCheckIn.tsx`

### Features:
- Full-screen modal with cyberpunk styling matching existing design
- 4 slider inputs using Radix UI Slider:
  - **Ruh Hali (Mood)**: 1-10 scale
  - **Uyku Kalitesi (Sleep Quality)**: 1-10 scale
  - **Kas Ağrısı (Soreness)**: 1-10 scale (inverted - 10 = no pain)
  - **Stres Seviyesi (Stress Level)**: 1-10 scale (inverted - 10 = no stress)
- Notes textarea for additional comments
- Submit button that simulates POST to `/api/athlete/:id/checkin`
- Toast confirmation on successful submission

### UI Design:
```text
┌─────────────────────────────────────────┐
│  [X]   GÜNLÜK CHECK-IN    [Gönder]      │
├─────────────────────────────────────────┤
│                                         │
│  RUH HALİ                        7/10   │
│  ════════════════●═══════════          │
│  😔                            😊       │
│                                         │
│  UYKU KALİTESİ                   8/10   │
│  ═════════════════●══════════          │
│  💤                            ⭐       │
│                                         │
│  KAS AĞRISI                      5/10   │
│  ═══════════●═════════════════          │
│  🔥                            ✨       │
│                                         │
│  STRES SEVİYESİ                  4/10   │
│  ═════════●═══════════════════          │
│  😰                            😌       │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Bugün hakkında notlar...       │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         CHECK-IN GÖNDER         │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Integration:
- Add a new "Check-In" notification prompt to `Kokpit.tsx`
- Show a subtle "Check-In Required" badge in the header if not completed today

---

## Phase 1.3: Payments Page (Ödemeler)

**Create:** `src/pages/Payments.tsx`

### Features:
- Page header: "ÖDEMELER" with Turkish subtitle
- Summary card showing total balance, next due date
- Invoice list with status badges:
  - **Ödendi** (Paid) - Green badge
  - **Bekliyor** (Pending) - Amber badge
  - **Gecikmiş** (Overdue) - Red badge
- Each invoice shows: date, amount, service type, due date

### Mock Data Addition:
Add to `src/lib/mockData.ts`:
```typescript
export const invoices: Invoice[] = [
  { id: "1", amount: 1500, status: "paid", date: "2026-01-15", serviceType: "Aylık Koçluk" },
  { id: "2", amount: 300, status: "pending", date: "2026-01-27", dueDate: "2026-02-01", serviceType: "E-Kitap" },
  { id: "3", amount: 1500, status: "overdue", date: "2026-01-01", dueDate: "2026-01-15", serviceType: "Aylık Koçluk" },
];
```

### Navigation Integration:
**Modify:** `src/components/EliteDock.tsx`
- Replace one of the FAB actions with "Ödemeler" link
- OR add to the main navigation (requires careful UX consideration)

**Alternative:** Add as a section within the `Profil.tsx` page

**Modify:** `src/App.tsx`
- Add route: `/odemeler` -> `<Payments />`

---

## Phase 2.1: Stories Ring Component

**Create:** `src/components/StoriesRing.tsx`

### Features:
- Horizontal scrollable ring of coach story categories
- Categories from `CoachStory` interface:
  - Değişimler (Transformations)
  - Soru-Cevap (Q&A)
  - Başarılar (Achievements)
  - Antrenman (Training)
  - Motivasyon (Motivation)
- Neon lime border for unviewed stories
- Category icons with gradient backgrounds
- Click opens full-screen story viewer

### UI Design:
```text
┌────────────────────────────────────────────────────────────┐
│                        KOKPIT HEADER                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐   →     │
│  │ 🔄   │  │ ❓   │  │ 🏆   │  │ 💪   │  │ ⚡   │         │
│  │Dönüş │  │Soru  │  │Başarı│  │Antrn │  │Motiv │         │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘         │
│                                                            │
│  ══════════════════════════════════════════════════════    │
│                        ENERGY BANK                          │
└────────────────────────────────────────────────────────────┘
```

### Story Viewer:
- Full-screen overlay with dark background
- Progress bar at top (like Instagram stories)
- Category title displayed
- Content image + text
- Auto-advance after 5 seconds
- Tap to skip/previous

### Mock Data Addition:
Add to `src/lib/mockData.ts`:
```typescript
export const coachStories: CoachStory[] = [
  { id: "1", title: "Haftalık Dönüşüm", thumbnail: "...", category: "Değişimler", content: {...} },
  { id: "2", title: "Sıkça Sorulan", thumbnail: "...", category: "Soru-Cevap", content: {...} },
  // ...
];
```

---

## Technical Details

### Styling Patterns (Following Existing Conventions):
- Glass cards: `glass-card` class (bg-card/40 backdrop-blur-xl border border-white/10)
- Neon accents: `neon-glow-sm` for highlights
- Font: Oswald for headers, Inter for body
- Colors: Neon lime (#CCFF00), Void black (#050505)

### Animation Patterns (Framer Motion):
```typescript
// Entry animation
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}

// Button feedback
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

### Component Import Structure:
```typescript
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
```

---

## File Creation Order

1. **`src/types/shared-models.ts`** - Create type definitions first
2. **`src/components/DailyCheckIn.tsx`** - Create check-in modal
3. **`src/pages/Kokpit.tsx`** - Integrate check-in trigger
4. **`src/lib/mockData.ts`** - Add invoices and stories mock data
5. **`src/pages/Payments.tsx`** - Create payments page
6. **`src/App.tsx`** - Add payments route
7. **`src/components/StoriesRing.tsx`** - Create stories component
8. **`src/pages/Kokpit.tsx`** - Integrate stories ring

---

## Post-Implementation Testing

After implementation, verify:
- [ ] Daily Check-In modal opens/closes properly
- [ ] Slider values update correctly and display 1-10 scale
- [ ] Check-in submission shows toast notification
- [ ] Payments page displays with correct Turkish text
- [ ] Invoice status badges show correct colors
- [ ] Stories ring scrolls horizontally
- [ ] Story viewer opens and auto-advances
- [ ] All animations are smooth (no lag on mobile)
- [ ] Navigation dock still functions correctly



# Real-Time Coach Feedback Implementation Plan

## Overview
This plan addresses two critical gaps identified in the Gap Analysis:
1. **Coach Adjustment Banner** - Display real-time coach adjustments (intensity, calories, volume changes) on the Dashboard
2. **Enhanced Workout Execution** - Show RPE targets, coach notes, and category tags for each exercise

---

## Task 1: Coach Adjustment Banner Component

### 1.1 Create Mock Data for Coach Adjustments
**File:** `src/lib/mockData.ts`

Add sample `CoachAdjustment` data that simulates adjustments sent from the Admin Panel:

```text
- Type: "calories" | "intensity" | "volume"
- Previous Value vs New Value (e.g., 2400 -> 2600)
- Coach Message explaining the change
- Timestamp (appliedAt)
```

### 1.2 Create the Banner Component
**File:** `src/components/dashboard/CoachAdjustmentBanner.tsx` (new)

**Design Specifications:**
- Glassmorphic card with urgent amber/orange border glow
- Animated entrance (slide down + fade in)
- Icon based on adjustment type:
  - Calories: Flame icon
  - Intensity: Zap icon
  - Volume: BarChart3 icon
- Display format:
  ```
  [ICON] KOÇ AYARLAMASI
  [Type Label]
  [Old Value] → [New Value]
  "[Coach Message]"
  [ANLADIM button]
  ```
- "ANLADIM" (Acknowledge) button dismisses the banner
- Uses localStorage to track dismissed adjustments

### 1.3 Integrate into Dashboard
**File:** `src/pages/Kokpit.tsx`

- Import and render `CoachAdjustmentBanner` at the top of the dashboard (below header, above Stories)
- Pass the latest unacknowledged adjustment
- Show only if there are new adjustments

---

## Task 2: Enhanced Workout Execution Details

### 2.1 Update Mock Data for Detailed Exercises
**File:** `src/lib/mockData.ts`

Expand `assignedWorkouts` to include full `ProgramExercise` details:
- `rpe`: Target RPE (1-10)
- `notes`: Per-exercise coach notes
- `category`: Muscle group/training type (e.g., "Göğüs/Hipertrofi")

Create a new `assignedWorkoutsDetailed` array with expanded structure.

### 2.2 Upgrade WorkoutCard Component
**File:** `src/components/WorkoutCard.tsx`

Add optional props to display enhanced program info:
- Show count of exercises with coach notes
- Add visual indicator if detailed RPE targets exist

### 2.3 Upgrade VisionAIExecution Component
**File:** `src/components/VisionAIExecution.tsx`

**New UI Elements per Exercise:**

1. **RPE Badge:**
   - Circular badge in top-right of exercise area
   - Color-coded: Green (1-5), Yellow (6-7), Orange (8-9), Red (10)
   - Label: "Hedef RPE: X"

2. **Coach Notes Display:**
   - Expandable info box below the exercise name
   - Uses Info icon
   - Yellow/amber styling to match coach note theme
   - Example: "Negatif fazda 3 saniye sayı"

3. **Category Tag:**
   - Small badge below exercise name
   - Shows muscle group/training style
   - Muted styling (bg-secondary)

### 2.4 Update Exercise Data Structure
**File:** `src/components/VisionAIExecution.tsx`

Modify the local `Exercise` interface and data to include:
```typescript
interface Exercise {
  name: string;
  targetReps: number;
  tempo: string;
  sets: number;
  restDuration: number;
  rpe: number;        // NEW
  notes?: string;     // NEW
  category?: string;  // NEW
}
```

---

## Technical Implementation Details

### File Structure
```
src/
├── components/
│   ├── dashboard/
│   │   └── CoachAdjustmentBanner.tsx  (NEW)
│   ├── WorkoutCard.tsx                 (UPDATE)
│   └── VisionAIExecution.tsx           (UPDATE)
├── lib/
│   └── mockData.ts                     (UPDATE)
└── pages/
    └── Kokpit.tsx                      (UPDATE)
```

### Design System Compliance
- Background: Pure black (#000000)
- Primary: Neon Lime (hsl 68 100% 50%)
- Alert/Urgent: Amber/Orange (hsl 38 92% 50%)
- Glass effects: `backdrop-blur-xl bg-white/[0.03]`
- Borders: `border border-white/[0.08]`
- Font: Inter (via font-display class for headings)

### Animation Specifications
- Banner entrance: Framer Motion `initial={{ opacity: 0, y: -20 }}` to `animate={{ opacity: 1, y: 0 }}`
- RPE badge: Subtle pulse animation for high RPE (8+)
- Dismiss button: Scale on tap feedback

---

## Component API Design

### CoachAdjustmentBanner Props
```typescript
interface CoachAdjustmentBannerProps {
  adjustment: CoachAdjustment | null;
  onDismiss: (adjustmentId: string) => void;
}
```

### Updated VisionAIExecution Exercise
```typescript
interface Exercise {
  name: string;
  targetReps: number;
  tempo: string;
  sets: number;
  restDuration: number;
  rpe: number;
  notes?: string;
  category?: string;
}
```

---

## Summary of Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/dashboard/CoachAdjustmentBanner.tsx` | CREATE | New urgent adjustment banner component |
| `src/lib/mockData.ts` | UPDATE | Add mock `CoachAdjustment` data + expanded exercise details |
| `src/pages/Kokpit.tsx` | UPDATE | Import and render CoachAdjustmentBanner |
| `src/components/VisionAIExecution.tsx` | UPDATE | Add RPE badge, coach notes, category tag per exercise |
| `src/components/WorkoutCard.tsx` | UPDATE | Minor enhancement for detailed exercise indicators |

---

## Visual Preview

### Coach Adjustment Banner (Kokpit)
```
┌─────────────────────────────────────────────┐
│ ⚡ KOÇ AYARLAMASI                      [×]  │
│                                             │
│  YOĞUNLUK GÜNCELLEMESİ                     │
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔                    │
│  %70  ━━━━━▶  %85                          │
│                                             │
│  "Bu hafta daha yüksek yoğunlukla          │
│   çalışabilirsin. Formun çok iyi!"         │
│                                             │
│        ┌──────────────┐                     │
│        │   ANLADIM    │                     │
│        └──────────────┘                     │
└─────────────────────────────────────────────┘
```

### Exercise View with RPE + Notes (VisionAIExecution)
```
┌─────────────────────────────────────────────┐
│                                    RPE: 8   │
│        [Exercise Video Area]        ●──●    │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ ℹ️ Koç Notu: Negatif fazda 3sn say │   │
│  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│         BARBELL SQUAT                       │
│    ┌─────────────────────┐                 │
│    │  Bacak/Güç          │                 │
│    └─────────────────────┘                 │
│              ...                            │
└─────────────────────────────────────────────┘
```


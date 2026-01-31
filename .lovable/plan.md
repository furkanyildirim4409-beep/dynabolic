
# Workout Calendar & Exercise History Implementation Plan

## Overview

This plan implements two major training tracking features:
1. **Workout Calendar View** - A monthly calendar displaying workout status with interactive day details
2. **Exercise History Modal** - Progressive overload tracking with trend graphs and personal bests

---

## Architecture Summary

```text
┌─────────────────────────────────────────────────────────┐
│                    Antrenman Page                        │
├─────────────────────────────────────────────────────────┤
│  [📋 LIST]  [📅 CALENDAR]  ← View Toggle                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  LIST VIEW (existing)     │  CALENDAR VIEW (new)        │
│  ┌─────────────────────┐  │  ┌─────────────────────┐   │
│  │ WorkoutCard         │  │  │ WorkoutCalendar     │   │
│  │ WorkoutCard         │  │  │ ● ○ ● ○ ● ○ ●      │   │
│  │ WorkoutCard         │  │  │ ● ● ○ ● ○ ○ ●      │   │
│  └─────────────────────┘  │  └─────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────────┐
         │     VisionAIExecution Screen         │
         ├──────────────────────────────────────┤
         │  Exercise: BENCH PRESS               │
         │  [🕐 HISTORY BUTTON] ← NEW           │
         │                                       │
         │  Opens ExerciseHistoryModal          │
         └──────────────────────────────────────┘
```

---

## Component 1: WorkoutCalendar.tsx

### Purpose
Display a monthly calendar grid showing workout completion status with visual indicators and interactive day popovers.

### Visual Design
```text
┌─────────────────────────────────────────────┐
│     ◀  OCAK 2026  ▶                         │
├─────────────────────────────────────────────┤
│  Pzt   Sal   Çar   Per   Cum   Cmt   Paz   │
├─────────────────────────────────────────────┤
│        1     2     3     4     5     6      │
│       [○]   [●]   [◐]   [●]   [○]   [●]    │
│   7     8     9    10    11    12    13     │
│  [●]   [◐]   [○]   [●]   [○]   [●]   [◐]   │
│  ...                                        │
└─────────────────────────────────────────────┘

Legend:
● Green filled = Completed workout
◐ Gray filled = Rest day (scheduled)
○ Hollow outline = Scheduled/Future workout
  (no indicator) = No activity planned
```

### Technical Implementation

**State Management:**
- `currentMonth: Date` - Controls displayed month
- `selectedDay: CalendarDayData | null` - Day details popover

**Data Structure:**
```typescript
interface CalendarDayData {
  date: Date;
  status: 'completed' | 'rest' | 'scheduled' | 'missed' | 'none';
  workout?: {
    name: string;
    duration: string;
    focus: string;
    exercises: number;
  };
}
```

**Integration:**
- Uses `workoutHistory` from mockData for past workout data
- Uses `assignedWorkouts` for scheduled future workouts
- Custom calendar grid (not react-day-picker) for full styling control

### Animations
- Smooth month transitions using Framer Motion `AnimatePresence`
- Day indicators with subtle pulse animation for today
- Popover slides up from bottom on mobile

---

## Component 2: ExerciseHistoryModal.tsx

### Purpose
Show historical performance data for a specific exercise, enabling users to track progressive overload.

### Visual Design
```text
┌─────────────────────────────────────────────┐
│  [X]     BENCH PRESS - GEÇMİŞ              │
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐   │
│  │         🏆 KİŞİSEL REKOR            │   │
│  │         100kg x 8 tekrar            │   │
│  │         27 Ocak 2026                │   │
│  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  📈 12 HAFTALIK TREND                       │
│  ┌─────────────────────────────────────┐   │
│  │     ╱─╲    ╱─╲                     │   │
│  │    ╱   ╲  ╱   ╲    ╱              │   │
│  │   ╱     ╲╱     ╲  ╱               │   │
│  │  ╱              ╲╱                │   │
│  │ ────────────────────────────────  │   │
│  │ W1  W2  W3  W4  W5  W6  W7  W8   │   │
│  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  📋 SON KAYITLAR                            │
│  ┌─────────────────────────────────────┐   │
│  │ 27 Oca │ 4 set │ 100kg x 8,8,8,10  │   │
│  │ 20 Oca │ 4 set │ 95kg x 10,10,8,8  │   │
│  │ 13 Oca │ 3 set │ 90kg x 10,10,10   │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Technical Implementation

**Props:**
```typescript
interface ExerciseHistoryModalProps {
  exerciseName: string;
  isOpen: boolean;
  onClose: () => void;
}
```

**Data Processing:**
- Extract all sets for the given exercise from `workoutHistory`
- Calculate estimated 1RM using Epley formula: `weight × (1 + reps/30)`
- Find personal best (highest 1RM or highest weight)
- Group by week for trend chart

**Chart Configuration:**
- Uses Recharts `LineChart` component (already installed)
- Neon lime line color (`hsl(var(--primary))`) on dark background
- Gradient fill under the line for depth

---

## Mock Data Additions

### Exercise History Extended Data
New data structure in `mockData.ts`:

```typescript
export const exerciseHistory: ExerciseHistoryRecord[] = [
  {
    exerciseName: "Bench Press",
    date: "2026-01-27",
    sets: [
      { weight: 100, reps: 12 },
      { weight: 100, reps: 10 },
      { weight: 100, reps: 8 },
      { weight: 90, reps: 10 }
    ]
  },
  // ... 12 weeks of data for each major exercise
];
```

### Calendar Mock Data
Extends existing `workoutHistory` with additional date parsing.

---

## Integration Points

### Antrenman.tsx Modifications

1. **Add View Toggle State:**
   ```typescript
   const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
   ```

2. **Add Toggle Button Group** in the header section

3. **Conditional Rendering:**
   - Show existing workout cards when `viewMode === 'list'`
   - Show `WorkoutCalendar` when `viewMode === 'calendar'`

### VisionAIExecution.tsx Modifications

1. **Add History Button** next to exercise name (Clock icon)

2. **Add Modal State:**
   ```typescript
   const [showExerciseHistory, setShowExerciseHistory] = useState(false);
   ```

3. **Render ExerciseHistoryModal** with current exercise name

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/components/WorkoutCalendar.tsx` | CREATE | Monthly calendar with workout indicators |
| `src/components/ExerciseHistoryModal.tsx` | CREATE | Exercise trend graph and history list |
| `src/pages/Antrenman.tsx` | UPDATE | Add view toggle (List/Calendar) |
| `src/components/VisionAIExecution.tsx` | UPDATE | Add History button per exercise |
| `src/lib/mockData.ts` | UPDATE | Add extended exercise history data |

---

## Technical Details

### Calendar Day Rendering Logic

```typescript
const getDayStatus = (date: Date): CalendarDayData['status'] => {
  const today = new Date();
  const dateStr = format(date, 'yyyy-MM-dd');
  
  // Check workout history for completed
  const completed = workoutHistory.find(w => 
    w.date === dateStr && w.completed
  );
  if (completed) return 'completed';
  
  // Check if scheduled rest day
  if (isRestDay(date)) return 'rest';
  
  // Check assigned workouts for future
  if (date > today && isScheduled(date)) return 'scheduled';
  
  return 'none';
};
```

### 1RM Calculation (Epley Formula)

```typescript
const calculate1RM = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
};
```

### Chart Data Transformation

```typescript
const getWeeklyTrendData = (exerciseName: string) => {
  const records = exerciseHistory
    .filter(r => r.exerciseName === exerciseName)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Group by week, calculate max 1RM per week
  return records.map(r => ({
    week: format(new Date(r.date), 'dd MMM'),
    estimated1RM: Math.max(...r.sets.map(s => calculate1RM(s.weight, s.reps))),
    maxWeight: Math.max(...r.sets.map(s => s.weight))
  }));
};
```

---

## Design Specifications

### Color Palette
- **Completed (Green):** `hsl(var(--primary))` - Neon lime
- **Rest Day (Gray):** `text-muted-foreground` with low opacity
- **Scheduled (Outline):** `border-primary/50` hollow circle
- **Personal Best Badge:** Gold gradient `from-yellow-400 to-amber-500`

### Typography
- Calendar month header: `font-display text-lg tracking-wider`
- Day numbers: `text-sm text-foreground`
- Modal headers: `font-display text-xl`

### Animations
- Calendar month slide: `x: direction * 100%` with spring physics
- Day popover: `y: "100%"` to `y: 0` slide-up
- Chart line: SVG path draw animation
- PR badge: Scale pulse `[1, 1.05, 1]`

---

## Accessibility Considerations

- Calendar days are focusable buttons with aria-labels
- Modal uses proper focus trap
- Chart has tooltip for data accessibility
- All interactive elements have sufficient contrast

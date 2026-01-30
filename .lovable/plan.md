
# Health & Bio-Analytics Upgrade Implementation Plan

## Overview

This plan implements two major enhancements to the health tracking capabilities:

1. **Advanced Bloodwork Analysis View** - Transform the existing bloodwork section from a simple list into a detailed analytics panel with coach notes, flagged biomarkers visualization, and hormone trend charts.

2. **Wearable Device Integration UI** - Create a device sync section with Apple Health/Google Fit connection cards and a Bio-Metrics dashboard showing heart rate, HRV, sleep, and steps data.

---

## Task 1: Advanced Bloodwork Analysis View

### 1.1 Create Bloodwork Detail Modal Component

**New File:** `src/components/BloodworkDetailModal.tsx`

A full-screen modal that opens when clicking on an "Analyzed" report:

**UI Sections:**
- **Header:** Report name, upload date vs analysis date comparison
- **Status Badge:** Large status indicator with icon
- **Coach Notes Panel:** Dedicated glassmorphic card with coach avatar icon
- **Flagged Biomarkers List:** Visual cards for each flagged value
  - Red badge for critical values
  - Amber badge for borderline values  
  - Severity indicator and normal range display
- **Hormone Trend Chart:** Line chart placeholder showing Testosterone/Cortisol ratio over time

**Data Display:**
```
RAPOR DETAYI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Uploaded: 15 Ocak 2026]
[Analyzed: 16 Ocak 2026]  ← 1 gün
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KOÇ NOTU
┌────────────────────────────────┐
│ 👨‍⚕️ Vitamin D seviyesi düşük,   │
│    takviye önerildi...         │
└────────────────────────────────┘

DİKKAT GEREKTİREN DEĞERLER
┌─────────────────┐ ┌─────────────────┐
│ 🔴 Vitamin D   │ │ 🟡 Ferritin    │
│    12 ng/mL     │ │    28 ng/mL     │
│    (Normal: 30+)│ │    (Normal: 30+)│
└─────────────────┘ └─────────────────┘

HORMON TRENDİ
┌────────────────────────────────┐
│     📈 (Line Chart Placeholder) │
│     Testosteron/Kortizol Oranı  │
└────────────────────────────────┘
```

### 1.2 Add Mock Bloodwork Entry Data

**File:** `src/lib/mockData.ts`

Add detailed bloodwork entries for the trend chart:

```typescript
export const bloodworkTrends: BloodworkEntry[] = [
  { month: "Eki 2025", testosterone: 580, cortisol: 18, ratio: 32.2 },
  { month: "Kas 2025", testosterone: 610, cortisol: 16, ratio: 38.1 },
  { month: "Ara 2025", testosterone: 595, cortisol: 17, ratio: 35.0 },
  { month: "Oca 2026", testosterone: 640, cortisol: 15, ratio: 42.7 },
];

// Add detailed flagged values with severity
export const flaggedBiomarkers = {
  "bw-1": [
    { name: "Vitamin D", value: 12, unit: "ng/mL", normalRange: "30-100", severity: "critical" },
    { name: "Ferritin", value: 28, unit: "ng/mL", normalRange: "30-400", severity: "borderline" },
  ],
};
```

### 1.3 Update BloodworkUpload Component

**File:** `src/components/BloodworkUpload.tsx`

**Changes:**
- Add click handler to open detail modal for analyzed reports
- Import and integrate the new `BloodworkDetailModal`
- Pass selected report data to modal

### 1.4 Implement Trend Chart Using Recharts

**Inside:** `BloodworkDetailModal.tsx`

Use the existing `recharts` library (already installed) with a clean, dark-themed line chart:
- X-axis: Months (Eki, Kas, Ara, Oca)
- Y-axis: T/C Ratio
- Primary color line with gradient fill
- Interactive tooltips

---

## Task 2: Wearable Device Integration UI

### 2.1 Create Device Sync Section Component

**New File:** `src/components/WearableDeviceSync.tsx`

A settings-style card with device connection options:

```
CİHAZ BAĞLANTISI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌────────────────────────────────┐
│ 🍎 Apple Health                │
│    Bağlı Değil                 │
│                    [BAĞLAN]    │
├────────────────────────────────┤
│ 💚 Google Health Connect       │
│    Bağlı Değil                 │
│                    [BAĞLAN]    │
└────────────────────────────────┘

┌────────────────────────────────┐
│ ✓ Simülasyon Modu              │
│   Test verilerini göster       │
│                    [TOGGLE]    │
└────────────────────────────────┘
```

**Features:**
- Apple Health card with iOS-style icon
- Google Health Connect card with Android-style icon
- Connection status indicator (Connected/Disconnected)
- "BAĞLAN" (Connect) button with toast notification (demo mode)
- Simulation toggle that populates mock data when active

### 2.2 Create Bio-Metrics Dashboard Component

**New File:** `src/components/BioMetricsDashboard.tsx`

A premium stats card showing wearable data:

```
BİYO-METRİK PANELİ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌──────────┬──────────┐
│ ❤️ RHR   │ 📊 HRV   │
│ 58 bpm   │ 42 ms    │
│ ↓2       │ ↑5       │
├──────────┼──────────┤
│ 😴 UYKU  │ 🚶 ADIM  │
│ 7.2 saat │ 8,456    │
│ Derin:%23│ ↑12%     │
└──────────┴──────────┘
```

**Features:**
- 4-grid layout for key metrics
- Resting Heart Rate (RHR) with trend arrow
- Heart Rate Variability (HRV) in milliseconds
- Sleep Score with Deep/REM breakdown
- Daily Steps with percentage change
- Empty state when not connected
- Animated value changes when simulation toggles

### 2.3 Add Mock Wearable Data

**File:** `src/lib/mockData.ts`

Add realistic health data:

```typescript
export const wearableMetrics = {
  rhr: { value: 58, change: -2, unit: "bpm" },
  hrv: { value: 42, change: 5, unit: "ms" },
  sleep: { 
    total: 7.2, 
    deep: 23, 
    rem: 18, 
    light: 59, 
    unit: "saat" 
  },
  steps: { value: 8456, change: 12, goal: 10000 },
  lastSync: "2 saat önce",
};
```

### 2.4 Integrate Into Profile Page

**File:** `src/pages/Profil.tsx`

**Changes:**
- Add new state for device connection simulation
- Import `WearableDeviceSync` component
- Import `BioMetricsDashboard` component
- Place them after "Bio-Coin Wallet" section, before "Recovery Zones"
- Pass simulation state to control data visibility

**New Section Order in Profil.tsx:**
1. Header with Bio-Coins ✓
2. User ID Card ✓
3. Digital Twin (3D Avatar) ✓
4. Timeline AI ✓
5. Bio-Coin Stats ✓
6. **NEW: Wearable Device Sync**
7. **NEW: Bio-Metrics Dashboard**
8. Recovery Zones ✓
9. Body Stats Grid ✓
10. Body Scan Upload ✓
11. Bloodwork Upload (enhanced) ✓
12. Settings Menu ✓

---

## Technical Implementation Details

### File Structure
```
src/
├── components/
│   ├── BloodworkUpload.tsx          (UPDATE)
│   ├── BloodworkDetailModal.tsx     (NEW)
│   ├── WearableDeviceSync.tsx       (NEW)
│   └── BioMetricsDashboard.tsx      (NEW)
├── lib/
│   └── mockData.ts                  (UPDATE)
└── pages/
    └── Profil.tsx                   (UPDATE)
```

### Design System Compliance
- Background: Pure black (#000000)
- Primary: Neon Lime (hsl 68 100% 50%)
- Critical: Red (#ef4444)
- Warning: Amber (#f59e0b)
- Success: Green (#22c55e)
- Glass effects: `backdrop-blur-xl bg-white/[0.03]`
- Borders: `border border-white/[0.08]`
- Charts: Primary color with gradient, dark grid lines

### Animation Specifications
- Modal entrance: Framer Motion slide-up from bottom
- Metric cards: Staggered fade-in (delay: 0.05 per item)
- Value changes: CountUp-style animation when toggling simulation
- Connection toggle: Smooth color transition

### Component Dependencies
- `recharts` - Already installed for trend charts
- `framer-motion` - Animations
- `lucide-react` - Icons (Heart, Activity, Moon, Footprints, Smartphone, Watch)
- Existing UI components: Switch, Button, Progress

---

## Summary of Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/BloodworkDetailModal.tsx` | CREATE | Full detail view with coach notes, flagged values, trend chart |
| `src/components/WearableDeviceSync.tsx` | CREATE | Apple Health / Google Fit connection cards |
| `src/components/BioMetricsDashboard.tsx` | CREATE | RHR, HRV, Sleep, Steps metrics grid |
| `src/components/BloodworkUpload.tsx` | UPDATE | Add click-to-detail functionality |
| `src/lib/mockData.ts` | UPDATE | Add bloodwork trends, flagged biomarkers, wearable metrics |
| `src/pages/Profil.tsx` | UPDATE | Integrate new components, add simulation state |

---

## Visual Previews

### Bloodwork Detail Modal
```
┌─────────────────────────────────────────────┐
│ ← RAPOR DETAYI                         [X] │
├─────────────────────────────────────────────┤
│ 📄 kan_tahlili_ocak_2026.pdf               │
│                                             │
│ Yükleme: 15 Ocak 2026                      │
│ Analiz:  16 Ocak 2026  ✓ 1 gün içinde      │
├─────────────────────────────────────────────┤
│ 👨‍⚕️ KOÇ NOTU                                │
│ ┌─────────────────────────────────────────┐│
│ │ Vitamin D seviyesi düşük, takviye      ││
│ │ önerildi. Ferritin de sınırda, demir   ││
│ │ açısından zengin gıdalara yönel.       ││
│ └─────────────────────────────────────────┘│
├─────────────────────────────────────────────┤
│ ⚠️ DİKKAT GEREKTİREN DEĞERLER              │
│                                             │
│ ┌──────────────┐  ┌──────────────┐         │
│ │ 🔴 Vitamin D │  │ 🟡 Ferritin │         │
│ │    12 ng/mL  │  │    28 ng/mL  │         │
│ │ Normal: 30+  │  │ Normal: 30+  │         │
│ └──────────────┘  └──────────────┘         │
├─────────────────────────────────────────────┤
│ 📈 HORMON TRENDİ (T/C Oranı)               │
│ ┌─────────────────────────────────────────┐│
│ │  45 ─╱─                                 ││
│ │  40 ─    ╲╱                             ││
│ │  35 ─                                   ││
│ │  30 ┴────┴────┴────┴────                ││
│ │    Eki  Kas  Ara  Oca                   ││
│ └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

### Bio-Metrics Dashboard
```
┌─────────────────────────────────────────────┐
│ 📱 CİHAZ BAĞLANTISI                        │
├─────────────────────────────────────────────┤
│ ┌───────────────────────────────────────┐  │
│ │ 🍎 Apple Health         ○ Bağlı Değil │  │
│ │                           [BAĞLAN]    │  │
│ └───────────────────────────────────────┘  │
│ ┌───────────────────────────────────────┐  │
│ │ 💚 Google Health        ○ Bağlı Değil │  │
│ │                           [BAĞLAN]    │  │
│ └───────────────────────────────────────┘  │
│                                             │
│ ┌───────────────────────────────────────┐  │
│ │ 🧪 Simülasyon Modu        [═══●]     │  │
│ │    Demo verilerini göster             │  │
│ └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 📊 BİYO-METRİK PANELİ                      │
│    Son güncelleme: 2 saat önce             │
├─────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌──────────────────┐  │
│ │ ❤️ Dinlenme Nabzı│ │ 📊 HRV          │  │
│ │                  │ │                  │  │
│ │      58 bpm      │ │      42 ms       │  │
│ │      ↓2 dün      │ │      ↑5 dün      │  │
│ └──────────────────┘ └──────────────────┘  │
│ ┌──────────────────┐ ┌──────────────────┐  │
│ │ 😴 Uyku Kalitesi │ │ 🚶 Günlük Adım  │  │
│ │                  │ │                  │  │
│ │     7.2 saat     │ │      8,456       │  │
│ │   Derin: %23     │ │     ↑12% dün     │  │
│ └──────────────────┘ └──────────────────┘  │
└─────────────────────────────────────────────┘
```

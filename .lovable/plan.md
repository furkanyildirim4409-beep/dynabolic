
# DYNABOLIC Rebranding & Splash Screen Implementation

This plan covers the complete rebranding from "GOKALAF" to "DYNABOLIC" and implements a cinematic splash screen with the new animated logo.

---

## Summary of Changes

| Task | Files Affected | Description |
|------|---------------|-------------|
| 1. Global Rebranding | 6 files | Replace all "GOKALAF/Gokalaf" text with "DYNABOLIC/Dynabolic" |
| 2. Logo Component | 1 new file | Create `DynabolicLogo.tsx` with animated SVG |
| 3. Splash Screen | 1 new file | Create `SplashScreen.tsx` with 3-phase animation |
| 4. App Integration | 1 file | Wrap app with splash state logic in `App.tsx` |
| 5. Loader Update | 1 file | Update/rename `GokalafLoader.tsx` to use new branding |

---

## Step 1: Global Text Replacement

### Files to Update:

**1. `src/pages/BiometricLogin.tsx` (line 95)**
```text
FROM: GOKALAF
TO:   DYNABOLIC
```

**2. `src/components/GokalafLoader.tsx` (line 41)**
```text
FROM: GOKALAF
TO:   DYNABOLIC
```
Also rename file to `DynabolicLoader.tsx`

**3. `src/pages/Profil.tsx` (lines 405-406)**
```text
FROM: GOKALAF MVP v1.0.0
      © 2026 Gokalaf Labs
TO:   DYNABOLIC v1.0.0
      © 2026 Dynabolic Labs
```

**4. `src/pages/Akademi.tsx` (line 132)**
```text
FROM: Gokalaf sisteminin tüm özelliklerini keşfet
TO:   Dynabolic sisteminin tüm özelliklerini keşfet
```

**5. `src/lib/mockData.ts` (multiple lines)**
```text
FROM: #GokalafAilesi, Gokalaf Lifting Straps, Gokalaf Pro Atlet
TO:   #DynabolicAilesi, Dynabolic Lifting Straps, Dynabolic Pro Atlet
```

**6. `src/index.css` (comments only - lines 7, 59)**
```text
FROM: /* GOKALAF Design System */
      /* Custom GOKALAF Variables */
TO:   /* DYNABOLIC Design System */
      /* Custom DYNABOLIC Variables */
```

---

## Step 2: Create DynabolicLogo Component

**New File:** `src/components/DynabolicLogo.tsx`

```text
Structure:
- SVG with viewBox="0 0 200 200"
- Neon glow filter definition
- 3 animated path elements:
  1. Outer D Shape (outline, draws with pathLength)
  2. Inner Tech Segments (horizontal lines, fade in)
  3. Lightning Bolt (center core, springs in with scale)
- Props: progress (0-1), isFilled (boolean)
```

Animation behavior:
- `progress` controls the D outline drawing (pathLength: 0 → progress)
- `isFilled` triggers inner segments and lightning bolt visibility
- Lightning bolt uses spring animation for "power on" effect

---

## Step 3: Create SplashScreen Component

**New File:** `src/components/SplashScreen.tsx`

### Animation Sequence (2.5s total):

```text
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: DRAWING (0-1s)                                    │
│  - Logo outline draws from 0% to 100%                       │
│  - progress: 0 → 1                                          │
│  - isFilled: false                                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 2: ACTIVATION (1s-1.8s)                              │
│  - Inner segments fade in                                   │
│  - Lightning bolt springs into view                         │
│  - Glow intensifies (box-shadow animation)                  │
│  - isFilled: true                                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 3: ZOOM THROUGH (1.8s-2.5s)                          │
│  - Container scales from 1 → 50                             │
│  - Opacity fades from 1 → 0                                 │
│  - Creates "flying through logo" effect                     │
│  - onComplete callback triggers                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Structure:
```tsx
interface SplashScreenProps {
  onComplete: () => void;
}

// State machine: "drawing" | "activating" | "zooming"
// useEffect handles phase transitions with setTimeout
// AnimatePresence handles exit animation
```

### Visual Elements:
- Full-screen pitch black background (#000000)
- Centered DynabolicLogo component
- "DYNABOLIC" text below logo (fades in during activation)
- Subtle scan-line effect during drawing phase

---

## Step 4: App.tsx Integration

**File:** `src/App.tsx`

### Changes:
1. Import SplashScreen component
2. Add `showSplash` state (default: `true`)
3. Wrap entire app with splash logic
4. Use AnimatePresence for smooth transition

```tsx
// New structure:
const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  return (
    <QueryClientProvider>
      <TooltipProvider>
        <AnimatePresence mode="wait">
          {showSplash ? (
            <SplashScreen 
              key="splash"
              onComplete={() => setShowSplash(false)} 
            />
          ) : (
            // Existing router setup with key="app"
          )}
        </AnimatePresence>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
```

### Key Points:
- Splash appears on every app mount (cold start)
- 2.5s duration before main app reveals
- Smooth cross-fade between splash and app
- z-index: 50 ensures splash covers everything

---

## Step 5: Update/Rename Loader Component

**Rename:** `GokalafLoader.tsx` → `DynabolicLoader.tsx`

### Changes:
- Update text from "GOKALAF" to "DYNABOLIC"
- Update import references throughout codebase
- Optionally integrate the new DynabolicLogo for visual consistency

---

## Technical Details

### Animation Physics (Framer Motion):

| Animation | Type | Duration | Easing |
|-----------|------|----------|--------|
| Path Drawing | pathLength | 1s | easeInOut |
| Segment Fade | opacity | 0.5s | easeOut |
| Lightning Pop | spring | - | stiffness: 300, damping: 20 |
| Zoom Through | scale/opacity | 0.7s | easeIn |
| Glow Pulse | boxShadow | 0.8s | easeInOut |

### SVG Filter for Neon Glow:
```xml
<filter id="neon-glow">
  <feGaussianBlur stdDeviation="5" result="coloredBlur" />
  <feMerge>
    <feMergeNode in="coloredBlur" />
    <feMergeNode in="SourceGraphic" />
  </feMerge>
</filter>
```

---

## File Structure After Implementation

```text
src/
├── components/
│   ├── DynabolicLogo.tsx      (NEW)
│   ├── DynabolicLoader.tsx    (RENAMED from GokalafLoader.tsx)
│   ├── SplashScreen.tsx       (NEW)
│   └── ...existing components
├── pages/
│   ├── BiometricLogin.tsx     (UPDATED - text only)
│   ├── Profil.tsx             (UPDATED - text only)
│   ├── Akademi.tsx            (UPDATED - text only)
│   └── ...
├── lib/
│   └── mockData.ts            (UPDATED - text only)
├── App.tsx                    (UPDATED - splash integration)
└── index.css                  (UPDATED - comments only)
```

---

## Safety Notes

- **No changes to core feature logic** (Nutrition, Camera, Macros, EliteDock)
- All existing components treated as "black box"
- Only visual/branding changes to existing files
- Splash screen is a pure wrapper, does not interfere with routing
- BiometricLogin remains the first route after splash

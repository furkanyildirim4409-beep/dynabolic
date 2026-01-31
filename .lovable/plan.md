

# Leaderboard & Challenge History Modal Fix Plan

## Problems Identified

### 1. Leaderboard Scroll Issue
- **Current**: Uses `h-screen` which doesn't account for mobile browser chrome (address bar, bottom bar)
- **Current**: Header has `sticky top-0` which is redundant inside a flex container
- **Current**: `scrollTop = 0` works but `h-screen` causes viewport clipping on mobile

### 2. Challenge History Modal Issues
- **Current**: Uses custom `motion.div` with `fixed bottom-0` positioning
- **Current**: Manual overlay implementation doesn't lock body scroll properly
- **Current**: No proper Dialog primitive usage - scrolling the modal can drag background

### 3. ChallengesSection Layout
- **Current**: Has `flex-1 overflow-y-auto` on line 177 which conflicts with parent scroll container
- **Current**: Should flow naturally inside the parent Leaderboard's scrollable area

---

## Solution Overview

```text
BEFORE                                AFTER
+------------------+                  +------------------+
| h-screen (bad)   |                  | h-[100dvh] (fix) |
|  +------------+  |                  |  +------------+  |
|  | sticky hdr |  |                  |  | header     |  | <- shrink-0, no sticky
|  +------------+  |                  |  +------------+  |
|  | scrollable |  |                  |  | scrollable |  |
|  | (broken)   |  |                  |  | flex-1     |  | <- ref for scroll reset
|  |            |  |                  |  | overflow   |  |
|  +------------+  |                  |  +------------+  |
+------------------+                  +------------------+
```

---

## Changes Required

### File 1: `src/pages/Leaderboard.tsx`

**Change 1: Fix container height (line 180)**
- Change `h-screen` to `h-[100dvh]`
- `100dvh` (dynamic viewport height) properly handles mobile browser bars

**Change 2: Remove sticky from header (line 182)**
- Change `sticky top-0 z-40` to `shrink-0 z-40`
- Header stays at top naturally due to flex column layout

**Change 3: Update scroll reset effect (lines 156-160)**
- Use `scrollTo({ top: 0, behavior: 'instant' })` for smoother reset
- This ensures immediate scroll to top without visual jump

---

### File 2: `src/components/ChallengeHistoryModal.tsx`

**Complete Refactor: Use Shadcn Dialog primitive**
- Import `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle` from `@/components/ui/dialog`
- Dialog handles body scroll locking automatically
- Proper overlay and z-index management

**Key Styling:**
```typescript
<DialogContent className="w-[95vw] max-w-md max-h-[85vh] p-0 gap-0 bg-[#0a0a0a] border-white/10 overflow-hidden">
```

**Internal Structure:**
- Header section: `shrink-0`
- Stats section: `shrink-0`
- Filter tabs: `shrink-0`
- List container: `flex-1 overflow-y-auto overscroll-contain min-h-0`

---

### File 3: `src/components/ChallengesSection.tsx`

**Change: Remove internal scroll container (line 177)**
- Change: `<div className="flex-1 overflow-y-auto space-y-2 min-h-0">`
- To: `<div className="space-y-2">`
- This allows content to flow naturally within parent's scroll area

---

## Technical Details

### Why `h-[100dvh]` instead of `h-screen`?
- `h-screen` = `100vh` = fixed viewport, ignores mobile browser chrome
- `h-[100dvh]` = dynamic viewport height, adjusts when address bar shows/hides
- Critical for mobile Safari and Chrome where browser UI is dynamic

### Why use Shadcn Dialog?
- Built on Radix UI primitives
- Automatic body scroll locking via `aria-modal` and `inert` attributes
- Proper focus management
- Handles escape key and outside click
- Z-index layering handled correctly

### Why remove internal scroll from ChallengesSection?
- Parent `Leaderboard.tsx` already has a scrollable container
- Nested scroll containers create confusion and broken scroll behavior
- Content should flow naturally and let the parent handle scrolling

---

## Expected Behavior After Fix

1. User navigates to Leaderboard
2. Page loads at scroll position 0 (header and tabs visible)
3. User can scroll down to see all athletes
4. Switching between "SIRALAMA" and "MEYDAN OKUMA" tabs resets scroll to top
5. Clicking an athlete opens Challenge History modal
6. Modal covers screen properly with dark overlay
7. Modal content scrolls internally without moving background
8. Closing modal returns to Leaderboard without scroll issues


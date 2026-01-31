

# Fix Leaderboard Scroll Position

## Problem
The Leaderboard page opens scrolled down because the current `window.scrollTo(0, 0)` targets the browser window, but the actual scrolling happens inside an internal container with `overflow-y-auto`. The window scroll has no effect on this nested scroll container.

## Solution
Use a `useRef` to target the specific scrollable container and reset its `scrollTop` to `0` on mount and when switching between tabs.

## Changes Required

### File: `src/pages/Leaderboard.tsx`

1. **Update imports** (line 1)
   - Add `useRef` to the React import

2. **Create ref** (after line 152)
   - Add: `const scrollContainerRef = useRef<HTMLDivElement>(null);`

3. **Update useEffect** (lines 154-157)
   - Change the scroll logic to target the ref instead of window
   - Add `activeTab` to the dependency array so switching tabs also resets scroll

4. **Attach ref to scrollable container** (line 215)
   - Add `ref={scrollContainerRef}` to the scrollable div

## Technical Details

```text
Before:
┌──────────────────────────────┐
│  h-screen container          │ ← window.scrollTo targets this (no scroll)
│  ┌────────────────────────┐  │
│  │  overflow-y-auto       │  │ ← actual scrolling happens here
│  │  (scrolled down)       │  │
│  └────────────────────────┘  │
└──────────────────────────────┘

After:
┌──────────────────────────────┐
│  h-screen container          │
│  ┌────────────────────────┐  │
│  │  ref={scrollContainerRef} │ ← scrollTop = 0 on mount
│  │  (starts at top)        │ │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

## Updated Code

**Import change:**
```typescript
import { useState, useEffect, useRef } from "react";
```

**Ref creation:**
```typescript
const scrollContainerRef = useRef<HTMLDivElement>(null);
```

**Updated useEffect:**
```typescript
useEffect(() => {
  if (scrollContainerRef.current) {
    scrollContainerRef.current.scrollTop = 0;
  }
}, [activeTab]);
```

**Container with ref:**
```typescript
<div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 pb-32 space-y-6">
```

## Behavior After Fix
- Page loads with header and navigation tabs visible
- Switching between "SIRALAMA" and "MEYDAN OKUMA" tabs resets scroll to top
- User can still scroll down to see all content



# Coach Admin Panel Sync - Phases 5, 6, 7 Implementation

This plan implements the Body Scan Upload component, CSS variable synchronization, and extended notification types to complete the Coach Admin Panel integration.

---

## Overview

| Phase | Feature | New Files | Modified Files |
|-------|---------|-----------|----------------|
| 5 | Body Scan Upload | `src/components/BodyScanUpload.tsx` | `src/pages/Profil.tsx` |
| 6 | CSS Variable Sync | - | `src/index.css`, `tailwind.config.ts` |
| 7 | Extended Notifications | - | `src/types/shared-models.ts`, `src/lib/mockData.ts` |

---

## Phase 5: Body Scan Upload Component

**Create:** `src/components/BodyScanUpload.tsx`

### Features
- Two photo upload slots side-by-side:
  - **"Ön Görünüm"** (Front View)
  - **"Yan Görünüm"** (Side View)
- Camera/file picker using native HTML input with accept="image/*"
- Mobile-first camera capture (capture="environment" attribute)
- Upload progress animation with neon lime accent
- Cyberpunk styling matching existing glass-card patterns
- Submit button to send photos to coach (simulated POST to `/api/athlete/:id/body-scan`)

### UI Layout
```text
┌─────────────────────────────────────────────────────┐
│  📷  VÜCUT TARAMA          [Koça Gönder]            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────┐    ┌─────────────────┐        │
│  │                 │    │                 │        │
│  │   [📷 Icon]     │    │   [📷 Icon]     │        │
│  │                 │    │                 │        │
│  │   ÖN GÖRÜNÜM    │    │   YAN GÖRÜNÜM   │        │
│  │                 │    │                 │        │
│  │ [Tap to upload] │    │ [Tap to upload] │        │
│  └─────────────────┘    └─────────────────┘        │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  Fotoğraf çekerken düz durun. Aydınlık bir   │  │
│  │  ortamda çekim yapın.                        │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Upload States
- **Empty**: Camera icon + placeholder text
- **Uploading**: Animated progress bar (0-100%)
- **Uploaded**: Image preview with delete button overlay
- **Submitted**: Green checkmark with "Koç Onayı Bekleniyor" badge

### Component Structure
```typescript
interface BodyScanUploadProps {
  onComplete?: () => void;
}

// State
const [frontImage, setFrontImage] = useState<string | null>(null);
const [sideImage, setSideImage] = useState<string | null>(null);
const [uploadProgress, setUploadProgress] = useState({ front: 0, side: 0 });
const [isSubmitting, setIsSubmitting] = useState(false);
```

### Integration with Profil.tsx
Add a new card section after "VÜCUT VERİLERİ" (Body Stats) section with a button that opens the BodyScanUpload modal.

---

## Phase 6: CSS Variable Sync

**Modify:** `src/index.css`

### CSS Variable Updates (in :root)
```css
:root {
  /* Updated to pure black for true void effect */
  --background: 0 0% 0%;        /* Was: 0 0% 2% */
  
  /* Updated card with slight blue tint */
  --card: 240 6% 4%;            /* Was: 0 0% 5% */
  
  /* New glass variables for consistency with Admin Panel */
  --glass-bg: 240 6% 4%;
  --glass-border: 240 4% 20%;
}
```

### Typography Change
**Current:**
```css
h1, h2, h3, h4, h5, h6 {
  font-family: 'Oswald', sans-serif;
  @apply font-bold uppercase tracking-wide;
}
```

**Updated:**
```css
h1, h2, h3, h4, h5, h6 {
  font-family: 'Inter', sans-serif;
  @apply font-semibold tracking-tight;
}
```

### New Glass Utility Class
```css
.glass-card-sync {
  background: hsl(var(--glass-bg) / 0.8);
  border: 1px solid hsl(var(--glass-border) / 0.5);
  @apply backdrop-blur-xl rounded-2xl;
}
```

**Modify:** `tailwind.config.ts`

Update font-display to use Inter (keeping it as fallback option):
```typescript
fontFamily: {
  sans: ['Inter', 'sans-serif'],
  display: ['Inter', 'sans-serif'],  // Changed from Oswald
},
```

Add glass color references:
```typescript
glass: {
  bg: "hsl(var(--glass-bg) / 0.8)",
  border: "hsl(var(--glass-border) / 0.5)",
},
```

---

## Phase 7: Extended Notification Types

**Modify:** `src/types/shared-models.ts`

Add new notification type definition:
```typescript
export type NotificationType = 
  | "coach"      // Messages from coach
  | "system"     // System announcements
  | "achievement" // Badges, milestones
  | "health"     // Health alerts, recovery warnings
  | "payment"    // Invoice due, payment received
  | "program"    // Program updates, new assignments
  | "checkin";   // Check-in reminders

export interface ExtendedNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  coachId?: string;
  actionUrl?: string;  // Deep link for navigation
  priority?: "low" | "normal" | "high";
  metadata?: {
    invoiceId?: string;
    programId?: string;
    achievementIcon?: string;
  };
}
```

**Modify:** `src/lib/mockData.ts`

Update the Notification interface (line 78-86):
```typescript
export interface Notification {
  id: string;
  type: "coach" | "system" | "achievement" | "health" | "payment" | "program" | "checkin";
  title: string;
  message: string;
  time: string;
  read: boolean;
  coachId?: string;
  actionUrl?: string;
  priority?: "low" | "normal" | "high";
}
```

Add sample notifications for new types:
```typescript
export const notifications: Notification[] = [
  // Existing types
  { id: "1", type: "coach", title: "Koç Serdar", message: "Yeni program güncellendi!", time: "5dk", read: false, coachId: "1", priority: "high" },
  { id: "2", type: "achievement", title: "Yeni Rozet!", message: "100 Antrenman rozetini kazandın! 🏆", time: "1s", read: false },
  
  // New types
  { id: "3", type: "health", title: "Toparlanma Uyarısı", message: "Göğüs kaslarınız dinlenme gerektiriyor", time: "2s", read: false, priority: "high" },
  { id: "4", type: "payment", title: "Ödeme Hatırlatması", message: "Aylık koçluk ödemesi yarın son gün", time: "12s", read: false, actionUrl: "/odemeler", priority: "high" },
  { id: "5", type: "program", title: "Program Güncellendi", message: "Bu haftaki antrenmanlarınız hazır", time: "1g", read: true, priority: "normal" },
  { id: "6", type: "checkin", title: "Check-in Zamanı", message: "Günlük durumunuzu bildirin", time: "4s", read: false, priority: "normal" },
  { id: "7", type: "system", title: "Yeni Özellik", message: "Vücut tarama özelliği eklendi!", time: "2g", read: true, priority: "low" },
];
```

---

## File Changes Summary

### New Files
| File | Description |
|------|-------------|
| `src/components/BodyScanUpload.tsx` | Photo upload component with dual slots |

### Modified Files
| File | Changes |
|------|---------|
| `src/pages/Profil.tsx` | Add Body Scan section with button |
| `src/index.css` | Update CSS variables, typography, add glass-card-sync |
| `tailwind.config.ts` | Update font-display, add glass colors |
| `src/types/shared-models.ts` | Add NotificationType and ExtendedNotification |
| `src/lib/mockData.ts` | Update Notification interface, add sample data |

---

## Technical Implementation Details

### BodyScanUpload Image Handling
```typescript
const handleImageUpload = (slot: "front" | "side") => (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  // Create preview URL
  const reader = new FileReader();
  reader.onloadstart = () => setUploadProgress(p => ({ ...p, [slot]: 10 }));
  reader.onprogress = (event) => {
    if (event.lengthComputable) {
      const progress = Math.round((event.loaded / event.total) * 100);
      setUploadProgress(p => ({ ...p, [slot]: progress }));
    }
  };
  reader.onload = () => {
    if (slot === "front") setFrontImage(reader.result as string);
    else setSideImage(reader.result as string);
    setUploadProgress(p => ({ ...p, [slot]: 100 }));
  };
  reader.readAsDataURL(file);
};
```

### Animation Patterns (Framer Motion)
```typescript
// Upload progress bar
<motion.div
  className="h-1 bg-primary rounded-full"
  initial={{ width: 0 }}
  animate={{ width: `${progress}%` }}
  transition={{ duration: 0.3 }}
/>

// Image preview fade-in
<motion.img
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: "spring" }}
  src={imageUrl}
/>
```

### Notification Type Icons Mapping
```typescript
const notificationIcons: Record<NotificationType, LucideIcon> = {
  coach: MessageSquare,
  system: Bell,
  achievement: Trophy,
  health: Heart,
  payment: CreditCard,
  program: Dumbbell,
  checkin: ClipboardCheck,
};
```

---

## Post-Implementation Verification

After implementation, verify:
- [ ] Body Scan shows two photo slots in Profil page
- [ ] Camera/gallery picker works on mobile
- [ ] Upload progress animation displays correctly
- [ ] Image previews render after upload
- [ ] Submit button shows loading state
- [ ] CSS variables create darker, bluer background
- [ ] Headers now use Inter font (not Oswald)
- [ ] Glass cards have consistent styling
- [ ] Extended notification types are properly typed
- [ ] Sample notifications cover all 7 types

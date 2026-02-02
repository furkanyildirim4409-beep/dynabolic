
# Arnold Schwarzenegger 6 Günlük Split Programı Ekleme Planı

## Özet
`src/lib/mockData.ts` dosyasındaki mevcut `detailedExercises` dizisi tamamen silinecek ve yerine Arnold Schwarzenegger'in efsanevi 6 günlük split antrenman programı eklenecek. Tüm notlar sert bir Türk vücut geliştirme koçu tarzında yazılacak.

## Yapılacak Değişiklikler

### 1. `detailedExercises` Dizisinin Yeniden Yazılması

Mevcut 4 egzersiz silinecek ve yerine 20 egzersiz eklenecek:

**GÜN 1 ve 4: GÖĞÜS ve SIRT (7 hareket)**
- Flat Barbell Bench Press
- Incline Barbell Bench Press  
- Dumbbell Flyes
- Dumbbell Pullover
- Wide Grip Chin Ups
- Bent Over Barbell Row
- Leg Raises (Karın)

**GÜN 2 ve 5: OMUZ ve KOL (7 hareket)**
- Clean and Press
- Dumbbell Shoulder Press
- Full Frontal Raise
- Barbell Curl (1-10 Method)
- Close-Grip Bench Press
- Barbell Skullcrushers
- Wrist Curls

**GÜN 3 ve 6: BACAK (6 hareket)**
- Barbell Squat
- Stiff-Leg Deadlift
- Lunges
- Leg Extension
- Leg Curl
- Standing Calf Raises

### 2. Veri Yapısı

Her egzersiz şu alanları içerecek:
- `id`: Benzersiz kimlik (örn: "arnold_day1_1")
- `name`: İngilizce egzersiz adı
- `category`: "Göğüs & Sırt", "Omuz & Kol", "Bacak" veya "Karın"
- `sets`: 4-5 set
- `reps`: 0 (piramit için notes'ta açıklama var)
- `targetReps`: Hedef tekrar sayısı
- `tempo`: Hareket temposu (örn: "2-0-1-0")
- `restDuration`: Dinlenme süresi (saniye), superset için 0
- `rpe`: Zorlanma derecesi (8-10 arası)
- `videoUrl`: Hareket GIF'leri
- `notes`: Türkçe koç notları

### 3. Notlar Tarzı

Tüm notlar şu tarzda yazılacak:
- Sert ve motive edici Türk koç dili
- Anahtar kelimeler: "Adele", "Pump", "Nizami", "Bas", "Sektirme", "Arnold", "Superset"
- Piramit sistemleri notes alanında açıklanacak
- Örnek: "Piramit sistem uygula: 30, 12, 10, 8, 6 tekrar. Ağırlığı her sette artır. Barı göğsüne değdir, sektirme. O göğüsler patlayacak!"

---

## Teknik Detaylar

### Tip Uyumluluğu
Mevcut tip tanımı korunacak:
```typescript
export const detailedExercises: (ProgramExercise & { 
  targetReps: number; 
  tempo: string; 
  restDuration: number 
})[]
```

### Etkilenen Dosyalar
- `src/lib/mockData.ts`: `detailedExercises` dizisi (satır 52-100) değişecek

### Bağımlılıklar
- `src/components/VisionAIExecution.tsx`: Bu bileşen `detailedExercises`'ı kullanıyor ancak tip değişmediği için sorunsuz çalışacak

### Korunan Veriler
Dosyadaki diğer tüm export'lar aynen korunacak:
- `coachAdjustments`
- `coaches`
- `foodDatabase`
- `workoutHistory`
- `notifications`
- `assignedWorkouts`
- `invoices`
- `coachStories`
- `bloodworkTrends`
- `wearableMetrics`
- `currentUser`
- `assignedSupplements`
- `shopSupplements`
- `exerciseHistory`

## Program Detayları

| Gün | Kas Grupları | Hareket Sayısı |
|-----|--------------|----------------|
| 1 & 4 | Göğüs & Sırt | 7 |
| 2 & 5 | Omuz & Kol | 7 |
| 3 & 6 | Bacak | 6 |

Toplam: 20 benzersiz egzersiz

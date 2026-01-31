// Central Mock Data for GOKALAF MVP
// All data is in Turkish as per requirements

import type { CoachAdjustment, ProgramExercise } from "@/types/shared-models";

// ============================================
// COACH ADJUSTMENTS (Real-time updates from Admin Panel)
// ============================================

export const coachAdjustments: CoachAdjustment[] = [
  {
    id: "adj-001",
    athleteId: "user-001",
    type: "intensity",
    previousValue: 70,
    value: 85,
    message: "Bu hafta daha yüksek yoğunlukla çalışabilirsin. Formun çok iyi, performansın artıyor!",
    appliedAt: new Date().toISOString(),
  },
  {
    id: "adj-002",
    athleteId: "user-001",
    type: "calories",
    previousValue: 2400,
    value: 2600,
    message: "Kas kütlesi artışı için kalori alımını yükseltiyoruz. Özellikle antrenman sonrası karbonhidratı artır.",
    appliedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "adj-003",
    athleteId: "user-001",
    type: "volume",
    previousValue: 16,
    value: 20,
    message: "Toparlanman mükemmel görünüyor. Set sayısını artırıyoruz.",
    appliedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const getLatestAdjustment = (athleteId: string, acknowledgedIds: string[]): CoachAdjustment | null => {
  const unacknowledged = coachAdjustments
    .filter(adj => adj.athleteId === athleteId && !acknowledgedIds.includes(adj.id))
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
  
  return unacknowledged[0] || null;
};

// ============================================
// DETAILED EXERCISE DATA (with RPE, notes, category)
// ============================================

export const detailedExercises: (ProgramExercise & { targetReps: number; tempo: string; restDuration: number })[] = [
  {
    id: "ex-001",
    name: "BARBELL SQUAT",
    sets: 4,
    reps: 12,
    targetReps: 12,
    tempo: "3010",
    restDuration: 90,
    rpe: 8,
    notes: "Negatif fazda 3 saniye kontrollü in. Diz açısı 90 dereceyi geçmesin.",
    category: "Bacak / Güç",
  },
  {
    id: "ex-002",
    name: "LEG PRESS",
    sets: 4,
    reps: 15,
    targetReps: 15,
    tempo: "2010",
    restDuration: 75,
    rpe: 7,
    notes: "Ayak pozisyonunu yüksek tut, kalçayı vurgula.",
    category: "Bacak / Hipertrofi",
  },
  {
    id: "ex-003",
    name: "LEG CURL",
    sets: 4,
    reps: 12,
    targetReps: 12,
    tempo: "3011",
    restDuration: 60,
    rpe: 9,
    notes: "Son 2 tekrarda zorlan, drop set uygulayabilirsin.",
    category: "Arka Bacak / İzolasyon",
  },
  {
    id: "ex-004",
    name: "CALF RAISE",
    sets: 4,
    reps: 20,
    targetReps: 20,
    tempo: "2010",
    restDuration: 45,
    rpe: 6,
    category: "Baldır / Dayanıklılık",
  },
];



export interface Coach {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  specialty: string;
  followers: string;
  students: number;
  rating: number;
  score: number;
  level: number;
  hasNewStory: boolean;
  highlights: { id: string; title: string; thumbnail: string }[];
  posts: {
    id: string;
    type: "transformation" | "video" | "motivation";
    beforeImage?: string;
    afterImage?: string;
    videoThumbnail?: string;
    content?: string;
    likes: number;
    comments: number;
  }[];
  products: {
    id: string;
    title: string;
    price: number;
    bioCoins?: number;
    image: string;
    type: "ebook" | "pdf" | "apparel" | "equipment";
  }[];
  packages: {
    id: string;
    title: string;
    price: number;
    description: string;
    features: string[];
  }[];
  storyContent: {
    image: string;
    text: string;
  };
}

export interface FoodItem {
  id: string;
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WorkoutHistoryEntry {
  id: string;
  date: string;
  dateShort: string;
  name: string;
  duration: string;
  tonnage: string;
  exercises: number;
  bioCoins: number;
  completed: boolean;
  details: {
    exerciseName: string;
    sets: {
      weight: number;
      reps: number;
      isFailure?: boolean;
    }[];
  }[];
}

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

// ============================================
// COACHES DATABASE
// ============================================

export const coaches: Coach[] = [
  // COACH 1: KOÇ SERDAR - The Boss (Hipertrofi)
  {
    id: "1",
    name: "Koç Serdar",
    avatar: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=400&fit=crop&crop=face",
    bio: "Elit Performans Koçu | Bio-Hacker 🧬 | 10+ Yıl Deneyim | 500+ Başarılı Dönüşüm",
    specialty: "Hipertrofi & Vücut Geliştirme",
    followers: "12.4K",
    students: 150,
    rating: 4.9,
    score: 9850,
    level: 10,
    hasNewStory: true,
    storyContent: {
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=1200&fit=crop",
      text: "Bugünkü ipucu: Kas büyümesi için uyku kalitesi kritik! Günde minimum 7-8 saat uyku hedefle. 💪"
    },
    highlights: [
      { id: "1", title: "Değişimler", thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=100&h=100&fit=crop" },
      { id: "2", title: "Soru-Cevap", thumbnail: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=100&h=100&fit=crop" },
      { id: "3", title: "Yemekler", thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=100&h=100&fit=crop" },
      { id: "4", title: "Motivasyon", thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100&h=100&fit=crop" },
    ],
    posts: [
      {
        id: "1",
        type: "transformation",
        beforeImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop",
        afterImage: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=500&fit=crop",
        content: "12 haftalık dönüşüm programı sonucu. Disiplin + Bilim = Sonuç 💪 #DynabolicAilesi",
        likes: 2847,
        comments: 156,
      },
      {
        id: "2",
        type: "video",
        videoThumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop",
        content: "Squat formunda dikkat etmeniz gereken 3 kritik nokta! 🎯",
        likes: 1892,
        comments: 89,
      },
      {
        id: "3",
        type: "transformation",
        beforeImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop",
        afterImage: "https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=400&h=500&fit=crop",
        content: "6 ayda 25kg kas kütlesi artışı. Doğru program + beslenme = imkansız yok.",
        likes: 3241,
        comments: 234,
      },
    ],
    products: [
      { 
        id: "1", 
        title: "Kol İnşa Rehberi (E-Kitap)", 
        price: 150, 
        bioCoins: 500,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop", 
        type: "ebook" 
      },
      { 
        id: "2", 
        title: "Dynabolic Lifting Straps", 
        price: 250, 
        image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=300&h=300&fit=crop", 
        type: "equipment" 
      },
      { 
        id: "3", 
        title: "Hipertrofi Beslenme Planı", 
        price: 200, 
        bioCoins: 650,
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=300&fit=crop", 
        type: "pdf" 
      },
      { 
        id: "4", 
        title: "Dynabolic Pro Atlet (Siyah)", 
        price: 450, 
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop", 
        type: "apparel" 
      },
    ],
    packages: [
      {
        id: "1",
        title: "Online Koçluk (Aylık)",
        price: 1500,
        description: "Kişiselleştirilmiş antrenman ve beslenme programı",
        features: ["Haftalık program güncelleme", "7/24 mesaj desteği", "Video form analizi", "Haftalık check-in"]
      },
      {
        id: "2",
        title: "Yarışma Hazırlık",
        price: 3000,
        description: "Vücut geliştirme yarışmalarına tam hazırlık paketi",
        features: ["Günlük takip", "Posing eğitimi", "Peak week stratejisi", "Sahne hazırlığı", "Mental koçluk"]
      },
      {
        id: "3",
        title: "VIP Birebir Koçluk",
        price: 5000,
        description: "Premium birebir koçluk deneyimi",
        features: ["Sınırsız iletişim", "Günlük program ayarı", "Yüz yüze görüşme (aylık)", "Özel supleman planı"]
      }
    ]
  },

  // COACH 2: KOÇ ELİF - The Specialist (Mobilite)
  {
    id: "2",
    name: "Koç Elif",
    avatar: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop&crop=face",
    bio: "Mobilite & Fonksiyonel Antrenör 🧘‍♀️ | Fizik Tedavi Uzmanı | Yoga & Pilates Sertifikalı",
    specialty: "Mobilite & Fonksiyonel Güç",
    followers: "8.7K",
    students: 120,
    rating: 4.8,
    score: 8720,
    level: 9,
    hasNewStory: true,
    storyContent: {
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=1200&fit=crop",
      text: "Sabah 10 dakika esneme, gününüze enerji katar! Omurga sağlığınızı koruyun 🧘‍♀️"
    },
    highlights: [
      { id: "1", title: "Esneme", thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=100&h=100&fit=crop" },
      { id: "2", title: "Yoga", thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&h=100&fit=crop" },
      { id: "3", title: "Pilates", thumbnail: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=100&h=100&fit=crop" },
      { id: "4", title: "Rehab", thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop" },
    ],
    posts: [
      {
        id: "1",
        type: "video",
        videoThumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop",
        content: "Günlük 5 dakikada omuz mobilitesini artır! İşte en etkili 3 hareket 🎯",
        likes: 1523,
        comments: 89,
      },
      {
        id: "2",
        type: "motivation",
        content: "\"Esneklik, gücün temelidir. Esnek olmadan güçlü olamazsın.\" Bugün esneme yaptın mı? 🧘‍♀️",
        likes: 982,
        comments: 45,
      },
      {
        id: "3",
        type: "video",
        videoThumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
        content: "Full split hedefine 30 günde ulaş! İşte günlük program detayları 📋",
        likes: 2156,
        comments: 178,
      },
    ],
    products: [
      { 
        id: "1", 
        title: "Evde Mobilite Planı", 
        price: 200, 
        bioCoins: 650,
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=300&fit=crop", 
        type: "pdf" 
      },
      { 
        id: "2", 
        title: "Direnç Bandı Seti", 
        price: 120, 
        image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=300&h=300&fit=crop", 
        type: "equipment" 
      },
      { 
        id: "3", 
        title: "Yoga Başlangıç E-Kitap", 
        price: 90, 
        bioCoins: 300,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop", 
        type: "ebook" 
      },
      { 
        id: "4", 
        title: "Foam Roller Pro", 
        price: 280, 
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop", 
        type: "equipment" 
      },
    ],
    packages: [
      {
        id: "1",
        title: "Mobilite Koçluğu (Aylık)",
        price: 1200,
        description: "Kişisel esneklik ve hareket kalitesi programı",
        features: ["Haftalık esneme rutini", "Video analiz", "Postür düzeltme", "Ağrı yönetimi"]
      },
      {
        id: "2",
        title: "Rehabilitasyon Programı",
        price: 2000,
        description: "Sakatlık sonrası toparlanma ve güçlendirme",
        features: ["Fizyoterapist işbirliği", "Günlük takip", "Özel egzersizler", "İlerleme raporları"]
      }
    ]
  },

  // COACH 3: KOÇ MEHMET - The Powerlifter (Güç)
  {
    id: "3",
    name: "Koç Mehmet",
    avatar: "https://images.unsplash.com/photo-1583468982228-19f19164aee2?w=400&h=400&fit=crop&crop=face",
    bio: "Powerlifting Antrenörü 🏋️ | Türkiye Şampiyonu | IPF Hakemi | 15+ Yıl Tecrübe",
    specialty: "Güç & Powerlifting",
    followers: "15.2K",
    students: 95,
    rating: 4.7,
    score: 7540,
    level: 9,
    hasNewStory: false,
    storyContent: {
      image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&h=1200&fit=crop",
      text: "Bugün deadlift günü! Form her şeyden önemli. Ağırlık ikinci planda kalmalı 🏋️"
    },
    highlights: [
      { id: "1", title: "PR'lar", thumbnail: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=100&h=100&fit=crop" },
      { id: "2", title: "Teknik", thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop" },
      { id: "3", title: "Yarışma", thumbnail: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=100&h=100&fit=crop" },
      { id: "4", title: "Beslenme", thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=100&h=100&fit=crop" },
    ],
    posts: [
      {
        id: "1",
        type: "video",
        videoThumbnail: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&h=400&fit=crop",
        content: "300kg Deadlift PR! 🔥 2 yıllık çalışmanın karşılığı. Asla pes etme!",
        likes: 4521,
        comments: 312,
      },
      {
        id: "2",
        type: "transformation",
        beforeImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop",
        afterImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=500&fit=crop",
        content: "Öğrencimin 1 yıllık güç artışı: Squat 100kg → 200kg. Sabır + Disiplin 💪",
        likes: 3892,
        comments: 256,
      },
      {
        id: "3",
        type: "motivation",
        content: "\"Ağırlık seni ezmeden önce, sen onu ez.\" Bugün hangi PR'ı kıracaksın? 🏋️",
        likes: 1756,
        comments: 98,
      },
    ],
    products: [
      { 
        id: "1", 
        title: "S.B.D. Programı (12 Hafta)", 
        price: 300, 
        bioCoins: 1000,
        image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=300&h=300&fit=crop", 
        type: "ebook" 
      },
      { 
        id: "2", 
        title: "Powerlifting Kemeri", 
        price: 1200, 
        image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=300&h=300&fit=crop", 
        type: "equipment" 
      },
      { 
        id: "3", 
        title: "Güç Periodizasyonu (PDF)", 
        price: 180, 
        bioCoins: 600,
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop", 
        type: "pdf" 
      },
      { 
        id: "4", 
        title: "Wrist Wraps Pro", 
        price: 150, 
        image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=300&h=300&fit=crop", 
        type: "equipment" 
      },
    ],
    packages: [
      {
        id: "1",
        title: "Powerlifting Koçluğu (Aylık)",
        price: 1800,
        description: "Squat, Bench, Deadlift odaklı güç programı",
        features: ["Kişisel program", "Haftalık video analiz", "PR takibi", "Yarışma stratejisi"]
      },
      {
        id: "2",
        title: "Yarışma Hazırlık Elite",
        price: 3500,
        description: "IPF/WRPF yarışmalarına hazırlık paketi",
        features: ["12 haftalık peak program", "Kilo kontrolü", "Attempt seçimi", "Mental hazırlık", "Yarışma günü koçluk"]
      }
    ]
  }
];

// Helper function to get coach by ID
export const getCoachById = (id: string): Coach | undefined => {
  return coaches.find(coach => coach.id === id);
};

// Get sorted coaches for leaderboard
export const getLeaderboardCoaches = (): Coach[] => {
  return [...coaches].sort((a, b) => b.score - a.score);
};

// ============================================
// FOOD DATABASE
// ============================================

export const foodDatabase: FoodItem[] = [
  { id: "1", name: "Haşlanmış Yumurta", portion: "1 adet", calories: 70, protein: 6, carbs: 0.5, fat: 5 },
  { id: "2", name: "Tavuk Göğsü (Pişmiş)", portion: "100g", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: "3", name: "Basmati Pirinç (Lapa)", portion: "100g", calories: 130, protein: 2.5, carbs: 28, fat: 0.3 },
  { id: "4", name: "Yulaf Ezmesi", portion: "50g", calories: 180, protein: 6, carbs: 30, fat: 3 },
  { id: "5", name: "Whey Protein", portion: "1 ölçek", calories: 120, protein: 24, carbs: 3, fat: 1.5 },
  { id: "6", name: "Muz", portion: "1 orta boy", calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { id: "7", name: "Yoğurt (Tam Yağlı)", portion: "200g", calories: 130, protein: 8, carbs: 10, fat: 6 },
  { id: "8", name: "Zeytinyağı", portion: "1 yemek kaşığı", calories: 119, protein: 0, carbs: 0, fat: 13.5 },
  { id: "9", name: "Tam Buğday Ekmek", portion: "1 dilim", calories: 80, protein: 4, carbs: 15, fat: 1 },
  { id: "10", name: "Badem", portion: "30g", calories: 170, protein: 6, carbs: 6, fat: 15 },
  { id: "11", name: "Somon (Izgara)", portion: "150g", calories: 280, protein: 39, carbs: 0, fat: 13 },
  { id: "12", name: "Biftek (Izgara)", portion: "150g", calories: 320, protein: 42, carbs: 0, fat: 16 },
  { id: "13", name: "Brokoli (Haşlanmış)", portion: "100g", calories: 35, protein: 2.4, carbs: 7, fat: 0.4 },
  { id: "14", name: "Tatlı Patates", portion: "150g", calories: 130, protein: 2, carbs: 30, fat: 0.1 },
  { id: "15", name: "Avokado", portion: "1/2 adet", calories: 160, protein: 2, carbs: 9, fat: 15 },
  { id: "16", name: "Lor Peyniri", portion: "100g", calories: 98, protein: 11, carbs: 3, fat: 4.3 },
  { id: "17", name: "Makarna (Pişmiş)", portion: "100g", calories: 131, protein: 5, carbs: 25, fat: 1.1 },
  { id: "18", name: "Mercimek Çorbası", portion: "1 kase", calories: 180, protein: 12, carbs: 28, fat: 3 },
  { id: "19", name: "Fıstık Ezmesi", portion: "2 yemek kaşığı", calories: 190, protein: 7, carbs: 7, fat: 16 },
  { id: "20", name: "Süt (%1.5 Yağlı)", portion: "200ml", calories: 90, protein: 6, carbs: 10, fat: 3 },
];

// ============================================
// WORKOUT HISTORY WITH DETAILS
// ============================================

export const workoutHistory: WorkoutHistoryEntry[] = [
  { 
    id: "1", 
    date: "27 Ocak 2026", 
    dateShort: "27 Oca", 
    name: "Göğüs & Arka Kol", 
    duration: "55dk", 
    tonnage: "4.2 Ton", 
    exercises: 6, 
    bioCoins: 75, 
    completed: true,
    details: [
      { 
        exerciseName: "Bench Press", 
        sets: [
          { weight: 100, reps: 12 },
          { weight: 100, reps: 10 },
          { weight: 100, reps: 8, isFailure: true },
          { weight: 90, reps: 10 }
        ] 
      },
      { 
        exerciseName: "Incline Dumbbell Press", 
        sets: [
          { weight: 35, reps: 12 },
          { weight: 35, reps: 10 },
          { weight: 32, reps: 10 },
          { weight: 30, reps: 12 }
        ] 
      },
      { 
        exerciseName: "Cable Fly", 
        sets: [
          { weight: 20, reps: 15 },
          { weight: 22.5, reps: 12 },
          { weight: 25, reps: 10, isFailure: true }
        ] 
      },
      { 
        exerciseName: "Triceps Pushdown", 
        sets: [
          { weight: 30, reps: 15 },
          { weight: 35, reps: 12 },
          { weight: 40, reps: 10 }
        ] 
      },
      { 
        exerciseName: "Overhead Triceps Extension", 
        sets: [
          { weight: 25, reps: 12 },
          { weight: 27.5, reps: 10 },
          { weight: 30, reps: 8, isFailure: true }
        ] 
      },
      { 
        exerciseName: "Dips", 
        sets: [
          { weight: 0, reps: 15 },
          { weight: 10, reps: 12 },
          { weight: 15, reps: 8 }
        ] 
      }
    ]
  },
  { 
    id: "2", 
    date: "25 Ocak 2026", 
    dateShort: "25 Oca", 
    name: "Bacak & Core", 
    duration: "48dk", 
    tonnage: "5.8 Ton", 
    exercises: 5, 
    bioCoins: 80, 
    completed: true,
    details: [
      { 
        exerciseName: "Squat", 
        sets: [
          { weight: 140, reps: 8 },
          { weight: 150, reps: 6 },
          { weight: 160, reps: 4 },
          { weight: 140, reps: 8 }
        ] 
      },
      { 
        exerciseName: "Leg Press", 
        sets: [
          { weight: 250, reps: 12 },
          { weight: 280, reps: 10 },
          { weight: 300, reps: 8, isFailure: true }
        ] 
      },
      { 
        exerciseName: "Romanian Deadlift", 
        sets: [
          { weight: 100, reps: 10 },
          { weight: 110, reps: 8 },
          { weight: 120, reps: 6 }
        ] 
      },
      { 
        exerciseName: "Leg Curl", 
        sets: [
          { weight: 50, reps: 12 },
          { weight: 55, reps: 10 },
          { weight: 60, reps: 8 }
        ] 
      },
      { 
        exerciseName: "Plank", 
        sets: [
          { weight: 0, reps: 60 },
          { weight: 0, reps: 45 },
          { weight: 0, reps: 30 }
        ] 
      }
    ]
  },
  { 
    id: "3", 
    date: "23 Ocak 2026", 
    dateShort: "23 Oca", 
    name: "Sırt & Biceps", 
    duration: "52dk", 
    tonnage: "3.9 Ton", 
    exercises: 7, 
    bioCoins: 70, 
    completed: true,
    details: [
      { 
        exerciseName: "Deadlift", 
        sets: [
          { weight: 180, reps: 5 },
          { weight: 200, reps: 3 },
          { weight: 180, reps: 5 }
        ] 
      },
      { 
        exerciseName: "Lat Pulldown", 
        sets: [
          { weight: 70, reps: 12 },
          { weight: 80, reps: 10 },
          { weight: 85, reps: 8 }
        ] 
      },
      { 
        exerciseName: "Bent Over Row", 
        sets: [
          { weight: 80, reps: 10 },
          { weight: 85, reps: 8 },
          { weight: 90, reps: 6, isFailure: true }
        ] 
      },
      { 
        exerciseName: "Cable Row", 
        sets: [
          { weight: 60, reps: 12 },
          { weight: 65, reps: 10 },
          { weight: 70, reps: 10 }
        ] 
      },
      { 
        exerciseName: "Barbell Curl", 
        sets: [
          { weight: 30, reps: 12 },
          { weight: 35, reps: 10 },
          { weight: 40, reps: 8, isFailure: true }
        ] 
      },
      { 
        exerciseName: "Hammer Curl", 
        sets: [
          { weight: 14, reps: 12 },
          { weight: 16, reps: 10 },
          { weight: 18, reps: 8 }
        ] 
      },
      { 
        exerciseName: "Face Pull", 
        sets: [
          { weight: 25, reps: 15 },
          { weight: 30, reps: 12 },
          { weight: 30, reps: 12 }
        ] 
      }
    ]
  },
  { 
    id: "4", 
    date: "21 Ocak 2026", 
    dateShort: "21 Oca", 
    name: "Omuz & Trapez", 
    duration: "42dk", 
    tonnage: "2.8 Ton", 
    exercises: 5, 
    bioCoins: 60, 
    completed: true,
    details: [
      { 
        exerciseName: "Overhead Press", 
        sets: [
          { weight: 60, reps: 8 },
          { weight: 65, reps: 6 },
          { weight: 55, reps: 10 }
        ] 
      },
      { 
        exerciseName: "Lateral Raise", 
        sets: [
          { weight: 12, reps: 15 },
          { weight: 14, reps: 12 },
          { weight: 14, reps: 12 }
        ] 
      },
      { 
        exerciseName: "Front Raise", 
        sets: [
          { weight: 10, reps: 12 },
          { weight: 12, reps: 10 },
          { weight: 12, reps: 10 }
        ] 
      },
      { 
        exerciseName: "Shrugs", 
        sets: [
          { weight: 100, reps: 15 },
          { weight: 120, reps: 12 },
          { weight: 140, reps: 10 }
        ] 
      },
      { 
        exerciseName: "Rear Delt Fly", 
        sets: [
          { weight: 10, reps: 15 },
          { weight: 12, reps: 12 },
          { weight: 12, reps: 12 }
        ] 
      }
    ]
  },
  { 
    id: "5", 
    date: "19 Ocak 2026", 
    dateShort: "19 Oca", 
    name: "Full Body", 
    duration: "65dk", 
    tonnage: "6.1 Ton", 
    exercises: 8, 
    bioCoins: 95, 
    completed: true,
    details: [
      { exerciseName: "Squat", sets: [{ weight: 120, reps: 10 }, { weight: 130, reps: 8 }, { weight: 140, reps: 6 }] },
      { exerciseName: "Bench Press", sets: [{ weight: 90, reps: 10 }, { weight: 95, reps: 8 }, { weight: 100, reps: 6 }] },
      { exerciseName: "Deadlift", sets: [{ weight: 160, reps: 6 }, { weight: 170, reps: 5 }, { weight: 180, reps: 3 }] },
      { exerciseName: "Pull-ups", sets: [{ weight: 0, reps: 12 }, { weight: 0, reps: 10 }, { weight: 0, reps: 8 }] },
      { exerciseName: "Overhead Press", sets: [{ weight: 50, reps: 10 }, { weight: 55, reps: 8 }, { weight: 60, reps: 6 }] },
      { exerciseName: "Barbell Row", sets: [{ weight: 70, reps: 10 }, { weight: 75, reps: 8 }, { weight: 80, reps: 8 }] },
      { exerciseName: "Lunges", sets: [{ weight: 40, reps: 12 }, { weight: 45, reps: 10 }, { weight: 50, reps: 8 }] },
      { exerciseName: "Plank", sets: [{ weight: 0, reps: 60 }, { weight: 0, reps: 45 }] }
    ]
  },
  { 
    id: "6", 
    date: "17 Ocak 2026", 
    dateShort: "17 Oca", 
    name: "Göğüs & Arka Kol", 
    duration: "50dk", 
    tonnage: "4.0 Ton", 
    exercises: 6, 
    bioCoins: 72, 
    completed: true,
    details: [
      { exerciseName: "Bench Press", sets: [{ weight: 95, reps: 10 }, { weight: 95, reps: 10 }, { weight: 90, reps: 10 }] },
      { exerciseName: "Incline Press", sets: [{ weight: 32, reps: 12 }, { weight: 35, reps: 10 }, { weight: 35, reps: 8 }] },
      { exerciseName: "Cable Fly", sets: [{ weight: 18, reps: 15 }, { weight: 20, reps: 12 }, { weight: 22, reps: 10 }] },
      { exerciseName: "Triceps Dips", sets: [{ weight: 0, reps: 15 }, { weight: 0, reps: 12 }, { weight: 0, reps: 10 }] },
      { exerciseName: "Skull Crushers", sets: [{ weight: 25, reps: 12 }, { weight: 27.5, reps: 10 }, { weight: 30, reps: 8 }] },
      { exerciseName: "Triceps Kickback", sets: [{ weight: 10, reps: 15 }, { weight: 12, reps: 12 }, { weight: 12, reps: 12 }] }
    ]
  }
];

// ============================================
// NOTIFICATIONS
// ============================================

export const notifications: Notification[] = [
  {
    id: "1",
    type: "coach",
    title: "Koç Serdar",
    message: "Programını güncelledi. Yeni haftanın antrenmanlarını kontrol et!",
    time: "5dk önce",
    read: false,
    coachId: "1",
    priority: "high"
  },
  {
    id: "2",
    type: "achievement",
    title: "Yeni Rozet!",
    message: "\"150 Antrenman\" rozetini kazandın! +50 Bio-Coin 🎉",
    time: "2sa önce",
    read: false,
    priority: "normal"
  },
  {
    id: "3",
    type: "health",
    title: "Toparlanma Uyarısı",
    message: "Göğüs kaslarınız dinlenme gerektiriyor. Bugün üst vücut antrenmanından kaçının.",
    time: "2sa önce",
    read: false,
    priority: "high"
  },
  {
    id: "4",
    type: "payment",
    title: "Ödeme Hatırlatması",
    message: "Aylık koçluk ödemesi yarın son gün. Gecikmemesi için şimdi ödeyin.",
    time: "12sa önce",
    read: false,
    actionUrl: "/odemeler",
    priority: "high"
  },
  {
    id: "5",
    type: "program",
    title: "Program Güncellendi",
    message: "Bu haftaki antrenmanlarınız hazır. Yeni egzersizler eklendi!",
    time: "1g önce",
    read: true,
    priority: "normal"
  },
  {
    id: "6",
    type: "checkin",
    title: "Check-in Zamanı",
    message: "Günlük durumunuzu bildirin. Koçunuz ilerlemenizi takip etsin.",
    time: "4sa önce",
    read: false,
    priority: "normal"
  },
  {
    id: "7",
    type: "system",
    title: "Yeni Özellik",
    message: "Vücut tarama özelliği eklendi! Profil sayfasından fotoğraf yükleyebilirsiniz.",
    time: "2g önce",
    read: true,
    priority: "low"
  },
  {
    id: "8",
    type: "system",
    title: "Haftalık Özet",
    message: "Bu hafta 5 antrenman tamamladın ve 380 Bio-Coin kazandın.",
    time: "3g önce",
    read: true,
    priority: "low"
  },
  {
    id: "9",
    type: "coach",
    title: "Koç Elif",
    message: "Yeni mobilite videosu yükledi. Kaçırma!",
    time: "4g önce",
    read: true,
    coachId: "2",
    priority: "normal"
  }
];

// ============================================
// ASSIGNED WORKOUTS
// ============================================

export const assignedWorkouts = [
  {
    id: "1",
    title: "GÖĞÜS & SIRT",
    day: "GÜN 1 - PAZARTESİ",
    exercises: 8,
    duration: "55 dk",
    intensity: "Yüksek" as const,
    coachNote: "Tempoya dikkat et. Göğüs açıklığını koru.",
  },
  {
    id: "2",
    title: "BACAK & KOR",
    day: "GÜN 2 - ÇARŞAMBA",
    exercises: 6,
    duration: "45 dk",
    intensity: "Yüksek" as const,
    coachNote: "Squat derinliğini Vision AI ile kontrol et.",
  },
  {
    id: "3",
    title: "OMUZ & KOL",
    day: "GÜN 3 - CUMA",
    exercises: 7,
    duration: "50 dk",
    intensity: "Orta" as const,
  },
  {
    id: "4",
    title: "AKTİF DİNLENME",
    day: "GÜN 4 - PAZAR",
    exercises: 4,
    duration: "30 dk",
    intensity: "Düşük" as const,
    coachNote: "Esneme hareketlerine odaklan.",
  },
  {
    id: "5",
    title: "FULL BODY",
    day: "GÜN 5 - SALI",
    exercises: 8,
    duration: "60 dk",
    intensity: "Yüksek" as const,
    coachNote: "Tüm kas gruplarını çalıştıracağız. Enerji seviyeni yüksek tut.",
  },
];

// User's assigned coach
export const assignedCoach = coaches[0]; // Koç Serdar

// ============================================
// INVOICES DATA
// ============================================

import type { Invoice, CoachStory, BloodworkReport } from "@/types/shared-models";

// ============================================
// BLOODWORK REPORTS DATA
// ============================================

export const bloodworkReports: BloodworkReport[] = [
  {
    id: "bw-1",
    uploadDate: "2026-01-15",
    fileName: "kan_tahlili_ocak_2026.pdf",
    fileType: "pdf",
    status: "analyzed",
    coachNotes: "Vitamin D seviyesi düşük, takviye önerildi. Ferritin de sınırda, demir açısından zengin gıdalara yönel.",
    analysisDate: "2026-01-16",
    flaggedValues: ["Vitamin D", "Ferritin"],
  },
  {
    id: "bw-2",
    uploadDate: "2025-10-20",
    fileName: "check_up_ekim.pdf",
    fileType: "pdf",
    status: "analyzed",
    coachNotes: "Tüm değerler normal aralıkta. Harika gidiyorsun!",
    analysisDate: "2025-10-22",
  },
  {
    id: "bw-3",
    uploadDate: "2026-01-27",
    fileName: "yeni_tahlil.jpg",
    fileType: "image",
    status: "pending",
  },
];

export const invoices: Invoice[] = [
  { 
    id: "1", 
    clientId: "user-1",
    clientName: "Ahmet Yılmaz",
    amount: 1500, 
    status: "paid", 
    date: "2026-01-15", 
    serviceType: "Aylık Koçluk" 
  },
  { 
    id: "2", 
    clientId: "user-1",
    clientName: "Ahmet Yılmaz",
    amount: 300, 
    status: "pending", 
    date: "2026-01-28", 
    dueDate: "2026-02-02", // 2 days from now (current date is 2026-01-31)
    serviceType: "E-Kitap" 
  },
  { 
    id: "3", 
    clientId: "user-1",
    clientName: "Ahmet Yılmaz",
    amount: 1500, 
    status: "overdue", 
    date: "2026-01-01", 
    dueDate: "2026-01-15", 
    serviceType: "Aylık Koçluk" 
  },
  { 
    id: "4", 
    clientId: "user-1",
    clientName: "Ahmet Yılmaz",
    amount: 250, 
    status: "paid", 
    date: "2025-12-20", 
    serviceType: "Lifting Straps" 
  },
  { 
    id: "5", 
    clientId: "user-1",
    clientName: "Ahmet Yılmaz",
    amount: 1500, 
    status: "paid", 
    date: "2025-12-15", 
    serviceType: "Aylık Koçluk" 
  },
];

// ============================================
// COACH STORIES DATA
// ============================================

export const coachStories: CoachStory[] = [
  // Değişimler
  {
    id: "1",
    title: "Haftalık Dönüşüm",
    thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=100&h=100&fit=crop",
    category: "Değişimler",
    content: {
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=1200&fit=crop",
      text: "12 haftada inanılmaz dönüşüm! Ahmet, disiplinli çalışmasıyla 15kg kas kütlesi kazandı. 💪"
    },
    createdAt: "2026-01-27T10:00:00Z"
  },
  {
    id: "2",
    title: "Vücut Rekomposizyonu",
    thumbnail: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=100&h=100&fit=crop",
    category: "Değişimler",
    content: {
      image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=1200&fit=crop",
      text: "Kilo vermeden form kazanmak mümkün! Mehmet'in 8 haftalık rekomposizyon yolculuğu."
    },
    createdAt: "2026-01-26T14:30:00Z"
  },
  // Soru-Cevap
  {
    id: "3",
    title: "Sıkça Sorulan",
    thumbnail: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=100&h=100&fit=crop",
    category: "Soru-Cevap",
    content: {
      image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=1200&fit=crop",
      text: "Protein ne zaman alınmalı? Antrenman öncesi mi sonrası mı? Cevap: Toplam günlük protein daha önemli!"
    },
    createdAt: "2026-01-25T09:00:00Z"
  },
  // Başarılar
  {
    id: "4",
    title: "PR Kırıldı!",
    thumbnail: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=100&h=100&fit=crop",
    category: "Başarılar",
    content: {
      image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&h=1200&fit=crop",
      text: "Öğrencim Ayşe, squat'ta 100kg PR kırdı! 🎉 3 aylık program sonucu."
    },
    createdAt: "2026-01-24T16:00:00Z"
  },
  {
    id: "5",
    title: "Yarışma Zaferi",
    thumbnail: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=100&h=100&fit=crop",
    category: "Başarılar",
    content: {
      image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800&h=1200&fit=crop",
      text: "Türkiye Natural Vücut Geliştirme Şampiyonası'nda 2. sıra! Tebrikler Can!"
    },
    createdAt: "2026-01-23T11:00:00Z"
  },
  // Antrenman
  {
    id: "6",
    title: "Günün İpucu",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop",
    category: "Antrenman",
    content: {
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=1200&fit=crop",
      text: "Bench Press'te omuz ağrısı mı? Skapular retraksiyon yaparak omuz bıçaklarını birbirine yaklaştır!"
    },
    createdAt: "2026-01-22T08:00:00Z"
  },
  {
    id: "7",
    title: "Form Analizi",
    thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100&h=100&fit=crop",
    category: "Antrenman",
    content: {
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=1200&fit=crop",
      text: "Deadlift'te bel yuvarlama problemi? Kalça menteşesi hareketine odaklan, sırt düz kalsın."
    },
    createdAt: "2026-01-21T13:00:00Z"
  },
  // Motivasyon
  {
    id: "8",
    title: "Pazartesi Motivasyonu",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
    category: "Motivasyon",
    content: {
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1200&fit=crop",
      text: "\"Disiplin, motivasyonun bittiği yerde başlar.\" Bu hafta da hedeflerine odaklan! 🔥"
    },
    createdAt: "2026-01-20T07:00:00Z"
  },
  {
    id: "9",
    title: "Günlük Hatırlatma",
    thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=100&h=100&fit=crop",
    category: "Motivasyon",
    content: {
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=1200&fit=crop",
      text: "Bugün antrenman yapmasan bile, beslenme ve uyku kaliteni koru. Toparlanma da antrenman kadar önemli!"
    },
    createdAt: "2026-01-19T18:00:00Z"
  },
];

// ============================================
// BLOODWORK TRENDS & BIOMARKERS
// ============================================

export interface BloodworkEntry {
  month: string;
  testosterone: number;
  cortisol: number;
  ratio: number;
}

export const bloodworkTrends: BloodworkEntry[] = [
  { month: "Eki 2025", testosterone: 580, cortisol: 18, ratio: 32.2 },
  { month: "Kas 2025", testosterone: 610, cortisol: 16, ratio: 38.1 },
  { month: "Ara 2025", testosterone: 595, cortisol: 17, ratio: 35.0 },
  { month: "Oca 2026", testosterone: 640, cortisol: 15, ratio: 42.7 },
];

export interface FlaggedBiomarker {
  name: string;
  value: number;
  unit: string;
  normalRange: string;
  severity: "critical" | "borderline";
}

export const flaggedBiomarkers: Record<string, FlaggedBiomarker[]> = {
  "bw-1": [
    { name: "Vitamin D", value: 12, unit: "ng/mL", normalRange: "30-100", severity: "critical" },
    { name: "Ferritin", value: 28, unit: "ng/mL", normalRange: "30-400", severity: "borderline" },
  ],
  "bw-2": [],
};

// ============================================
// WEARABLE DEVICE METRICS
// ============================================

export interface DailyMetricEntry {
  day: string;
  value: number;
}

export const rhrTrend: DailyMetricEntry[] = [
  { day: "Pzt", value: 62 },
  { day: "Sal", value: 60 },
  { day: "Çar", value: 59 },
  { day: "Per", value: 61 },
  { day: "Cum", value: 58 },
  { day: "Cmt", value: 57 },
  { day: "Paz", value: 58 },
];

export const hrvTrend: DailyMetricEntry[] = [
  { day: "Pzt", value: 35 },
  { day: "Sal", value: 38 },
  { day: "Çar", value: 40 },
  { day: "Per", value: 37 },
  { day: "Cum", value: 42 },
  { day: "Cmt", value: 45 },
  { day: "Paz", value: 42 },
];

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

// Current User Data
export const currentUser = {
  id: "user-1",
  name: "Ahmet Yılmaz",
  email: "ahmet@example.com",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  memberSince: "2025-06-15",
  level: 12,
  bioCoins: 2450,
  readinessScore: 85,
  streak: 14,
};

// ============================================
// ASSIGNED SUPPLEMENTS DATA
// ============================================

export interface SupplementData {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  servingsLeft: number;
  totalServings: number;
  takenToday: boolean;
  icon: string;
}

export const assignedSupplements: SupplementData[] = [
  {
    id: "sup-1",
    name: "Kreatin Monohidrat",
    dosage: "5g",
    timing: "Antrenman Sonrası",
    servingsLeft: 12,
    totalServings: 30,
    takenToday: true,
    icon: "💪",
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
  },
];

// ============================================
// SHOP SUPPLEMENTS (for Mağaza > Supplementler tab)
// ============================================

export interface ShopSupplement {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  flavors: string[];
  servings: number;
  rating: number;
  reviews: number;
  category: "protein" | "amino" | "preworkout" | "creatine" | "vitamin" | "omega";
}

export const shopSupplements: ShopSupplement[] = [
  {
    id: "shop-sup-1",
    name: "Gold Standard Whey",
    brand: "Optimum Nutrition",
    price: 899,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
    flavors: ["Çikolata", "Vanilya", "Çilek"],
    servings: 30,
    rating: 4.8,
    reviews: 1247,
    category: "protein",
  },
  {
    id: "shop-sup-2",
    name: "BCAA Energy",
    brand: "EVL",
    price: 449,
    image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&h=400&fit=crop",
    flavors: ["Karpuz", "Mango", "Limonata"],
    servings: 30,
    rating: 4.6,
    reviews: 892,
    category: "amino",
  },
  {
    id: "shop-sup-3",
    name: "C4 Original",
    brand: "Cellucor",
    price: 549,
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop",
    flavors: ["Nar", "Limon", "Mavi Ahududu"],
    servings: 60,
    rating: 4.7,
    reviews: 2156,
    category: "preworkout",
  },
  {
    id: "shop-sup-4",
    name: "Kreatin Monohidrat",
    brand: "MyProtein",
    price: 299,
    image: "https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=400&h=400&fit=crop",
    flavors: ["Aromasız"],
    servings: 100,
    rating: 4.9,
    reviews: 3421,
    category: "creatine",
  },
  {
    id: "shop-sup-5",
    name: "Omega-3 Fish Oil",
    brand: "NOW Foods",
    price: 279,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    flavors: [],
    servings: 180,
    rating: 4.5,
    reviews: 756,
    category: "omega",
  },
  {
    id: "shop-sup-6",
    name: "Vitamin D3 5000IU",
    brand: "Nature Made",
    price: 189,
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=400&fit=crop",
    flavors: [],
    servings: 90,
    rating: 4.7,
    reviews: 1089,
    category: "vitamin",
  },
  {
    id: "shop-sup-7",
    name: "ISO100 Hydrolyzed",
    brand: "Dymatize",
    price: 1099,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop",
    flavors: ["Fudge Brownie", "Vanilya", "Cookies"],
    servings: 25,
    rating: 4.8,
    reviews: 2341,
    category: "protein",
  },
  {
    id: "shop-sup-8",
    name: "L-Glutamin",
    brand: "BioTechUSA",
    price: 349,
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=400&fit=crop",
    flavors: ["Aromasız"],
    servings: 60,
    rating: 4.4,
    reviews: 567,
    category: "amino",
  },
];

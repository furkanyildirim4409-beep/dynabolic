
# GOKALAF - Elite Athlete Mobile App (Türkçe)

## Vizyon
Elit sporcular için tasarlanmış fütüristik, bilim-kurgu temalı sağlık takip uygulaması. Karanlık, glassmorphic tasarım, neon vurgular, sürükleyici animasyonlar ve biyometrik giriş deneyimi.

---

## Faz 1: Temel & Giriş Deneyimi

### Tasarım Sistemi
- **Karanlık Tema:** Void siyah (#050505) arka plan, glassmorphic kart yüzeyleri `backdrop-filter: blur(16px)`
- **Tipografi:** Oswald (başlıklar, büyük harf, kalın), Inter (veri/gövde metni)
- **Vurgu Renkleri:** Neon Yeşil (#ccff00) CTA/aktif durumlar, Uyarı Kırmızısı (#ff3b30)
- **Animasyon:** Tüm sayfa geçişleri Framer Motion ile (yukarı kayma / solma)

### Uygulama Kabuğu
- Mobil-öncelikli düzen, maksimum 430px genişlik, masaüstünde ortalanmış
- Tüm ekranlar arası akıcı geçişler

### Yüksek Yoğunluklu Elit Dock (Alt Navigasyon)
- **Yapı (5 Sekme - Türkçe):**
    - **[Kokpit]** (Grid İkon) - Ana Sayfa & Enerji
    - **[Antrenman]** (Dumbbell İkon) - Vision AI Eğitim
    - **[Beslenme]** (Leaf İkon) - Nutri-Tarama
    - **[Akademi]** (Play İkon) - Medya Merkezi
    - **[Profil]** (User İkon) - 3D Avatar & Ayarlar
- **Görsel Stil (Premium Cam):**
    - Yoğun bulanıklık: `backdrop-blur-2xl`
    - Üst kenar gradyanı: `border-t border-white/10`
    - Yarı saydam siyah arka plan: `bg-black/60`
- **Etkileşim (Mikro-Animasyonlar):**
    - **Aktif Durum:** İkon Neon Yeşil (#ccff00) ile dolar, altında yansıma/parıltı efekti
    - **Dokunma:** Yay/zıplama ölçek efekti (`scale: 0.9` -> `scale: 1.1`)

### Biyometrik Giriş Ekranı
- **Arka Plan:** Yavaşça dönen 3D tel kafes icosahedron (düşük opaklık)
- **Logo:** Merkezdeki büyük "GOKALAF" metni
- **Düğme:** "BİYO-KİMLİK TARA" neon parıltılı buton
- **Tarama Animasyonu:**
    - Yeşil ızgara çizgileri ekranda aşağı tarama
    - Metin: "SPORCU TANIMLANIYOR..." -> "ERİŞİM ONAYLANDI"
    - Bilim-kurgu ses efektleri
    - Kokpit'e akıcı geçiş

---

## Faz 2: Kokpit & Ana Ekranlar

### Kokpit (Ana Sayfa)
- **Toparlanma Skoru Widget'ı:** HRV verileriyle büyük dairesel gösterge
- **Günlük Yük Kartı:** Bugünün yükü, antrenman hacmi, kalori
- **Uyku & Hazırlık:** Uyku kalitesi skoru, hazırlık göstergesi
- **Vücut Kompozisyonu:** Kilo trendleri, yağ oranı, kas kütlesi önizleme

### Antrenman Ekranı
- Vision AI Eğitim arayüzü

### Beslenme Ekranı
- Nutri-Tarama öğün kaydı ve makro takibi

### Akademi Ekranı
- Eğitim videoları ve içerik merkezi

### Profil Ekranı
- 3D Avatar görselleştirme ve detaylı vücut verileri

---

## Türkçe Çeviri Referansı
| İngilizce | Türkçe |
|-----------|--------|
| Dashboard | Kokpit |
| Workout | Antrenman |
| Nutrition | Beslenme |
| Academy | Akademi |
| Profile/Body | Profil |
| Recovery | Toparlanma |
| Strain | Yük |
| Sleep | Uyku |
| Readiness | Hazırlık |
| Scan Bio-ID | BİYO-KİMLİK TARA |
| Identifying Athlete | SPORCU TANIMLANIYOR |
| Access Granted | ERİŞİM ONAYLANDI |
| Heart Rate | Kalp Atış Hızı |
| Calories | Kalori |
| Today | Bugün |
| Weekly | Haftalık |

---

## Teknoloji Yığını
- React + TypeScript
- Tailwind CSS (özel karanlık tema)
- Framer Motion (tüm animasyonlar, yay fiziği dahil)
- React Three Fiber (3D icosahedron)
- Lucide React (ikonlar)
- Web Audio API (bilim-kurgu ses efektleri)

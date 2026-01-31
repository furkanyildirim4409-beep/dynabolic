// Mevcut importların yanına useEffect dependency için ekleme yapıyoruz
import { useState, useEffect, useRef, useCallback } from "react";
// ... diğer importlar aynı

const StoryViewer = () => {
  const {
    isOpen,
    stories,
    initialIndex,
    categoryLabel,
    categoryIcon,
    categoryGradient,
    closeStories,
    onComplete, // Context'ten onComplete'i al
  } = useStory();

  // ... state tanımları aynı

  // Go to next story fonksiyonunu güncelle
  const goNext = useCallback(() => {
    clearTimer();
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
      progressRef.current = 0;
    } else {
      // SON STORY BİTTİ
      if (onComplete) {
        // Eğer sırada başka kategori varsa onu çalıştır (Kapatmadan geçiş yap)
        onComplete();
      } else {
        // Yoksa kapat
        closeStories();
      }
    }
  }, [currentIndex, stories.length, closeStories, clearTimer, onComplete]);

  // ... goPrev ve startTimer aynı

  // Reset state effect'ini güncelle (stories değişince de tetiklensin)
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setProgress(0);
      progressRef.current = 0;
      setIsPaused(false);
      setReplyText("");
      setIsInputFocused(false);
    }
  }, [isOpen, initialIndex, stories]); // "stories" eklendi! Bu çok önemli.

  // ... Geri kalan kodlar aynı (handleTap, render kısmı vs.)
  // (Burada tüm dosyayı tekrar yazmıyorum, sadece goNext ve useEffect'i güncellemen yeterli)
  // Ama emin olmak istersen dosyanın tamamını context'teki onComplete'i kullanacak şekilde güncelle.
  
  // ...
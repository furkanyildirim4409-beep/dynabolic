// Haptic feedback utilities using Vibration API

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'celebration';

const patterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 20], // short-pause-short
  warning: [30, 30, 30], // three pulses
  error: [50, 100, 50, 100, 50], // long error pattern
  celebration: [10, 30, 10, 30, 50, 50, 100], // escalating celebration
};

export const haptic = (type: HapticPattern = 'light'): void => {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate(patterns[type]);
    }
  } catch (e) {
    // Vibration not supported or blocked
  }
};

// Convenience exports
export const hapticLight = () => haptic('light');
export const hapticMedium = () => haptic('medium');
export const hapticHeavy = () => haptic('heavy');
export const hapticSuccess = () => haptic('success');
export const hapticWarning = () => haptic('warning');
export const hapticError = () => haptic('error');
export const hapticCelebration = () => haptic('celebration');

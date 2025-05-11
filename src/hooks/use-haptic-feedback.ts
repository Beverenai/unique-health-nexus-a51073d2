
import { useState, useEffect } from 'react';

// Vibration patterns (in milliseconds)
export const HAPTIC_PATTERNS = {
  light: 10,
  medium: 25,
  heavy: 40,
  success: [10, 30, 60],
  error: [60, 50, 60],
  warning: [30, 40, 30],
  selection: 15,
  impact: 20
};

export type HapticPattern = keyof typeof HAPTIC_PATTERNS;

/**
 * Hook for providing haptic feedback on mobile devices
 */
export function useHapticFeedback() {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  
  // Check for stored preference on mount
  useEffect(() => {
    const storedPreference = localStorage.getItem('hapticFeedbackEnabled');
    if (storedPreference !== null) {
      setIsEnabled(storedPreference === 'true');
    }
  }, []);
  
  // Function to toggle haptic feedback
  const toggleHapticFeedback = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    localStorage.setItem('hapticFeedbackEnabled', String(newValue));
    // Provide feedback when turning on (but not when turning off)
    if (newValue) {
      trigger('success');
    }
  };
  
  // Function to trigger haptic feedback
  const trigger = (pattern: HapticPattern = 'light') => {
    if (!isEnabled) return;
    
    try {
      if ('vibrate' in navigator) {
        const vibrationPattern = HAPTIC_PATTERNS[pattern];
        navigator.vibrate(vibrationPattern);
      }
    } catch (error) {
      console.log('Haptic feedback not supported or permission denied');
    }
  };
  
  return {
    trigger,
    isEnabled,
    toggleHapticFeedback
  };
}

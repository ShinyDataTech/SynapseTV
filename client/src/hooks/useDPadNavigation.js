import { useState, useEffect, useCallback } from 'react';

/**
 * Spatial Navigation hook for Fire TV Remote Controls (D-Pad & Action buttons).
 * Supports standard browser keyboard keys and Fire OS Android Leanback KeyCodes.
 */
export function useDPadNavigation({
  activeZone = 'main',
  zones = {},
  onSelect,
  onBack,
  onPlayPause,
  onVoiceTrigger
}) {
  const [currentFocus, setCurrentFocus] = useState(0);

  const handleKeyDown = useCallback((e) => {
    const key = e.key;
    const keyCode = e.keyCode || e.which;

    // Fire OS & Android TV KeyCode mappings
    const isUp = key === 'ArrowUp' || keyCode === 19 || keyCode === 38;
    const isDown = key === 'ArrowDown' || keyCode === 20 || keyCode === 40;
    const isLeft = key === 'ArrowLeft' || keyCode === 21 || keyCode === 37;
    const isRight = key === 'ArrowRight' || keyCode === 22 || keyCode === 39;
    const isSelect = key === 'Enter' || keyCode === 13 || keyCode === 23 || keyCode === 66;
    const isBack = key === 'Escape' || key === 'Backspace' || keyCode === 27 || keyCode === 4;
    const isPlayPause = key === ' ' || keyCode === 179 || keyCode === 415 || keyCode === 80;
    const isVoice = key === 'v' || key === 'V' || keyCode === 86;

    const currentCount = zones[activeZone] || 0;
    if (currentCount <= 0 && !isVoice && !isBack && !isPlayPause) return;

    if (isRight) {
      e.preventDefault();
      setCurrentFocus((prev) => (prev + 1) % currentCount);
    } else if (isLeft) {
      e.preventDefault();
      setCurrentFocus((prev) => (prev - 1 + currentCount) % currentCount);
    } else if (isDown) {
      e.preventDefault();
      setCurrentFocus((prev) => Math.min(prev + 1, currentCount - 1));
    } else if (isUp) {
      e.preventDefault();
      setCurrentFocus((prev) => Math.max(prev - 1, 0));
    } else if (isSelect) {
      e.preventDefault();
      if (onSelect) onSelect(activeZone, currentFocus);
    } else if (isBack) {
      e.preventDefault();
      if (onBack) onBack();
    } else if (isPlayPause) {
      e.preventDefault();
      if (onPlayPause) onPlayPause();
    } else if (isVoice) {
      e.preventDefault();
      if (onVoiceTrigger) onVoiceTrigger();
    }
  }, [activeZone, zones, currentFocus, onSelect, onBack, onPlayPause, onVoiceTrigger]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const setManualFocus = (index) => {
    setCurrentFocus(index);
  };

  return {
    currentFocus,
    setManualFocus
  };
}

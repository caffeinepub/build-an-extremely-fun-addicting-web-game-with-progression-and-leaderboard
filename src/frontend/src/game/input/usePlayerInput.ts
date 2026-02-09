import { useEffect, useState, RefObject } from 'react';
import type { InputState } from '../gameTypes';
import { useSettings } from '../../settings/useSettings';

export function usePlayerInput(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  isActive: boolean
): { inputState: InputState } {
  const { settings } = useSettings();
  const [inputState, setInputState] = useState<InputState>({
    targetX: 0.5,
    targetY: 0.8,
    isActive: false,
  });

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setInputState({
        targetX: Math.max(0.05, Math.min(0.95, x)),
        targetY: Math.max(0.1, Math.min(0.95, y)),
        isActive: true,
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const moveAmount = 0.05;
      setInputState((prev) => {
        let newX = prev.targetX;
        let newY = prev.targetY;

        if (e.key === settings.keyBindings.left || e.key === 'ArrowLeft') {
          newX = Math.max(0.05, prev.targetX - moveAmount);
        } else if (e.key === settings.keyBindings.right || e.key === 'ArrowRight') {
          newX = Math.min(0.95, prev.targetX + moveAmount);
        } else if (e.key === settings.keyBindings.up || e.key === 'ArrowUp') {
          newY = Math.max(0.1, prev.targetY - moveAmount);
        } else if (e.key === settings.keyBindings.down || e.key === 'ArrowDown') {
          newY = Math.min(0.95, prev.targetY + moveAmount);
        }

        return { ...prev, targetX: newX, targetY: newY, isActive: true };
      });
    };

    canvas.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, canvasRef, settings.keyBindings]);

  return { inputState };
}

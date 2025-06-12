"use client";

import confetti from "canvas-confetti";
import { useEffect } from "react";

export function ConfettiSideCannons({ trigger }) {
  useEffect(() => {
    if (trigger) {
      const end = Date.now() + 3 * 1000; // 3 seconds
      const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

      const frame = () => {
        if (Date.now() > end) return;

        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.7 },
          colors: colors,
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.7 },
          colors: colors,
        });

        requestAnimationFrame(frame);
      };

      frame();
    }
  }, [trigger]);

  return null; // No UI needed, just the effect
}
"use client";

import { useEffect, useState } from "react";

interface XPFlyUpProps {
  xp: number;
  show: boolean;
  onComplete?: () => void;
}

export default function XPFlyUp({ xp, show, onComplete }: XPFlyUpProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none relative flex justify-center">
      <span className="animate-fly-up font-mono text-2xl font-bold text-success">
        +{xp} XP
      </span>
    </div>
  );
}

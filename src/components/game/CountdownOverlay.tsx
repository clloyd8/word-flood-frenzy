import { useState, useEffect } from "react";

interface CountdownOverlayProps {
  isActive: boolean;
  onComplete: () => void;
}

const CountdownOverlay = ({ isActive, onComplete }: CountdownOverlayProps) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (!isActive) {
      setCount(3);
      return;
    }

    if (count === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [isActive, count, onComplete]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-app-dark/70 rounded-xl backdrop-blur-sm">
      <div
        key={count}
        className="text-6xl font-bold text-white animate-scale-in"
      >
        {count > 0 ? count : "Go!"}
      </div>
    </div>
  );
};

export default CountdownOverlay;

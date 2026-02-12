import { cn } from "@/lib/utils";
import { useCallback } from "react";

interface GridCellProps {
  letter: string;
  isSelected: boolean;
  isInvalid?: boolean;
  onClick: () => void;
}

const GridCell = ({ letter, isSelected, isInvalid = false, onClick }: GridCellProps) => {
  const handleInteraction = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  }, [onClick]);

  return (
    <div
      className={cn(
        "font-sans w-full aspect-square flex items-center justify-center rounded-xl text-lg sm:text-2xl font-bold cursor-pointer transition-all duration-150 select-none active:scale-90 touch-manipulation",
        letter ? "animate-fade-in" : "",
        isInvalid
          ? "bg-destructive text-white shadow-lg scale-105 animate-shake"
          : isSelected
            ? "bg-app-accent text-white shadow-lg scale-105"
            : letter
              ? "bg-app-card text-app-dark shadow-sm border border-border hover:border-app-accent/40"
              : "bg-transparent",
      )}
      onClick={handleInteraction}
      onTouchEnd={handleInteraction}
      role="button"
      tabIndex={0}
    >
      {letter}
    </div>
  );
};

export default GridCell;

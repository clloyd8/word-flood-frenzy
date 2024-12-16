import { cn } from "@/lib/utils";
import { useCallback } from "react";

interface GridCellProps {
  letter: string;
  isSelected: boolean;
  onClick: () => void;
}

const GridCell = ({ letter, isSelected, onClick }: GridCellProps) => {
  const handleInteraction = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault(); // Prevent default to avoid double triggers
    onClick();
  }, [onClick]);

  return (
    <div
      className={cn(`
        w-12 h-12 flex items-center justify-center
        rounded-md text-xl font-bold cursor-pointer
        transition-all duration-200 select-none
        active:scale-95 touch-manipulation
        ${letter ? "animate-fade-in" : ""}
        ${isSelected ? "bg-coral text-white" : "bg-white text-water-dark"}
        ${letter ? "shadow-sm" : ""}
      `)}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      role="button"
      tabIndex={0}
    >
      {letter}
    </div>
  );
};

export default GridCell;
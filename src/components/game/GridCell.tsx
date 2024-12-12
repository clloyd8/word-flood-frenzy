import { cn } from "@/lib/utils";

interface GridCellProps {
  letter: string;
  isSelected: boolean;
  onClick: () => void;
}

const GridCell = ({ letter, isSelected, onClick }: GridCellProps) => {
  return (
    <div
      className={cn(`
        w-12 h-12 flex items-center justify-center
        rounded-md text-xl font-bold cursor-pointer
        transition-all duration-200
        ${letter ? "animate-fade-in" : ""}
        ${isSelected ? "bg-coral text-white" : "bg-white text-water-dark"}
        ${letter ? "shadow-sm" : ""}
      `)}
      onClick={onClick}
    >
      {letter}
    </div>
  );
};

export default GridCell;
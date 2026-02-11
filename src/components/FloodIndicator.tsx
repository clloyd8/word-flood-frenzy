import { Progress } from "@/components/ui/progress";

interface FloodIndicatorProps {
  progress: number;
}

const FloodIndicator = ({ progress }: FloodIndicatorProps) => {
  const getColor = () => {
    if (progress < 40) return "bg-app-green";
    if (progress < 70) return "bg-app-orange";
    return "bg-coral";
  };

  return (
    <div className="w-full bg-app-card backdrop-blur-md rounded-2xl p-3 shadow-md">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Flood Level</span>
        <span className="text-xs font-bold text-foreground">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-500 rounded-full`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default FloodIndicator;

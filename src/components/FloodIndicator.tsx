
import { Progress } from "@/components/ui/progress";

interface FloodIndicatorProps {
  progress: number;
}

const FloodIndicator = ({ progress }: FloodIndicatorProps) => {
  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <Progress value={progress} className="h-2 bg-water-light">
        <div
          className="h-full bg-water-dark transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </Progress>
      <p className="text-sm text-gray-600 mt-1">Flood Progress</p>
      
      <div className="mt-4 text-center">
        <a
          href="https://coff.ee/nocodecharlie"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-coral text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
        >
          Buy Me A Coffee To Help Support This Project ☕️
        </a>
      </div>
    </div>
  );
};

export default FloodIndicator;

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import ShareScore from "./ShareScore";

interface GameOverControlsProps {
  score: number;
  words: string[];
  onStartOver: () => void;
  onShowAuth: () => void;
  isAuthenticated: boolean;
}

const GameOverControls = ({
  score,
  words,
  onStartOver,
  onShowAuth,
  isAuthenticated,
}: GameOverControlsProps) => {
  return (
    <div className="w-full max-w-md mx-auto mt-8 bg-white p-16 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-water-dark mb-4">Game Over!</h2>
      <p className="text-lg mb-6">Final Score: {score}</p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
        <Button
          onClick={onStartOver}
          className="w-full sm:w-auto bg-coral text-white hover:bg-opacity-90"
        >
          Play Again
        </Button>
        <ShareScore score={score} words={words} />
        {!isAuthenticated && score > 0 && (
          <Button
            onClick={onShowAuth}
            variant="outline"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Sign in to save score
          </Button>
        )}
      </div>
    </div>
  );
};

export default GameOverControls;
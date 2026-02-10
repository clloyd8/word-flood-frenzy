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
    <div className="bg-app-card rounded-2xl shadow-md p-6 text-center">
      <h2 className="text-2xl font-bold text-app-dark mb-1">Game Over!</h2>
      <p className="text-4xl font-bold text-app-accent mb-4">{score}</p>
      <p className="text-sm text-muted-foreground mb-5">
        You found {words.length} word{words.length !== 1 ? "s" : ""}
      </p>
      <div className="flex flex-col gap-2">
        <Button
          onClick={onStartOver}
          className="w-full rounded-xl bg-app-accent text-white hover:bg-app-accent/90"
        >
          Play Again
        </Button>
        <ShareScore score={score} words={words} />
        {!isAuthenticated && score > 0 && (
          <Button
            onClick={onShowAuth}
            variant="outline"
            className="w-full rounded-xl flex items-center justify-center gap-2"
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

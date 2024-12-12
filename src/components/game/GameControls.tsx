import { Button } from "@/components/ui/button";
import { RefreshCw, LogIn } from "lucide-react";

interface GameControlsProps {
  onStartOver: () => void;
  onShowAuth: () => void;
  isAuthenticated: boolean;
  onSignOut: () => void;
}

const GameControls = ({ onStartOver, onShowAuth, isAuthenticated, onSignOut }: GameControlsProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={onStartOver}
        variant="outline"
        className="flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Start Over
      </Button>
      {!isAuthenticated ? (
        <Button
          onClick={onShowAuth}
          variant="outline"
          className="flex items-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          Sign In
        </Button>
      ) : (
        <Button
          onClick={onSignOut}
          variant="outline"
        >
          Sign Out
        </Button>
      )}
    </div>
  );
};

export default GameControls;
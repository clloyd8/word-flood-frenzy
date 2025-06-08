
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, LogIn, HelpCircle, Keyboard } from "lucide-react";
import RulesDialog from "./RulesDialog";
import { useState } from "react";

interface GameControlsProps {
  onStartOver: () => void;
  onShowAuth: () => void;
  isAuthenticated: boolean;
  onSignOut: () => void;
  keyboardMode?: boolean;
  onKeyboardModeChange?: (enabled: boolean) => void;
}

const GameControls = ({ 
  onStartOver, 
  onShowAuth, 
  isAuthenticated, 
  onSignOut,
  keyboardMode = false,
  onKeyboardModeChange
}: GameControlsProps) => {
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {onKeyboardModeChange && (
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4" />
          <span className="text-sm">Keyboard Mode</span>
          <Switch
            checked={keyboardMode}
            onCheckedChange={onKeyboardModeChange}
          />
        </div>
      )}
      <Button
        onClick={onStartOver}
        variant="outline"
        className="flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Start Over
      </Button>
      <Button
        onClick={() => setShowRules(true)}
        variant="outline"
        className="flex items-center gap-2"
      >
        <HelpCircle className="w-4 h-4" />
        How to Play
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
      <RulesDialog open={showRules} onOpenChange={setShowRules} />
    </div>
  );
};

export default GameControls;

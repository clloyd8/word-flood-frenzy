
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface KeyboardModeControlsProps {
  onSubmit: (word: string) => void;
  isValidating: boolean;
  gameOver: boolean;
}

const KeyboardModeControls = ({ onSubmit, isValidating, gameOver }: KeyboardModeControlsProps) => {
  const [typedWord, setTypedWord] = useState("");

  const handleSubmit = () => {
    if (typedWord.trim() && !isValidating && !gameOver) {
      onSubmit(typedWord.trim().toLowerCase());
      setTypedWord("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  // Clear input when game resets
  useEffect(() => {
    if (gameOver) {
      setTypedWord("");
    }
  }, [gameOver]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2 w-full max-w-sm">
        <Input
          type="text"
          value={typedWord}
          onChange={(e) => setTypedWord(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a word and press Enter"
          className="text-lg"
          disabled={isValidating || gameOver}
          autoFocus
        />
        <Button 
          onClick={handleSubmit}
          className="bg-coral text-white hover:bg-coral/90"
          disabled={!typedWord.trim() || isValidating || gameOver}
        >
          {isValidating ? "Checking..." : "Submit"}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Type words using letters from the grid above
      </p>
    </div>
  );
};

export default KeyboardModeControls;

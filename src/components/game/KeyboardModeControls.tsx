
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface KeyboardModeControlsProps {
  onSubmit: (word: string) => void;
  isValidating: boolean;
  gameOver: boolean;
}

const KeyboardModeControls = ({ onSubmit, isValidating, gameOver }: KeyboardModeControlsProps) => {
  const [typedWord, setTypedWord] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (typedWord.trim() && !isValidating && !gameOver) {
      onSubmit(typedWord.trim().toLowerCase());
      setTypedWord("");
      // Refocus the input after submission
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  // Clear input when game resets and maintain focus
  useEffect(() => {
    if (gameOver) {
      setTypedWord("");
    } else {
      // Focus the input when component mounts or game resets
      inputRef.current?.focus();
    }
  }, [gameOver]);

  // Ensure input stays focused when not disabled
  useEffect(() => {
    if (!isValidating && !gameOver) {
      inputRef.current?.focus();
    }
  }, [isValidating]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2 w-full max-w-sm">
        <Input
          ref={inputRef}
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

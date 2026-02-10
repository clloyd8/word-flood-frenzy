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
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  useEffect(() => {
    if (gameOver) setTypedWord("");
    else inputRef.current?.focus();
  }, [gameOver]);

  useEffect(() => {
    if (!isValidating && !gameOver) inputRef.current?.focus();
  }, [isValidating]);

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex gap-2 w-full">
        <Input
          ref={inputRef}
          type="text"
          value={typedWord}
          onChange={(e) => setTypedWord(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a word..."
          className="text-lg rounded-xl"
          disabled={isValidating || gameOver}
          autoFocus
        />
        <Button
          onClick={handleSubmit}
          className="rounded-xl bg-app-accent text-white hover:bg-app-accent/90"
          disabled={!typedWord.trim() || isValidating || gameOver}
        >
          {isValidating ? "..." : "Submit"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Type words using letters from the grid
      </p>
    </div>
  );
};

export default KeyboardModeControls;

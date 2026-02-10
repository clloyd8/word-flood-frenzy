import { Button } from "@/components/ui/button";

interface WordControlsProps {
  currentWord: string;
  onClear: () => void;
  onSubmit: () => void;
  isValidating: boolean;
}

const WordControls = ({ currentWord, onClear, onSubmit, isValidating }: WordControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="min-h-[3rem] px-5 py-2.5 bg-muted rounded-xl text-xl font-bold text-foreground font-sans w-full text-center">
        {currentWord || <span className="text-muted-foreground font-normal text-base">Tap letters to form a word</span>}
      </div>
      <div className="flex gap-2 w-full">
        <Button
          onClick={onClear}
          variant="outline"
          className="flex-1 rounded-xl"
        >
          Clear
        </Button>
        <Button
          onClick={onSubmit}
          className="flex-1 rounded-xl bg-app-accent hover:bg-app-accent/90 text-white"
          disabled={currentWord.length < 3 || isValidating}
        >
          {isValidating ? "Checking..." : "Submit Word"}
        </Button>
      </div>
    </div>
  );
};

export default WordControls;

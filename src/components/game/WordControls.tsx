import { Button } from "@/components/ui/button";

interface WordControlsProps {
  currentWord: string;
  onClear: () => void;
  onSubmit: () => void;
  isValidating: boolean;
}

const WordControls = ({ 
  currentWord, 
  onClear, 
  onSubmit, 
  isValidating 
}: WordControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="min-h-[3rem] px-4 py-2 bg-white rounded-lg shadow-sm text-xl font-bold text-water-dark">
        {currentWord || "Tap letters to form a word"}
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={onClear}
          variant="outline"
          className="bg-white text-water-dark"
        >
          Clear
        </Button>
        <Button 
          onClick={onSubmit}
          className="bg-coral text-white hover:bg-coral/90"
          disabled={currentWord.length < 3 || isValidating}
        >
          {isValidating ? "Checking..." : "Submit Word"}
        </Button>
      </div>
    </div>
  );
};

export default WordControls;
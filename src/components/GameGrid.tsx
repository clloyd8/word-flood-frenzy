import { useGameState } from "@/hooks/useGameState";
import { isValidWord } from "@/utils/wordUtils";
import GridCell from "./game/GridCell";
import WordControls from "./game/WordControls";
import FloodOverlay from "./FloodOverlay";

interface GameGridProps {
  onWordFound: (word: string) => void;
  floodLevel: number;
  resetTrigger: number;
  isPaused?: boolean;
}

const GameGrid = ({ onWordFound, floodLevel, resetTrigger, isPaused = false }: GameGridProps) => {
  const {
    grid, setGrid, currentWord, setCurrentWord,
    selectedCells, setSelectedCells, hasTriggeredGameOver,
    isValidating, setIsValidating, toast
  } = useGameState(onWordFound, resetTrigger, isPaused);

  const handleCellClick = (row: number, col: number) => {
    if (!grid[row][col]) return;
    const cellIndex = selectedCells.findIndex(
      cell => cell.row === row && cell.col === col
    );
    if (cellIndex !== -1) {
      const newSelectedCells = selectedCells.slice(0, cellIndex);
      setSelectedCells(newSelectedCells);
      setCurrentWord(prev => prev.slice(0, cellIndex));
    } else {
      setCurrentWord(prev => prev + grid[row][col]);
      setSelectedCells(prev => [...prev, { row, col }]);
    }
  };

  const validateAndRemoveLetters = async (word: string) => {
    if (word.length >= 3 && !isValidating && !hasTriggeredGameOver) {
      setIsValidating(true);
      const valid = await isValidWord(word);
      if (valid) {
        onWordFound(word);
        setGrid(currentGrid => {
          const newGrid = currentGrid.map(row => [...row]);
          selectedCells.forEach(({ row, col }) => {
            newGrid[row][col] = "";
          });
          return newGrid;
        });
      } else {
        const { dismiss } = toast({
          title: "Invalid Word",
          description: `"${word}" is not a valid word. Try again!`,
          variant: "destructive",
        });
        setTimeout(() => dismiss(), 1000);
      }
      setIsValidating(false);
    } else if (hasTriggeredGameOver) {
      toast({
        title: "Game Over",
        description: "The board is full! Start a new game to continue playing.",
        variant: "destructive",
      });
    }
    setCurrentWord("");
    setSelectedCells([]);
  };

  const handleSubmit = async () => {
    await validateAndRemoveLetters(currentWord);
  };

  const handleClear = () => {
    setCurrentWord("");
    setSelectedCells([]);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="grid grid-cols-6 gap-1.5 bg-muted/50 p-2.5 rounded-xl relative w-full">
        <FloodOverlay isVisible={hasTriggeredGameOver} />
        {grid.map((row, rowIndex) => (
          row.map((letter, colIndex) => {
            const isSelected = selectedCells.some(
              (pos) => pos.row === rowIndex && pos.col === colIndex
            );
            return (
              <GridCell
                key={`${rowIndex}-${colIndex}`}
                letter={letter}
                isSelected={isSelected}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              />
            );
          })
        ))}
      </div>

      <WordControls
        currentWord={currentWord}
        onClear={handleClear}
        onSubmit={handleSubmit}
        isValidating={isValidating}
      />
    </div>
  );
};

export default GameGrid;

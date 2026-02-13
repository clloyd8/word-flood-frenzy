import { useState, useEffect } from "react";
import { useGameState } from "@/hooks/useGameState";
import { isValidWord } from "@/utils/wordUtils";
import GridCell from "./game/GridCell";
import WordControls from "./game/WordControls";
import FloodOverlay from "./FloodOverlay";
import CountdownOverlay from "./game/CountdownOverlay";

interface GameGridProps {
  onWordFound: (word: string) => void;
  floodLevel: number;
  resetTrigger: number;
  isPaused?: boolean;
  showCountdown?: boolean;
  onCountdownComplete?: () => void;
  gameStarted?: boolean;
  onStartGame?: () => void;
}

const GameGrid = ({ onWordFound, floodLevel, resetTrigger, isPaused = false, showCountdown = false, onCountdownComplete, gameStarted = true, onStartGame }: GameGridProps) => {
  const {
    grid, setGrid, currentWord, setCurrentWord,
    selectedCells, setSelectedCells, hasTriggeredGameOver,
    isValidating, setIsValidating, toast
  } = useGameState(onWordFound, resetTrigger, isPaused);

  const [invalidCells, setInvalidCells] = useState<{ row: number; col: number }[]>([]);
  const [isInvalid, setIsInvalid] = useState(false);

  // Reset invalid state when resetTrigger changes
  useEffect(() => {
    setInvalidCells([]);
    setIsInvalid(false);
  }, [resetTrigger]);

  const handleCellClick = (row: number, col: number) => {
    if (!grid[row][col]) return;
    // Clear invalid state on new interaction
    if (isInvalid) {
      setIsInvalid(false);
      setInvalidCells([]);
    }
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
        setCurrentWord("");
        setSelectedCells([]);
      } else {
        // Show inline invalid feedback
        setInvalidCells([...selectedCells]);
        setIsInvalid(true);
        setTimeout(() => {
          setIsInvalid(false);
          setInvalidCells([]);
          setCurrentWord("");
          setSelectedCells([]);
        }, 800);
      }
      setIsValidating(false);
    } else if (hasTriggeredGameOver) {
      toast({
        title: "Game Over",
        description: "The board is full! Start a new game to continue playing.",
        variant: "destructive",
      });
      setCurrentWord("");
      setSelectedCells([]);
    }
  };

  const handleSubmit = async () => {
    await validateAndRemoveLetters(currentWord);
  };

  const handleClear = () => {
    setCurrentWord("");
    setSelectedCells([]);
    setIsInvalid(false);
    setInvalidCells([]);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="grid grid-cols-6 gap-1.5 bg-muted/50 p-2.5 rounded-xl relative w-full">
        <FloodOverlay isVisible={hasTriggeredGameOver} />
        {!gameStarted && onStartGame && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-app-dark/70 rounded-xl backdrop-blur-sm">
            <button
              onClick={onStartGame}
              className="px-8 py-4 bg-app-accent hover:bg-app-accent/90 text-white text-xl font-bold rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Start Game
            </button>
          </div>
        )}
        {showCountdown && onCountdownComplete && (
          <CountdownOverlay isActive={showCountdown} onComplete={onCountdownComplete} />
        )}
        {grid.map((row, rowIndex) => (
          row.map((letter, colIndex) => {
            const isSelected = selectedCells.some(
              (pos) => pos.row === rowIndex && pos.col === colIndex
            );
            const isCellInvalid = invalidCells.some(
              (pos) => pos.row === rowIndex && pos.col === colIndex
            );
            return (
              <GridCell
                key={`${rowIndex}-${colIndex}`}
                letter={letter}
                isSelected={isSelected}
                isInvalid={isCellInvalid}
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
        isInvalid={isInvalid}
      />
    </div>
  );
};

export default GameGrid;

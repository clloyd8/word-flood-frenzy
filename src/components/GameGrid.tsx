
import { useGameState } from "@/hooks/useGameState";
import { isValidWord } from "@/utils/wordUtils";
import GridCell from "./game/GridCell";
import WordControls from "./game/WordControls";
import KeyboardModeControls from "./game/KeyboardModeControls";
import FloodOverlay from "./FloodOverlay";

interface GameGridProps {
  onWordFound: (word: string) => void;
  floodLevel: number;
  resetTrigger: number;
  keyboardMode?: boolean;
}

const GameGrid = ({ onWordFound, floodLevel, resetTrigger, keyboardMode = false }: GameGridProps) => {
  const {
    grid,
    setGrid,
    currentWord,
    setCurrentWord,
    selectedCells,
    setSelectedCells,
    hasTriggeredGameOver,
    isValidating,
    setIsValidating,
    toast
  } = useGameState(onWordFound, resetTrigger, keyboardMode);

  const handleCellClick = (row: number, col: number) => {
    if (!grid[row][col] || keyboardMode) return;
    
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
        
        if (keyboardMode) {
          // In keyboard mode, remove letters in order from grid
          const wordLetters = word.toUpperCase().split('');
          setGrid(currentGrid => {
            const newGrid = currentGrid.map(row => [...row]);
            
            for (const letter of wordLetters) {
              // Find and remove the first occurrence of each letter
              for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 6; j++) {
                  if (newGrid[i][j] === letter) {
                    newGrid[i][j] = "";
                    break;
                  }
                }
              }
            }
            
            return newGrid;
          });
        } else {
          // In normal mode, remove selected letters
          setGrid(currentGrid => {
            const newGrid = currentGrid.map(row => [...row]);
            selectedCells.forEach(({ row, col }) => {
              newGrid[row][col] = "";
            });
            return newGrid;
          });
        }
      } else {
        toast({
          title: "Invalid Word",
          description: `"${word}" is not a valid word. Try again!`,
          variant: "destructive",
        });
      }
      
      setIsValidating(false);
    } else if (hasTriggeredGameOver) {
      toast({
        title: "Game Over",
        description: "The board is full! Start a new game to continue playing.",
        variant: "destructive",
      });
    }
    
    if (!keyboardMode) {
      setCurrentWord("");
      setSelectedCells([]);
    }
  };

  const handleSubmit = async () => {
    await validateAndRemoveLetters(currentWord);
  };

  const handleKeyboardSubmit = async (word: string) => {
    // Check if all letters in the word exist in the grid
    const wordLetters = word.toUpperCase().split('');
    const gridLetters: string[] = [];
    
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell) gridLetters.push(cell);
      });
    });
    
    const hasAllLetters = wordLetters.every(letter => {
      const indexInGrid = gridLetters.indexOf(letter);
      if (indexInGrid !== -1) {
        gridLetters.splice(indexInGrid, 1); // Remove used letter
        return true;
      }
      return false;
    });
    
    if (!hasAllLetters) {
      toast({
        title: "Letters Not Available",
        description: "Some letters in your word are not available on the grid.",
        variant: "destructive",
      });
      return;
    }
    
    await validateAndRemoveLetters(word);
  };

  const handleClear = () => {
    setCurrentWord("");
    setSelectedCells([]);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-6 gap-1 bg-water-light p-2 rounded-lg relative">
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
                isSelected={isSelected && !keyboardMode}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              />
            );
          })
        ))}
      </div>

      {keyboardMode ? (
        <KeyboardModeControls
          onSubmit={handleKeyboardSubmit}
          isValidating={isValidating}
          gameOver={hasTriggeredGameOver}
        />
      ) : (
        <WordControls
          currentWord={currentWord}
          onClear={handleClear}
          onSubmit={handleSubmit}
          isValidating={isValidating}
        />
      )}
    </div>
  );
};

export default GameGrid;

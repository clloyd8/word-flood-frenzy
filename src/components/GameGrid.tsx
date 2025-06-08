
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
          // In keyboard mode, remove exact letters needed for the word
          const wordLetters = word.toUpperCase().split('');
          const letterCounts = wordLetters.reduce((acc, letter) => {
            acc[letter] = (acc[letter] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          setGrid(currentGrid => {
            const newGrid = currentGrid.map(row => [...row]);
            
            // Remove the exact number of each letter needed
            for (const [letter, count] of Object.entries(letterCounts)) {
              let removedCount = 0;
              
              for (let i = 0; i < 6 && removedCount < count; i++) {
                for (let j = 0; j < 6 && removedCount < count; j++) {
                  if (newGrid[i][j] === letter) {
                    newGrid[i][j] = "";
                    removedCount++;
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
    // Check if all letters in the word exist in the grid with proper quantities
    const wordLetters = word.toUpperCase().split('');
    const wordLetterCounts = wordLetters.reduce((acc, letter) => {
      acc[letter] = (acc[letter] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const gridLetterCounts: Record<string, number> = {};
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell) {
          gridLetterCounts[cell] = (gridLetterCounts[cell] || 0) + 1;
        }
      });
    });
    
    // Check if grid has enough of each letter
    const hasAllLetters = Object.entries(wordLetterCounts).every(([letter, needed]) => {
      return (gridLetterCounts[letter] || 0) >= needed;
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

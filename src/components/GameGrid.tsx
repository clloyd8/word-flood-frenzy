import { useState, useEffect } from "react";
import { getRandomLetter } from "@/utils/wordUtils";
import { Button } from "@/components/ui/button";

interface GameGridProps {
  onWordFound: (word: string) => void;
  floodLevel: number;
  resetTrigger: number;
}

const GameGrid = ({ onWordFound, floodLevel, resetTrigger }: GameGridProps) => {
  const [grid, setGrid] = useState<string[][]>(() => 
    Array(6).fill(null).map(() => Array(6).fill(""))
  );
  const [currentWord, setCurrentWord] = useState<string>("");
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [lastAddTime, setLastAddTime] = useState(Date.now());

  // Reset the grid when resetTrigger changes
  useEffect(() => {
    setGrid(Array(6).fill(null).map(() => Array(6).fill("")));
    setCurrentWord("");
    setSelectedCells([]);
    setLastAddTime(Date.now());
  }, [resetTrigger]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastAddTime >= 1500) { // Changed to 1.5 seconds
        setGrid((currentGrid) => {
          const newGrid = currentGrid.map(row => [...row]);
          const emptySpots = [];
          
          // Find all empty spots
          for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
              if (!newGrid[i][j]) {
                emptySpots.push([i, j]);
              }
            }
          }

          // If there are empty spots, fill one randomly
          if (emptySpots.length > 0) {
            const [row, col] = emptySpots[Math.floor(Math.random() * emptySpots.length)];
            newGrid[row][col] = getRandomLetter();
            setLastAddTime(now);
          }

          return newGrid;
        });
      }
    }, 100); // Check more frequently for smooth timing

    return () => clearInterval(interval);
  }, [lastAddTime]);

  const handleCellClick = (row: number, col: number) => {
    if (!grid[row][col]) return;
    
    // Add letter to current word
    setCurrentWord(prev => prev + grid[row][col]);
    setSelectedCells(prev => [...prev, { row, col }]);
  };

  const handleSubmit = () => {
    if (currentWord.length >= 3) {
      onWordFound(currentWord);
      
      // Remove used letters if word is valid
      setGrid(currentGrid => {
        const newGrid = currentGrid.map(row => [...row]);
        selectedCells.forEach(({ row, col }) => {
          newGrid[row][col] = "";
        });
        return newGrid;
      });
    }
    
    // Reset current word and selections
    setCurrentWord("");
    setSelectedCells([]);
  };

  const handleClear = () => {
    setCurrentWord("");
    setSelectedCells([]);
  };

  // Check if grid is full and trigger game over
  useEffect(() => {
    const isGridFull = grid.every(row => row.every(cell => cell !== ""));
    if (isGridFull) {
      console.log("Game Over - Grid is full!");
      // Trigger game over in parent component
      const event = new CustomEvent('gameOver');
      window.dispatchEvent(event);
    }
  }, [grid]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-6 gap-1 bg-water-light p-2 rounded-lg">
        {grid.map((row, rowIndex) => (
          row.map((letter, colIndex) => {
            const isSelected = selectedCells.some(
              (pos) => pos.row === rowIndex && pos.col === colIndex
            );

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-12 h-12 flex items-center justify-center
                  rounded-md text-xl font-bold cursor-pointer
                  transition-all duration-200
                  ${letter ? "animate-fade-in" : ""}
                  ${isSelected ? "bg-coral text-white" : "bg-white text-water-dark"}
                  ${letter ? "shadow-sm" : ""}
                `}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {letter}
              </div>
            );
          })
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="min-h-[3rem] px-4 py-2 bg-white rounded-lg shadow-sm text-xl font-bold text-water-dark">
          {currentWord || "Tap letters to form a word"}
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleClear}
            variant="outline"
            className="bg-white text-water-dark"
          >
            Clear
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-coral text-white hover:bg-coral/90"
            disabled={currentWord.length < 3}
          >
            Submit Word
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameGrid;
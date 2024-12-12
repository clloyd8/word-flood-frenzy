import { useState, useEffect } from "react";
import { getRandomLetter, isValidWord } from "@/utils/wordUtils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  const [hasTriggeredGameOver, setHasTriggeredGameOver] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setGrid(Array(6).fill(null).map(() => Array(6).fill("")));
    setCurrentWord("");
    setSelectedCells([]);
    setLastAddTime(Date.now());
    setHasTriggeredGameOver(false);
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

  // Calculate board fullness percentage
  const calculateBoardFullness = () => {
    let filledCells = 0;
    const totalCells = 36; // 6x6 grid
    
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell !== "") {
          filledCells++;
        }
      });
    });
    
    return (filledCells / totalCells) * 100;
  };

  // Check if grid is full and trigger game over
  useEffect(() => {
    const isGridFull = grid.every(row => row.every(cell => cell !== ""));
    if (isGridFull && !hasTriggeredGameOver) {
      console.log("Game Over - Grid is full!");
      setHasTriggeredGameOver(true);
      // Trigger game over in parent component
      const event = new CustomEvent('gameOver', { 
        detail: { boardFullness: 100 } 
      });
      window.dispatchEvent(event);
    } else if (!hasTriggeredGameOver) {
      // Update flood progress based on board fullness
      const event = new CustomEvent('boardUpdate', { 
        detail: { boardFullness: calculateBoardFullness() } 
      });
      window.dispatchEvent(event);
    }
  }, [grid, hasTriggeredGameOver]);

  const handleCellClick = (row: number, col: number) => {
    if (!grid[row][col]) return;
    
    // Check if the cell is already selected
    const cellIndex = selectedCells.findIndex(
      cell => cell.row === row && cell.col === col
    );

    if (cellIndex !== -1) {
      // If cell is already selected, remove it and all subsequent selections
      const newSelectedCells = selectedCells.slice(0, cellIndex);
      setSelectedCells(newSelectedCells);
      setCurrentWord(prev => prev.slice(0, cellIndex));
    } else {
      setCurrentWord(prev => prev + grid[row][col]);
      setSelectedCells(prev => [...prev, { row, col }]);
    }
  };

  const handleSubmit = async () => {
    if (currentWord.length >= 3 && !isValidating && !hasTriggeredGameOver) {
      setIsValidating(true);
      const valid = await isValidWord(currentWord);
      
      if (valid) {
        onWordFound(currentWord);
        
        // Remove used letters if word is valid
        setGrid(currentGrid => {
          const newGrid = currentGrid.map(row => [...row]);
          selectedCells.forEach(({ row, col }) => {
            newGrid[row][col] = "";
          });
          return newGrid;
        });
      } else {
        toast({
          title: "Invalid Word",
          description: `"${currentWord}" is not a valid word. Try again!`,
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
    
    setCurrentWord("");
    setSelectedCells([]);
  };

  const handleClear = () => {
    setCurrentWord("");
    setSelectedCells([]);
  };

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
            disabled={currentWord.length < 3 || isValidating}
          >
            {isValidating ? "Checking..." : "Submit Word"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameGrid;

import { useState, useEffect } from "react";
import { getRandomLetter } from "@/utils/wordUtils";

interface GameGridProps {
  onWordFound: (word: string) => void;
  floodLevel: number;
  resetTrigger: number; // Add this prop to trigger resets
}

const GameGrid = ({ onWordFound, floodLevel, resetTrigger }: GameGridProps) => {
  const [grid, setGrid] = useState<string[][]>(() => 
    Array(6).fill(null).map(() => Array(6).fill(""))
  );
  const [selection, setSelection] = useState<{ row: number; col: number }[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [lastAddTime, setLastAddTime] = useState(Date.now());

  // Reset the grid when resetTrigger changes
  useEffect(() => {
    setGrid(Array(6).fill(null).map(() => Array(6).fill("")));
    setSelection([]);
    setIsSelecting(false);
    setLastAddTime(Date.now());
  }, [resetTrigger]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastAddTime >= 1000) { // Add letter every second
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

  const handleMouseDown = (row: number, col: number) => {
    if (grid[row][col]) {
      setIsSelecting(true);
      setSelection([{ row, col }]);
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isSelecting && grid[row][col]) {
      // Only add to selection if it's adjacent to the last selected cell
      const lastCell = selection[selection.length - 1];
      const isAdjacent = Math.abs(row - lastCell.row) <= 1 && 
                        Math.abs(col - lastCell.col) <= 1;
      
      if (isAdjacent && !selection.some(pos => pos.row === row && pos.col === col)) {
        setSelection(prev => [...prev, { row, col }]);
      }
    }
  };

  const handleMouseUp = () => {
    if (selection.length >= 3) {
      const word = selection
        .map(({ row, col }) => grid[row][col])
        .join("");
      
      onWordFound(word);
      
      // Remove used letters if word is valid
      setGrid(currentGrid => {
        const newGrid = currentGrid.map(row => [...row]);
        selection.forEach(({ row, col }) => {
          newGrid[row][col] = "";
        });
        return newGrid;
      });
    }
    setSelection([]);
    setIsSelecting(false);
  };

  const isGridFull = grid.every(row => row.every(cell => cell !== ""));

  useEffect(() => {
    if (isGridFull) {
      console.log("Game Over - Grid is full!");
    }
  }, [isGridFull]);

  return (
    <div 
      className="grid grid-cols-6 gap-1 bg-water-light p-2 rounded-lg"
      onMouseLeave={() => {
        setSelection([]);
        setIsSelecting(false);
      }}
    >
      {grid.map((row, rowIndex) => (
        row.map((letter, colIndex) => {
          const isSelected = selection.some(
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
              onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
              onMouseUp={handleMouseUp}
            >
              {letter}
            </div>
          );
        })
      ))}
    </div>
  );
};

export default GameGrid;

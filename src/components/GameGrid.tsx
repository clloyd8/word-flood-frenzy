import { useState, useEffect } from "react";
import { getRandomLetter } from "@/utils/wordUtils";

interface GameGridProps {
  onWordFound: (word: string) => void;
  floodLevel: number;
}

const GameGrid = ({ onWordFound, floodLevel }: GameGridProps) => {
  const [grid, setGrid] = useState<string[][]>(Array(6).fill(Array(6).fill("")));
  const [selection, setSelection] = useState<{ row: number; col: number }[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGrid((currentGrid) => {
        const newGrid = currentGrid.map((row) => [...row]);
        const emptySpots = [];
        
        for (let i = 0; i < 6; i++) {
          for (let j = 0; j < 6; j++) {
            if (!newGrid[i][j]) {
              emptySpots.push([i, j]);
            }
          }
        }

        if (emptySpots.length > 0) {
          const [row, col] = emptySpots[Math.floor(Math.random() * emptySpots.length)];
          newGrid[row] = [...newGrid[row]];
          newGrid[row][col] = getRandomLetter();
        }

        return newGrid;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (row: number, col: number) => {
    if (grid[row][col]) {
      setIsSelecting(true);
      setSelection([{ row, col }]);
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isSelecting && grid[row][col]) {
      setSelection((prev) => [...prev, { row, col }]);
    }
  };

  const handleMouseUp = () => {
    if (selection.length > 2) {
      const word = selection
        .map(({ row, col }) => grid[row][col])
        .join("");
      onWordFound(word);
    }
    setSelection([]);
    setIsSelecting(false);
  };

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
                ${letter ? "animate-letter-appear" : ""}
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
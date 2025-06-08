
import { useState, useEffect } from "react";
import { getRandomLetter, isValidWord } from "@/utils/wordUtils";
import { useToast } from "@/hooks/use-toast";

export const useGameState = (onWordFound: (word: string) => void, resetTrigger: number, keyboardMode: boolean = false) => {
  const [grid, setGrid] = useState<string[][]>(() => 
    Array(6).fill(null).map(() => Array(6).fill(""))
  );
  const [currentWord, setCurrentWord] = useState<string>("");
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [lastAddTime, setLastAddTime] = useState(Date.now());
  const [hasTriggeredGameOver, setHasTriggeredGameOver] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  // Faster letter spawn rate for keyboard mode
  const letterSpawnInterval = keyboardMode ? 800 : 1250; // 800ms for keyboard mode, 1250ms for normal mode

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
      if (now - lastAddTime >= letterSpawnInterval) {
        setGrid((currentGrid) => {
          const newGrid = currentGrid.map(row => [...row]);
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
            newGrid[row][col] = getRandomLetter();
            setLastAddTime(now);
          }

          return newGrid;
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [lastAddTime, letterSpawnInterval]);

  const calculateBoardFullness = () => {
    let filledCells = 0;
    const totalCells = 36;
    
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell !== "") {
          filledCells++;
        }
      });
    });
    
    return (filledCells / totalCells) * 100;
  };

  useEffect(() => {
    const isGridFull = grid.every(row => row.every(cell => cell !== ""));
    if (isGridFull && !hasTriggeredGameOver) {
      console.log("Game Over - Grid is full!");
      setHasTriggeredGameOver(true);
      const event = new CustomEvent('gameOver', { 
        detail: { boardFullness: 100 } 
      });
      window.dispatchEvent(event);
    } else if (!hasTriggeredGameOver) {
      const event = new CustomEvent('boardUpdate', { 
        detail: { boardFullness: calculateBoardFullness() } 
      });
      window.dispatchEvent(event);
    }
  }, [grid, hasTriggeredGameOver]);

  return {
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
  };
};

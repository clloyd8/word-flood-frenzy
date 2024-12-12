import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import GameGrid from "@/components/GameGrid";
import ScoreBoard from "@/components/ScoreBoard";
import FloodIndicator from "@/components/FloodIndicator";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const Index = () => {
  const [score, setScore] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [floodLevel, setFloodLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const { toast } = useToast();

  // Listen for game over event from GameGrid
  useEffect(() => {
    const handleGameOver = () => {
      setGameOver(true);
      toast({
        title: "Game Over!",
        description: `Final Score: ${score} - Words Found: ${words.length}`,
        duration: 5000,
      });
    };

    window.addEventListener('gameOver', handleGameOver);
    return () => window.removeEventListener('gameOver', handleGameOver);
  }, [score, words.length, toast]);

  const handleWordFound = useCallback((word: string) => {
    if (!words.includes(word)) {
      const points = word.length * 10;
      setScore(current => current + points);
      setWords(current => [...current, word]);
      setFloodLevel(current => Math.max(0, current - word.length * 2));
      
      toast({
        title: "Word Found!",
        description: `${word} - +${points} points`,
        duration: 2000,
      });
    } else {
      toast({
        title: "Word Already Found",
        description: "Find a different word",
        variant: "destructive",
        duration: 2000,
      });
    }
  }, [words, toast]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setFloodLevel(current => {
        if (current >= 100) {
          setGameOver(true);
          clearInterval(interval);
          toast({
            title: "Game Over!",
            description: `Final Score: ${score} - Words Found: ${words.length}`,
            duration: 5000,
          });
          return current;
        }
        return current + 0.5;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver, score, words.length, toast]);

  const handleStartOver = () => {
    setScore(0);
    setWords([]);
    setFloodLevel(0);
    setGameOver(false);
    setResetTrigger(prev => prev + 1);
    toast({
      title: "New Game Started",
      description: "Good luck!",
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-water-light to-water-medium p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-water-dark">
            Word Flood
          </h1>
          <Button
            onClick={handleStartOver}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Start Over
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <GameGrid onWordFound={handleWordFound} floodLevel={floodLevel} resetTrigger={resetTrigger} />
            <FloodIndicator progress={floodLevel} />
          </div>
          
          <ScoreBoard score={score} words={words} />
        </div>

        {gameOver && (
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-water-dark mb-2">Game Over!</h2>
            <p className="text-lg">Final Score: {score}</p>
            <button
              onClick={handleStartOver}
              className="mt-4 px-6 py-2 bg-coral text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

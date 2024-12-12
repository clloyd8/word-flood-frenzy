import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import GameGrid from "@/components/GameGrid";
import ScoreBoard from "@/components/ScoreBoard";
import FloodIndicator from "@/components/FloodIndicator";
import { isValidWord } from "@/utils/wordUtils";

const Index = () => {
  const [score, setScore] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [floodLevel, setFloodLevel] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setFloodLevel((current) => {
        if (current >= 100) {
          clearInterval(interval);
          toast({
            title: "Game Over!",
            description: `Final Score: ${score}`,
          });
          return current;
        }
        return current + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [score]);

  const handleWordFound = (word: string) => {
    if (isValidWord(word) && !words.includes(word)) {
      setScore((current) => current + word.length);
      setWords((current) => [...current, word]);
      toast({
        title: "Word Found!",
        description: `+${word.length} points`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-water-light to-water-medium p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-water-dark text-center mb-8">
          Word Flood
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <GameGrid onWordFound={handleWordFound} floodLevel={floodLevel} />
            <FloodIndicator progress={floodLevel} />
          </div>
          
          <ScoreBoard score={score} words={words} />
        </div>
      </div>
    </div>
  );
};

export default Index;
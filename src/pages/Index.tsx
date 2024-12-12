import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import GameGrid from "@/components/GameGrid";
import ScoreBoard from "@/components/ScoreBoard";
import FloodIndicator from "@/components/FloodIndicator";
import Leaderboard from "@/components/Leaderboard";
import AuthModal from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trophy, LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const [score, setScore] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [floodLevel, setFloodLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Listen for game over and board update events from GameGrid
  useEffect(() => {
    const handleGameOver = (event: CustomEvent) => {
      setGameOver(true);
      setFloodLevel(100);
      toast({
        title: "Game Over!",
        description: `Final Score: ${score} - Words Found: ${words.length}`,
        duration: 5000,
      });
    };

    const handleBoardUpdate = (event: CustomEvent) => {
      setFloodLevel(event.detail.boardFullness);
    };

    window.addEventListener('gameOver', handleGameOver as EventListener);
    window.addEventListener('boardUpdate', handleBoardUpdate as EventListener);
    
    return () => {
      window.removeEventListener('gameOver', handleGameOver as EventListener);
      window.removeEventListener('boardUpdate', handleBoardUpdate as EventListener);
    };
  }, [score, words.length, toast]);

  const handleWordFound = useCallback((word: string) => {
    if (!words.includes(word) && !gameOver) {
      const points = word.length * 10;
      setScore(current => current + points);
      setWords(current => [...current, word]);
      
      toast({
        title: "Word Found!",
        description: `${word} - +${points} points`,
        duration: 2000,
      });
    } else if (gameOver) {
      toast({
        title: "Game Over",
        description: "The board is full! Start a new game to continue playing.",
        variant: "destructive",
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
  }, [words, gameOver, toast]);

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

  const handleGameOver = async () => {
    if (user && score > 0) {
      try {
        await supabase
          .from("scores")
          .insert([{ user_id: user.id, score }]);
        
        toast({
          title: "Score Saved!",
          description: "Your score has been added to the leaderboard.",
        });
      } catch (error) {
        console.error("Error saving score:", error);
      }
    }
  };

  useEffect(() => {
    if (gameOver) {
      handleGameOver();
    }
  }, [gameOver]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-water-light to-water-medium p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-water-dark">
            Word Flood
          </h1>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleStartOver}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Start Over
            </Button>
            {!user ? (
              <Button
                onClick={() => setShowAuthModal(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            ) : (
              <Button
                onClick={() => supabase.auth.signOut()}
                variant="outline"
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex flex-col items-center">
              <GameGrid 
                onWordFound={handleWordFound} 
                floodLevel={floodLevel} 
                resetTrigger={resetTrigger} 
              />
              <FloodIndicator progress={floodLevel} />
            </div>
          </div>
          
          <div className="space-y-8">
            <ScoreBoard score={score} words={words} />
            <Leaderboard />
          </div>
        </div>

        {gameOver && (
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-water-dark mb-2">Game Over!</h2>
            <p className="text-lg">Final Score: {score}</p>
            <Button
              onClick={handleStartOver}
              className="mt-4 bg-coral text-white hover:bg-opacity-90"
            >
              Play Again
            </Button>
          </div>
        )}

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    </div>
  );
};

export default Index;

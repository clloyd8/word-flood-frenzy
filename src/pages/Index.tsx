import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import GameGrid from "@/components/GameGrid";
import ScoreBoard from "@/components/ScoreBoard";
import FloodIndicator from "@/components/FloodIndicator";
import Leaderboard from "@/components/Leaderboard";
import AuthModal from "@/components/auth/AuthModal";
import AuthHandler from "@/components/auth/AuthHandler";
import GameControls from "@/components/game/GameControls";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const [score, setScore] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [floodLevel, setFloodLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [pendingScore, setPendingScore] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleStartOver = () => {
    console.log("Starting new game");
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

  useEffect(() => {
    const handleGameOver = async (event: CustomEvent) => {
      console.log("Game Over event received");
      setGameOver(true);
      setFloodLevel(100);
      
      if (user && score > 0) {
        await saveScore(score);
      } else if (!user && score > 0) {
        console.log("Setting pending score:", score);
        setPendingScore(score);
        toast({
          title: "Sign in to save score",
          description: "Create an account to compete on the leaderboard!",
          variant: "destructive",
        });
      }
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
  }, [score, user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-water-light to-water-medium p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-water-dark">
            Word Flood
          </h1>
          <GameControls 
            onStartOver={handleStartOver}
            onShowAuth={() => setShowAuthModal(true)}
            isAuthenticated={!!user}
            onSignOut={() => supabase.auth.signOut()}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex flex-col items-center">
              <GameGrid 
                onWordFound={word => {
                  const points = word.length * 10;
                  setScore(current => current + points);
                  setWords(current => [...current, word]);
                }} 
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
            <p className="text-lg mb-4">Final Score: {score}</p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleStartOver}
                className="bg-coral text-white hover:bg-opacity-90"
              >
                Play Again
              </Button>
              {!user && score > 0 && (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign in to save score
                </Button>
              )}
            </div>
          </div>
        )}

        <AuthHandler 
          onUserChange={setUser}
          pendingScore={pendingScore}
          onScoreSaved={() => setPendingScore(null)}
        />

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    </div>
  );
};

export default Index;
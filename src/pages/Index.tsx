import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import GameGrid from "@/components/GameGrid";
import ScoreBoard from "@/components/ScoreBoard";
import FloodIndicator from "@/components/FloodIndicator";
import Leaderboard from "@/components/Leaderboard";
import AuthModal from "@/components/auth/AuthModal";
import AuthHandler from "@/components/auth/AuthHandler";
import GameControls from "@/components/game/GameControls";
import GameOverControls from "@/components/game/GameOverControls";
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
  const [keyboardMode, setKeyboardMode] = useState(false);
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
      description: `${keyboardMode ? "Keyboard mode" : "Touch mode"} - Good luck!`,
      duration: 2000,
    });
  };

  const handleKeyboardModeChange = (enabled: boolean) => {
    setKeyboardMode(enabled);
    toast({
      title: enabled ? "Keyboard Mode Enabled" : "Touch Mode Enabled",
      description: enabled 
        ? "Letters spawn faster! Type words using your keyboard." 
        : "Letters spawn normally. Tap letters to select words.",
      duration: 3000,
    });
  };

  const saveScore = async (finalScore: number) => {
    console.log("Attempting to save score:", finalScore);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      
      if (session?.user?.id) {
        console.log("User is logged in, saving score to database");
        const { error } = await supabase
          .from('scores')
          .insert([
            { 
              user_id: session.user.id,
              score: finalScore 
            }
          ]);
          
        if (error) {
          console.error("Error saving score:", error);
          throw error;
        }
        
        console.log("Score saved successfully");
        // Invalidate and refetch leaderboard queries
        queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
        
        toast({
          title: "Score Saved!",
          description: `Your score of ${finalScore} has been saved to the leaderboard.`,
        });
      } else {
        console.log("User not logged in, setting pending score");
        setPendingScore(finalScore);
        toast({
          title: "Sign in to save score",
          description: "Create an account to compete on the leaderboard!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in saveScore:", error);
      toast({
        title: "Error Saving Score",
        description: "There was a problem saving your score. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const handleGameOver = async (event: CustomEvent) => {
      console.log("Game Over event received");
      setGameOver(true);
      setFloodLevel(100);
      
      if (score > 0) {
        console.log("Saving final score:", score);
        await saveScore(score);
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
  }, [score]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-water-light to-water-medium p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold text-water-dark order-1 sm:order-none">
            Word Flood
          </h1>
          <GameControls 
            onStartOver={handleStartOver}
            onShowAuth={() => setShowAuthModal(true)}
            isAuthenticated={!!user}
            onSignOut={() => supabase.auth.signOut()}
            keyboardMode={keyboardMode}
            onKeyboardModeChange={handleKeyboardModeChange}
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
                keyboardMode={keyboardMode}
              />
              <FloodIndicator progress={floodLevel} />
              {gameOver && (
                <GameOverControls
                  score={score}
                  words={words}
                  onStartOver={handleStartOver}
                  onShowAuth={() => setShowAuthModal(true)}
                  isAuthenticated={!!user}
                />
              )}
            </div>
          </div>
          
          <div className="space-y-8">
            <ScoreBoard score={score} words={words} />
            <Leaderboard />
          </div>
        </div>

        <footer className="mt-16 text-center text-water-dark">
          <div className="space-y-2">
            <p>
              <a 
                href="mailto:hello@peddlerdigital.com"
                className="hover:underline"
              >
                hello@peddlerdigital.com
              </a>
            </p>
            <p>
              © {new Date().getFullYear()} {" "}
              <a 
                href="https://www.peddlerdigital.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Peddler Digital
              </a>
            </p>
          </div>
        </footer>

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

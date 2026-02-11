import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import GameGrid from "@/components/GameGrid";
import ScoreBoard from "@/components/ScoreBoard";
import FloodIndicator from "@/components/FloodIndicator";
import Leaderboard from "@/components/Leaderboard";
import AuthModal from "@/components/auth/AuthModal";
import AuthHandler from "@/components/auth/AuthHandler";
import GameOverControls from "@/components/game/GameOverControls";
import CountdownOverlay from "@/components/game/CountdownOverlay";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, HelpCircle, LogIn, LogOut } from "lucide-react";
import RulesDialog from "@/components/game/RulesDialog";
import wordFloodLogo from "@/assets/WordFloodApp.png";

const Index = () => {
  const [score, setScore] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [floodLevel, setFloodLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [pendingScore, setPendingScore] = useState<number | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleStartOver = () => {
    setScore(0);
    setWords([]);
    setFloodLevel(0);
    setGameOver(false);
    setShowCountdown(true);
  };

  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
    setResetTrigger(prev => prev + 1);
  }, []);

  const saveScore = async (finalScore: number) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      if (session?.user?.id) {
        const { error } = await supabase.from('scores').insert([{
          user_id: session.user.id,
          score: finalScore
        }]);
        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
        toast({
          title: "Score Saved!",
          description: `Your score of ${finalScore} has been saved to the leaderboard.`
        });
      } else {
        setPendingScore(finalScore);
        toast({
          title: "Sign in to save score",
          description: "Create an account to compete on the leaderboard!",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in saveScore:", error);
      toast({
        title: "Error Saving Score",
        description: "There was a problem saving your score. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const handleGameOver = async (_event: CustomEvent) => {
      setGameOver(true);
      setFloodLevel(100);
      if (score > 0) await saveScore(score);
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
    <div className="min-h-screen bg-app-bg flex flex-col">
      {/* Main Content */}
      <main className="flex-1 px-4 py-4 max-w-lg mx-auto w-full space-y-4">
        <div className="bg-app-card rounded-2xl shadow-md p-3 relative space-y-3">
          {/* Stats row inside game card */}
          <div className="flex items-center justify-between px-1">
            <img src={wordFloodLogo} alt="Word Flood" className="h-10 w-10 rounded-lg" />
            <div className="flex items-center gap-3">
              <div className="text-center">
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider">Score</span>
                <div className="text-lg font-bold text-app-green leading-tight">{score}</div>
              </div>
              <div className="text-center">
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider">Words</span>
                <div className="text-lg font-bold text-foreground leading-tight">{words.length}</div>
              </div>
            </div>
          </div>

          <FloodIndicator progress={floodLevel} />
          <CountdownOverlay isActive={showCountdown} onComplete={handleCountdownComplete} />
          <GameGrid
            onWordFound={word => {
              const points = word.length * 10;
              setScore(current => current + points);
              setWords(current => [...current, word]);
            }}
            floodLevel={floodLevel}
            resetTrigger={resetTrigger}
            isPaused={showRules || showCountdown}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-around items-center bg-app-card rounded-2xl shadow-md px-4 py-3">
          <button onClick={handleStartOver} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-app-accent transition-colors">
            <RefreshCw className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-wider font-medium">New Game</span>
          </button>
          <button onClick={() => setShowRules(true)} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-app-accent transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-wider font-medium">Rules</span>
          </button>
          {!user ? (
            <button onClick={() => setShowAuthModal(true)} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-app-accent transition-colors">
              <LogIn className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-wider font-medium">Sign In</span>
            </button>
          ) : (
            <button onClick={() => supabase.auth.signOut()} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-app-accent transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-wider font-medium">Sign Out</span>
            </button>
          )}
        </div>

        {gameOver && (
          <GameOverControls
            score={score}
            words={words}
            onStartOver={handleStartOver}
            onShowAuth={() => setShowAuthModal(true)}
            isAuthenticated={!!user}
          />
        )}

        <ScoreBoard score={score} words={words} />
        <Leaderboard />
      </main>


      <RulesDialog open={showRules} onOpenChange={setShowRules} />
      <AuthHandler onUserChange={setUser} pendingScore={pendingScore} onScoreSaved={() => setPendingScore(null)} />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Index;

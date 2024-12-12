import { useEffect } from 'react';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthHandlerProps {
  onUserChange: (user: any) => void;
  pendingScore: number | null;
  onScoreSaved: () => void;
}

const AuthHandler = ({ onUserChange, pendingScore, onScoreSaved }: AuthHandlerProps) => {
  const { toast } = useToast();

  const saveScore = async (score: number) => {
    try {
      console.log("Saving score to database:", score);
      const session = await supabase.auth.getSession();
      const user = session.data.session?.user;
      
      if (!user) {
        console.error("No user found when trying to save score");
        return;
      }

      const { error } = await supabase
        .from("scores")
        .insert([{ user_id: user.id, score: score }]);
        
      if (error) {
        console.error("Error saving score:", error);
        throw error;
      }

      toast({
        title: "Score Saved!",
        description: "Your score has been added to the leaderboard.",
      });
    } catch (error) {
      console.error("Error saving score:", error);
      toast({
        title: "Error Saving Score",
        description: "There was a problem saving your score.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      console.log("Auth state changed:", event, session?.user);
      onUserChange(session?.user ?? null);

      if (event === 'SIGNED_IN' && pendingScore !== null) {
        console.log("Saving pending score after sign in:", pendingScore);
        saveScore(pendingScore);
        onScoreSaved();
      }
    });

    return () => subscription.unsubscribe();
  }, [pendingScore, onUserChange, onScoreSaved]);

  return null;
};

export default AuthHandler;
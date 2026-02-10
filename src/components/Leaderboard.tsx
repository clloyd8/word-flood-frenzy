import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

interface Score {
  id: number;
  score: number;
  user_id: string;
  created_at: string;
  profiles: {
    username: string;
  };
}

const Leaderboard = () => {
  const { data: allTimeScores, isLoading: loadingAllTime } = useQuery<Score[]>({
    queryKey: ["leaderboard", "all-time"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scores")
        .select(`id, score, user_id, created_at, profiles (username)`)
        .order("score", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data.map((item: any) => ({
        ...item,
        profiles: item.profiles || { username: 'Anonymous' }
      }));
    },
    refetchInterval: 30000,
    staleTime: 10000,
    retry: 2,
    retryDelay: 5000,
  });

  const { data: dailyScores, isLoading: loadingDaily } = useQuery<Score[]>({
    queryKey: ["leaderboard", "daily"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data, error } = await supabase
        .from("scores")
        .select(`id, score, user_id, created_at, profiles (username)`)
        .gte('created_at', today.toISOString())
        .order("score", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data.map((item: any) => ({
        ...item,
        profiles: item.profiles || { username: 'Anonymous' }
      }));
    },
    refetchInterval: 30000,
    staleTime: 10000,
    retry: 2,
    retryDelay: 5000,
  });

  const { data: personalBest, isLoading: loadingPersonal } = useQuery<Score[]>({
    queryKey: ["leaderboard", "personal"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];
      const { data, error } = await supabase
        .from("scores")
        .select(`id, score, user_id, created_at, profiles (username)`)
        .eq('user_id', session.user.id)
        .order("score", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data.map((item: any) => ({
        ...item,
        profiles: item.profiles || { username: 'Anonymous' }
      }));
    },
    refetchInterval: 30000,
    staleTime: 10000,
    retry: 2,
    retryDelay: 5000,
  });

  const renderScoreList = (scores: Score[] | undefined, isLoading: boolean) => {
    if (isLoading) return <div className="text-center py-4 text-muted-foreground text-sm">Loading...</div>;
    if (!scores || scores.length === 0) {
      return <div className="text-center text-muted-foreground py-4 text-sm">No scores yet</div>;
    }
    return scores.map((score, index) => (
      <div
        key={score.id}
        className="flex justify-between items-center px-3 py-2.5 rounded-xl bg-muted/50"
      >
        <div className="flex items-center gap-2.5">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            index === 0 ? "bg-app-accent text-white" :
            index === 1 ? "bg-app-orange text-white" :
            index === 2 ? "bg-app-green text-white" :
            "bg-muted text-muted-foreground"
          }`}>
            {index + 1}
          </span>
          <div>
            <span className="font-medium text-sm text-foreground">
              {score.profiles.username || 'Anonymous'}
            </span>
            <span className="text-xs text-muted-foreground ml-2">
              {format(new Date(score.created_at), 'MMM d')}
            </span>
          </div>
        </div>
        <span className="text-app-accent font-bold text-sm">{score.score}</span>
      </div>
    ));
  };

  return (
    <div className="bg-app-card rounded-2xl shadow-md p-4">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Leaderboard</h2>
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-3 rounded-xl bg-muted h-9">
          <TabsTrigger value="daily" className="rounded-lg text-xs">Daily</TabsTrigger>
          <TabsTrigger value="all-time" className="rounded-lg text-xs">All Time</TabsTrigger>
          <TabsTrigger value="personal" className="rounded-lg text-xs">Personal</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="space-y-1.5">{renderScoreList(dailyScores, loadingDaily)}</TabsContent>
        <TabsContent value="all-time" className="space-y-1.5">{renderScoreList(allTimeScores, loadingAllTime)}</TabsContent>
        <TabsContent value="personal" className="space-y-1.5">{renderScoreList(personalBest, loadingPersonal)}</TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;

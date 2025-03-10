
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
  // Query for all-time scores
  const { data: allTimeScores, isLoading: loadingAllTime } = useQuery<Score[]>({
    queryKey: ["leaderboard", "all-time"],
    queryFn: async () => {
      console.log("Fetching all-time leaderboard data...");
      
      const { data, error } = await supabase
        .from("scores")
        .select(`
          id,
          score,
          user_id,
          created_at,
          profiles (username)
        `)
        .order("score", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching all-time leaderboard:", error);
        throw error;
      }

      console.log("All-time scores retrieved:", data);
      return data.map((item: any) => ({
        id: item.id,
        score: item.score,
        user_id: item.user_id,
        created_at: item.created_at,
        profiles: item.profiles || { username: 'Anonymous' }
      }));
    },
    refetchInterval: 5000, // Refetch every 5 seconds
    staleTime: 0, // Consider data immediately stale
  });

  // Query for daily scores
  const { data: dailyScores, isLoading: loadingDaily } = useQuery<Score[]>({
    queryKey: ["leaderboard", "daily"],
    queryFn: async () => {
      console.log("Fetching daily leaderboard data...");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from("scores")
        .select(`
          id,
          score,
          user_id,
          created_at,
          profiles (username)
        `)
        .gte('created_at', today.toISOString())
        .order("score", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching daily leaderboard:", error);
        throw error;
      }

      console.log("Daily scores retrieved:", data);
      return data.map((item: any) => ({
        id: item.id,
        score: item.score,
        user_id: item.user_id,
        created_at: item.created_at,
        profiles: item.profiles || { username: 'Anonymous' }
      }));
    },
    refetchInterval: 5000, // Refetch every 5 seconds
    staleTime: 0, // Consider data immediately stale
  });

  // Query for personal best
  const { data: personalBest, isLoading: loadingPersonal } = useQuery<Score[]>({
    queryKey: ["leaderboard", "personal"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.log("No user session found for personal best");
        return [];
      }

      console.log("Fetching personal best data for user:", session.user.id);
      
      const { data, error } = await supabase
        .from("scores")
        .select(`
          id,
          score,
          user_id,
          created_at,
          profiles (username)
        `)
        .eq('user_id', session.user.id)
        .order("score", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching personal best:", error);
        throw error;
      }

      console.log("Personal best scores retrieved:", data);
      return data.map((item: any) => ({
        id: item.id,
        score: item.score,
        user_id: item.user_id,
        created_at: item.created_at,
        profiles: item.profiles || { username: 'Anonymous' }
      }));
    },
    refetchInterval: 5000, // Refetch every 5 seconds
    staleTime: 0, // Consider data immediately stale
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  const renderScoreList = (scores: Score[] | undefined, isLoading: boolean) => {
    if (isLoading) return <div className="text-center py-4">Loading scores...</div>;
    
    if (!scores || scores.length === 0) {
      return <div className="text-center text-gray-500 py-4">No scores yet</div>;
    }

    return scores.map((score, index) => (
      <div
        key={score.id}
        className="flex justify-between items-center p-2 bg-water-light rounded-md"
      >
        <span className="font-medium">
          {index + 1}. {score.profiles.username || 'Anonymous'}
          <span className="text-sm text-gray-500 ml-2">
            {format(new Date(score.created_at), 'MMM d, yyyy')}
          </span>
        </span>
        <span className="text-water-dark font-bold">{score.score}</span>
      </div>
    ));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-water-dark mb-4">Leaderboard</h2>
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="all-time">All Time</TabsTrigger>
          <TabsTrigger value="personal">Personal Best</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-2">
          {renderScoreList(dailyScores, loadingDaily)}
        </TabsContent>
        
        <TabsContent value="all-time" className="space-y-2">
          {renderScoreList(allTimeScores, loadingAllTime)}
        </TabsContent>
        
        <TabsContent value="personal" className="space-y-2">
          {renderScoreList(personalBest, loadingPersonal)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;

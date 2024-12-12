import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Score {
  id: number;
  score: number;
  user_id: string;
  created_at: string;
  profiles: {
    username: string;
  };
  user?: {
    username: string;
  };
}

const Leaderboard = () => {
  const { data: scores, isLoading } = useQuery<Score[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      console.log("Fetching leaderboard data...");
      
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
        console.error("Error fetching leaderboard:", error);
        throw error;
      }

      console.log("Received leaderboard data:", data);
      
      // Transform the data to match our Score interface
      const transformedData = data.map((item: any) => ({
        id: item.id,
        score: item.score,
        user_id: item.user_id,
        created_at: item.created_at,
        profiles: item.profiles || { username: 'Anonymous' },
        user: {
          username: item.profiles?.username || 'Anonymous'
        }
      }));

      return transformedData;
    },
  });

  if (isLoading) return <div>Loading leaderboard...</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-water-dark mb-4">Leaderboard</h2>
      <div className="space-y-2">
        {scores?.map((score, index) => (
          <div
            key={score.id}
            className="flex justify-between items-center p-2 bg-water-light rounded-md"
          >
            <span className="font-medium">
              {index + 1}. {score.profiles.username || 'Anonymous'}
            </span>
            <span className="text-water-dark font-bold">{score.score}</span>
          </div>
        ))}
        {(!scores || scores.length === 0) && (
          <div className="text-center text-gray-500">No scores yet</div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
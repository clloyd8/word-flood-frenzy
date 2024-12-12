import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Score {
  score: number;
  user: {
    username: string;
  };
}

const Leaderboard = () => {
  const { data: scores, isLoading } = useQuery<Score[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scores")
        .select("score, user:profiles(username)")
        .order("score", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading leaderboard...</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-water-dark mb-4">Leaderboard</h2>
      <div className="space-y-2">
        {scores?.map((score, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-2 bg-water-light rounded-md"
          >
            <span className="font-medium">
              {index + 1}. {score.user.username}
            </span>
            <span className="text-water-dark">{score.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
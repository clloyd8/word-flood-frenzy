import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface ShareScoreProps {
  score: number;
  words: string[];
}

const ShareScore = ({ score, words }: ShareScoreProps) => {
  const generateShareText = () => {
    const emoji = score >= 200 ? "🌊" : "💧";
    return `Word Flood - Score: ${score} ${emoji}\n\nWords found (${words.length}):\n${words.join(", ")}\n\nPlay now at https://lovable.dev/projects/d5d69b07-5d41-4937-8c4e-07f3d583617c`;
  };

  const handleShare = async () => {
    const shareText = generateShareText();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Word Flood Score',
          text: shareText,
        });
        console.log('Score shared successfully');
      } catch (err) {
        console.error('Error sharing:', err);
        fallbackShare(shareText);
      }
    } else {
      fallbackShare(shareText);
    }
  };

  const fallbackShare = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Score copied to clipboard!",
      description: "Share your achievement with friends!",
      duration: 2000,
    });
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Share2 className="w-4 h-4" />
      Share Score
    </Button>
  );
};

export default ShareScore;
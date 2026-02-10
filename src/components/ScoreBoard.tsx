interface ScoreBoardProps {
  score: number;
  words: string[];
}

const ScoreBoard = ({ score, words }: ScoreBoardProps) => {
  if (words.length === 0) return null;

  return (
    <div className="bg-app-card rounded-2xl shadow-md p-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Found Words
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {words.map((word, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-app-green/10 px-3 py-2 rounded-xl"
          >
            <span className="text-app-green text-sm">✓</span>
            <span className="text-sm font-medium text-foreground uppercase">
              {word}
            </span>
            <span className="text-xs text-muted-foreground ml-auto">
              +{word.length * 10}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreBoard;

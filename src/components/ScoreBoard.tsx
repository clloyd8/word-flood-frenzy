interface ScoreBoardProps {
  score: number;
  words: string[];
}

const ScoreBoard = ({ score, words }: ScoreBoardProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="text-2xl font-bold text-water-dark mb-2">Score: {score}</div>
      <div className="text-sm text-gray-600">
        <h3 className="font-semibold mb-1">Found Words:</h3>
        <div className="flex flex-wrap gap-2">
          {words.map((word, index) => (
            <span
              key={index}
              className="bg-water-light px-2 py-1 rounded-md text-water-dark"
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
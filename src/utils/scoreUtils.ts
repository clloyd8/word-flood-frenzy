export const calculateWordScore = (word: string): number => {
  const len = word.length;
  return Math.round((len * (len + 2) * 2) / 5) * 5;
};

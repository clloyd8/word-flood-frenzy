// Simple word validation - in a real app, you'd want a proper dictionary
const VALID_WORDS = new Set(['CAT', 'DOG', 'RAT', 'BAT', 'HAT', 'MAT']);

export const isValidWord = (word: string): boolean => {
  return VALID_WORDS.has(word.toUpperCase());
};

export const getRandomLetter = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters.charAt(Math.floor(Math.random() * letters.length));
};
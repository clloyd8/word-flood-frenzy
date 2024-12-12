// A more comprehensive word list for the game
const VALID_WORDS = new Set([
  'CAT', 'DOG', 'RAT', 'BAT', 'HAT', 'MAT', 'SAT', 'FAT', 'PAT',
  'PET', 'SET', 'NET', 'WET', 'GET', 'JET', 'LET', 'MET',
  'RED', 'BED', 'LED', 'FED', 'WED', 'TED',
  'RUN', 'SUN', 'FUN', 'BUN', 'GUN', 'NUN',
  'MAP', 'LAP', 'CAP', 'NAP', 'SAP', 'TAP',
  'TIP', 'LIP', 'SIP', 'DIP', 'HIP', 'RIP'
]);

export const isValidWord = (word: string): boolean => {
  console.log('Checking word:', word, 'Upper case:', word.toUpperCase());
  return VALID_WORDS.has(word.toUpperCase());
};

export const getRandomLetter = (): string => {
  // Weighted distribution favoring common letters
  const letters = 'EEEEAAAAIIIIOOOONNNNSSSSRRRRTTTTLLLLSSSSUUUUDDDDGGGBBCCMMPPFFHHVVWWYYKJXQZ';
  return letters.charAt(Math.floor(Math.random() * letters.length));
};
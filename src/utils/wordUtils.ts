// Cache for validated words to avoid repeated API calls
const validatedWordsCache = new Set<string>();

export const isValidWord = async (word: string): Promise<boolean> => {
  const normalizedWord = word.toLowerCase();
  
  // Check cache first
  if (validatedWordsCache.has(normalizedWord)) {
    console.log('Word found in cache:', normalizedWord);
    return true;
  }

  // Only check words that are 3 or more letters
  if (normalizedWord.length < 3) {
    console.log('Word too short:', normalizedWord);
    return false;
  }

  try {
    console.log('Checking word:', normalizedWord);
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${normalizedWord}`);
    
    // If we get a successful response, the word exists
    if (response.status === 200) {
      validatedWordsCache.add(normalizedWord);
      console.log('Valid word found:', normalizedWord);
      return true;
    }
    
    // If we get a 404, the word doesn't exist in the dictionary
    if (response.status === 404) {
      console.log('Word not found in dictionary:', normalizedWord);
      return false;
    }
    
    // For any other status code, log it and return false
    console.log(`API returned status ${response.status} for word:`, normalizedWord);
    return false;
    
  } catch (error) {
    // Handle network errors silently but log them
    console.log('Network error checking word:', error);
    return false;
  }
};

const VOWELS = ['A', 'E', 'I', 'O', 'U'];
const CONSONANTS = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];

const isVowel = (letter: string): boolean => VOWELS.includes(letter);

const countConsecutiveConsonants = (grid: string[][]): number => {
  // Find the most recent non-empty cell
  let lastRow = -1;
  let lastCol = -1;
  
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j]) {
        lastRow = i;
        lastCol = j;
      }
    }
  }

  if (lastRow === -1) return 0;

  // Count consecutive consonants backwards from the last filled cell
  let count = 0;
  let maxCount = 0;
  
  // Check in the same row
  for (let j = lastCol; j >= 0; j--) {
    if (!grid[lastRow][j]) break;
    if (!isVowel(grid[lastRow][j])) {
      count++;
      maxCount = Math.max(maxCount, count);
    } else {
      count = 0;
    }
  }

  // Check in the same column
  count = 0;
  for (let i = lastRow; i >= 0; i--) {
    if (!grid[i][lastCol]) break;
    if (!isVowel(grid[i][lastCol])) {
      count++;
      maxCount = Math.max(maxCount, count);
    } else {
      count = 0;
    }
  }

  // Check diagonally
  count = 0;
  let i = lastRow;
  let j = lastCol;
  while (i >= 0 && j >= 0) {
    if (!grid[i][j]) break;
    if (!isVowel(grid[i][j])) {
      count++;
      maxCount = Math.max(maxCount, count);
    } else {
      count = 0;
    }
    i--;
    j--;
  }

  console.log('Current consecutive consonants:', maxCount);
  return maxCount;
};

export const getRandomLetter = (grid: string[][]): string => {
  // Safely handle undefined grid
  if (!grid || !grid.length) {
    return VOWELS[Math.floor(Math.random() * VOWELS.length)];
  }

  const consecutiveConsonants = countConsecutiveConsonants(grid);
  
  // If we have 4 consonants in a row, force a vowel to prevent reaching 5
  if (consecutiveConsonants >= 4) {
    console.log('Forcing vowel due to consecutive consonants:', consecutiveConsonants);
    return VOWELS[Math.floor(Math.random() * VOWELS.length)];
  }

  // Weighted distribution favoring common letters
  const letters = 'EEEEAAAAIIIIOOOONNNNSSSSRRRRTTTTLLLLSSSSUUUUDDDDGGGBBCCMMPPFFHHVVWWYYKJXQZ';
  return letters.charAt(Math.floor(Math.random() * letters.length));
};
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

const checkForConsecutiveConsonants = (grid: string[][]): number => {
  let maxConsecutive = 0;
  
  // Check horizontally
  for (let row = 0; row < grid.length; row++) {
    let current = 0;
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] && !isVowel(grid[row][col])) {
        current++;
        maxConsecutive = Math.max(maxConsecutive, current);
      } else {
        current = 0;
      }
    }
  }

  // Check vertically
  for (let col = 0; col < grid[0].length; col++) {
    let current = 0;
    for (let row = 0; row < grid.length; row++) {
      if (grid[row][col] && !isVowel(grid[row][col])) {
        current++;
        maxConsecutive = Math.max(maxConsecutive, current);
      } else {
        current = 0;
      }
    }
  }

  // Check diagonally (top-left to bottom-right)
  for (let startRow = 0; startRow < grid.length; startRow++) {
    for (let startCol = 0; startCol < grid[0].length; startCol++) {
      let current = 0;
      let row = startRow;
      let col = startCol;
      while (row < grid.length && col < grid[0].length) {
        if (grid[row][col] && !isVowel(grid[row][col])) {
          current++;
          maxConsecutive = Math.max(maxConsecutive, current);
        } else {
          current = 0;
        }
        row++;
        col++;
      }
    }
  }

  return maxConsecutive;
};

export const getRandomLetter = (grid: string[][]): string => {
  // Safely handle undefined grid
  if (!grid || !grid.length) {
    return VOWELS[Math.floor(Math.random() * VOWELS.length)];
  }

  const consecutiveConsonants = checkForConsecutiveConsonants(grid);
  
  // If we have 4 consonants in a row, force a vowel to prevent reaching 5
  if (consecutiveConsonants >= 4) {
    console.log('Forcing vowel due to consecutive consonants:', consecutiveConsonants);
    return VOWELS[Math.floor(Math.random() * VOWELS.length)];
  }

  // Weighted distribution favoring common letters
  const letters = 'EEEEAAAAIIIIOOOONNNNSSSSRRRRTTTTLLLLSSSSUUUUDDDDGGGBBCCMMPPFFHHVVWWYYKJXQZ';
  return letters.charAt(Math.floor(Math.random() * letters.length));
};
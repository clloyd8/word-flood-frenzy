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

export const getRandomLetter = (grid: string[][]): string => {
  // Count consecutive consonants in the last row
  const lastRow = grid[grid.length - 1];
  let consecutiveConsonants = 0;
  
  for (let i = lastRow.length - 1; i >= 0 && lastRow[i]; i--) {
    if (!isVowel(lastRow[i])) {
      consecutiveConsonants++;
    } else {
      break;
    }
  }

  // If we have 4 consonants in a row, force a vowel
  if (consecutiveConsonants >= 4) {
    return VOWELS[Math.floor(Math.random() * VOWELS.length)];
  }

  // Weighted distribution favoring common letters
  const letters = 'EEEEAAAAIIIIOOOONNNNSSSSRRRRTTTTLLLLSSSSUUUUDDDDGGGBBCCMMPPFFHHVVWWYYKJXQZ';
  return letters.charAt(Math.floor(Math.random() * letters.length));
};
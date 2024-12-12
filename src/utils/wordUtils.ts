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
    
    // If the response is successful, the word is valid
    if (response.ok) {
      validatedWordsCache.add(normalizedWord);
      console.log('Valid word found:', normalizedWord);
      return true;
    }
    
    // Any non-200 response (including 404) means the word is invalid
    console.log('Invalid word:', normalizedWord);
    return false;
    
  } catch (error) {
    // Handle network errors silently
    console.log('Network error checking word:', error);
    return false;
  }
};

export const getRandomLetter = (): string => {
  // Weighted distribution favoring common letters
  const letters = 'EEEEAAAAIIIIOOOONNNNSSSSRRRRTTTTLLLLSSSSUUUUDDDDGGGBBCCMMPPFFHHVVWWYYKJXQZ';
  return letters.charAt(Math.floor(Math.random() * letters.length));
};
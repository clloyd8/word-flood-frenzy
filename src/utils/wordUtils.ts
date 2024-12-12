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
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${normalizedWord}`);
    
    // A 404 response means the word doesn't exist - this is not an error
    if (response.status === 404) {
      console.log('Invalid word:', normalizedWord);
      return false;
    }
    
    // For any other non-200 response, we'll consider it an error
    if (!response.ok) {
      console.error('API error:', response.status, response.statusText);
      return false;
    }
    
    // If we get here, the word is valid
    validatedWordsCache.add(normalizedWord);
    console.log('Valid word found:', normalizedWord);
    return true;
  } catch (error) {
    console.error('Error checking word:', error);
    return false;
  }
};

export const getRandomLetter = (): string => {
  // Weighted distribution favoring common letters
  const letters = 'EEEEAAAAIIIIOOOONNNNSSSSRRRRTTTTLLLLSSSSUUUUDDDDGGGBBCCMMPPFFHHVVWWYYKJXQZ';
  return letters.charAt(Math.floor(Math.random() * letters.length));
};
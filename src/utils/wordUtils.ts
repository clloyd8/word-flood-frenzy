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
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${normalizedWord}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    // Handle 404 (word not found) silently - this is expected for invalid words
    if (response.status === 404) {
      console.log('Word not found in dictionary:', normalizedWord);
      return false;
    }
    
    // Parse the response only if it's successful
    if (response.ok) {
      // Add valid word to cache
      validatedWordsCache.add(normalizedWord);
      console.log('Valid word found:', normalizedWord);
      return true;
    }
    
    // For any other status, return false without throwing
    console.log('Unexpected API response:', response.status);
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
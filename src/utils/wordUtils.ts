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

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);
let lastFourLetters: string[] = [];

export const getRandomLetter = (): string => {
  // Weighted distribution favoring common letters
  const letters = 'EEEEAAAAIIIIOOOONNNNSSSSRRRRTTTTLLLLSSSSUUUUDDDDGGGBBCCMMPPFFHHVVWWYYKJXQZ';
  
  // Count consecutive consonants in the last four letters
  const consecutiveConsonants = lastFourLetters.filter(letter => !VOWELS.has(letter)).length;
  
  let selectedLetter: string;
  
  // If we have 4 consecutive consonants, force a vowel
  if (consecutiveConsonants >= 4) {
    const vowels = 'AEEIIIOOUU'; // Weighted vowels
    selectedLetter = vowels.charAt(Math.floor(Math.random() * vowels.length));
  } else {
    selectedLetter = letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Update the last four letters array
  lastFourLetters.push(selectedLetter);
  if (lastFourLetters.length > 4) {
    lastFourLetters.shift();
  }
  
  console.log('Generated letter:', selectedLetter, 'Last four:', lastFourLetters.join(''));
  return selectedLetter;
};
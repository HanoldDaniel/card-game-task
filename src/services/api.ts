export interface RandomWordResponse {
  word: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_NINJAS_URL || "https://api.api-ninjas.com/v1";
const API_KEY = import.meta.env.VITE_API_NINJAS_KEY;

const FALLBACK_WORDS = [
  "brave",
  "luminous",
  "serene",
  "quirky",
  "vibrant",
  "mellow",
  "zesty",
  "whimsical",
  "daring",
  "snappy",
  "jovial",
  "sleek",
  "rustic",
  "breezy",
  "cheeky",
  "dazzling",
  "sassy",
  "giddy",
  "plucky",
  "swanky",
];

const getFallbackWord = () => {
  return FALLBACK_WORDS[Math.floor(Math.random() * FALLBACK_WORDS.length)];
};

export const fetchRandomWord = async (): Promise<RandomWordResponse> => {
  if (!API_KEY) {
    console.warn("API key missing - using fallback word list");
    return { word: getFallbackWord() };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/randomword`, {
      headers: {
        "X-Api-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return { word: data.word[0].toLowerCase() };
  } catch (error) {
    console.error("Error fetching random word:", error);
    return { word: getFallbackWord() };
  }
};

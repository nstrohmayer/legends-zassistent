import { Type, GenerateContentParameters, GenerateContentResponse } from "@google/genai";
import { 
    TeamMember, 
    GeminiComplexGoalResponseItem
} from '../types';
import { GEMINI_MODEL_NAME } from '../constants';

const CACHE_PREFIX_NAVIGATOR = "gemini_navigator_cache_lza_";

// This is a representation of the serializable response from our proxy.
interface GeminiProxyResponse {
    text: string;
    candidates?: {
        finishReason?: string;
        finishMessage?: string;
    }[];
    promptFeedback?: {
        blockReason?: string;
        blockReasonMessage?: string;
    };
}

export async function callGeminiProxy(params: GenerateContentParameters): Promise<GeminiProxyResponse> {
    const controller = new AbortController();
    // This client-side timeout (10s) works with the server-side timeout (9s) in the proxy function.
    // If the server times out, it sends an error. If the entire request (including network)
    // takes too long, this AbortController will cancel the request.
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
        const proxyResponse = await fetch('/.netlify/functions/gemini-proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ params }),
            signal: controller.signal // Pass the AbortSignal to fetch
        });

        clearTimeout(timeoutId); // Clear the timeout if the request completes in time

        const responseData = await proxyResponse.json();

        if (!proxyResponse.ok) {
            throw new Error(responseData.error || `Proxy request failed with status ${proxyResponse.status}`);
        }

        return responseData;
    } catch (error) {
        clearTimeout(timeoutId); // Also clear timeout on other errors
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('The request to the AI took too long and has timed out. Please try again later.');
        }
        // Re-throw other errors
        throw error;
    }
}


export const fetchNavigatorGuidanceFromGemini = async (userPrompt: string): Promise<string> => {
  const cacheKey = `${CACHE_PREFIX_NAVIGATOR}${userPrompt.toLowerCase().replace(/\s+/g, '_').substring(0, 100)}`;

  try {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      console.log(`Serving Navigator guidance (Pokémon Legends: Z-A) for prompt starting with "${userPrompt.substring(0, 50)}..." from cache.`);
      return JSON.parse(cachedData) as string;
    }
  } catch (error) {
    console.warn(`Error reading Navigator cache (Pokémon Legends: Z-A) for prompt "${userPrompt.substring(0, 50)}...":`, error);
  }
  
  const systemInstruction = `
    You are an AI assistant for a Pokémon application, specifically for the game "Pokémon Legends: Z-A" set in the Kalos region.
    Your goal is to provide helpful, concise, and informative answers to aid the player in their adventure.
    
    Key Guidelines:
    1.  **"Pokémon Legends: Z-A" Specifics:** Ensure your information is accurate for the Kalos region and the mechanics of Pokémon X and Y, as Z-A will be based on it. Mention Mega Evolution where relevant.
    2.  **Avoid Excessive Spoilers (if possible):** When asked about a trainer's team, you can mention their primary type, level, and perhaps one or two notable Pokemon. Do NOT list full teams with all movesets unless explicitly asked.
    3.  **Conciseness:** Provide the necessary information without being overly verbose. Get to the point.
    4.  **Output:** Respond with plain text. Use markdown lists for clarity if needed. Do not wrap your response in JSON or markdown code fences.
    5.  **Pokémon Linking:** When you mention a specific Pokémon name (e.g., Pikachu, Snorlax), please wrap it in double curly braces: \`{{PokemonName}}\`. For example, \`{{Pikachu}}\`.
  `;

  try {
    const response = await callGeminiProxy({
        model: GEMINI_MODEL_NAME,
        contents: userPrompt, // User's question is the main content
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.3, 
            topK: 40,
            topP: 0.95,
        }
    });
    
    const textOutput = response.text;

    if (textOutput == null || typeof textOutput !== 'string' || textOutput.trim() === "") {
        if (response.promptFeedback?.blockReason) {
            throw new Error(`Your query was blocked. Reason: ${response.promptFeedback.blockReason}. ${response.promptFeedback.blockReasonMessage || 'No additional message provided.'}`);
        }
        const finishReason = response.candidates?.[0]?.finishReason;
        if (finishReason && finishReason !== 'STOP') {
            throw new Error(`The AI stopped generating a response unexpectedly. Reason: ${finishReason}. Please try rephrasing your question.`);
        }
        // This is the fallback for when the AI returns "" or null, but the finish reason is 'STOP'.
        throw new Error("The AI returned an empty response. This can happen with very broad or ambiguous questions. Please try being more specific.");
    }

    try {
      localStorage.setItem(cacheKey, JSON.stringify(textOutput));
      console.log(`Navigator guidance (Pokémon Legends: Z-A) for prompt "${userPrompt.substring(0,50)}..." cached.`);
    } catch (error) {
      console.warn(`Error saving Navigator cache (Pokémon Legends: Z-A) for prompt "${userPrompt.substring(0,50)}...":`, error);
    }

    return textOutput;

  } catch (error) {
    console.error(`Error processing Gemini API response for navigator prompt "${userPrompt.substring(0,50)}..." (Pokémon Legends: Z-A):`, error);
    const errorMessage = error instanceof Error ? error.message : `An unknown error occurred.`;
    throw new Error(errorMessage);
  }
};

export const parseComplexGoalFromGemini = async (prompt: string): Promise<GeminiComplexGoalResponseItem[]> => {
    const systemInstruction = `
      You are an AI expert for Pokémon games set in the Kalos region. The user will provide a high-level goal.
      Your task is to break it down into a checklist of specific, actionable sub-goals.
      For each sub-goal that involves a specific Pokémon, you MUST provide its official English name and National Pokédex ID.
      Return the result as a JSON array of objects.
      - If a goal is about a specific Pokémon (e.g., 'Catch Eevee'), the object MUST contain 'goalText', 'pokemonName', and 'pokemonId'.
      - If a goal is a general task (e.g., 'Finish the main story'), the object should only contain 'goalText'.
      Examples:
      - User prompt: "catch all eeveelutions" -> Return JSON for Vaporeon, Jolteon, Flareon, etc., each with name and ID.
      - User prompt: "get all legendary pokemon" -> Return JSON for Xerneas, Yveltal, Zygarde, etc., each with name and ID.
      If no specific Pokémon or tasks can be identified, return an empty array. Do not add any text outside the JSON.
    `;
    
    const schema = {
        type: Type.ARRAY,
        description: "A list of specific sub-goals derived from the user's high-level goal.",
        items: {
            type: Type.OBJECT,
            properties: {
                goalText: {
                    type: Type.STRING,
                    description: "The specific, actionable text for the sub-goal. E.g., 'Catch Zapdos' or 'Complete the main story'."
                },
                pokemonName: {
                    type: Type.STRING,
                    description: "The official English name of the Pokémon involved in the goal, if any. E.g., 'Zapdos'."
                },
                pokemonId: {
                    type: Type.NUMBER,
                    description: "The official National Pokédex ID of the Pokémon, if any. E.g., 145."
                }
            },
            required: ["goalText"]
        }
    };

    try {
        const response = await callGeminiProxy({
            model: GEMINI_MODEL_NAME,
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.0
            }
        });

        const textOutput = response.text;
        
        if (typeof textOutput !== 'string' || textOutput.trim() === "") {
            throw new Error("The AI did not provide any details for your goal.");
        }

        const jsonStr = textOutput.trim();
        const parsedData = JSON.parse(jsonStr) as GeminiComplexGoalResponseItem[];
        return parsedData;

    } catch (error) {
        console.error(`Error processing Gemini API response for complex goal "${prompt}":`, error);
        let errorMessage = `Failed to get details from AI for your goal.`;
        if (error instanceof SyntaxError) {
             errorMessage = `The AI returned invalid data for your goal. Please try a different wording.`;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(errorMessage);
    }
};

export const parseHuntIntentFromGemini = async (prompt: string): Promise<{ name: string; id: number }[]> => {
    const systemInstruction = `
        You are an expert Pokémon data extractor. The user will provide a sentence expressing their desire to hunt for certain Pokémon.
        Your task is to identify all Pokémon mentioned in the sentence and return them as a JSON array of objects.
        Each object must have a "name" (official English name) and an "id" (official National Pokédex number).
        For example, if the prompt is "I want to hunt for Pikachu and the Gen 1 starters", you should return:
        [{"name": "Bulbasaur", "id": 1}, {"name": "Charmander", "id": 4}, {"name": "Squirtle", "id": 7}, {"name": "Pikachu", "id": 25}]
        If you cannot identify any Pokémon, return an empty array. Do not add any text outside the JSON array.
    `;

    const schema = {
        type: Type.ARRAY,
        description: "A list of Pokémon objects identified from the user's prompt.",
        items: {
            type: Type.OBJECT,
            properties: {
                name: {
                    type: Type.STRING,
                    description: "The official English name of the Pokémon."
                },
                id: {
                    type: Type.NUMBER,
                    description: "The official National Pokédex ID for the Pokémon."
                }
            },
            required: ["name", "id"]
        }
    };

    try {
        const response = await callGeminiProxy({
            model: GEMINI_MODEL_NAME,
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.0,
            }
        });

        const textOutput = response.text;
        
        if (typeof textOutput !== 'string' || textOutput.trim() === "") {
            console.warn("AI returned an empty response for hunt intent, returning empty array.");
            return [];
        }

        let jsonStr = textOutput.trim();
        const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[1]) {
            jsonStr = match[1].trim();
        }
        
        const pokemonList = JSON.parse(jsonStr) as { name: string; id: number }[];
        return pokemonList;

    } catch (error) {
        console.error("Error parsing hunt intent from Gemini:", error);
        let errorMessage = "Failed to parse hunt intent from AI.";
        if (error instanceof SyntaxError) {
             errorMessage = `The AI returned invalid data. Please try rephrasing your hunt request.`;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(errorMessage);
    }
};
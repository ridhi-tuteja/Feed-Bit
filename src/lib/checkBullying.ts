import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

/**
 * Checks if a given text content contains bullying behavior using Google's Gemini API.
 * Rates the content on a scale of 0-10, where 0 is no bullying and 10 is severe bullying.
 *
 * @param content The text content to analyze for bullying.
 * @returns A Promise that resolves to the bullying rating (0-10) or null if an error occurs or parsing fails.
 */
export async function checkBullying(content: string): Promise<number | null> {
    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not set in environment variables. Cannot perform bullying check.");
        return null;
    }

    const bullyingPrompt = `You are a content moderation assistant. Your task is to rate the given text content for bullying behavior on a scale of 0 to 10, where 0 means absolutely no bullying and 10 means severe bullying. 
    Consider direct insults, threats, harassment, derogatory language, targeted negativity, and any intent to cause emotional distress.
    
    Provide only a single number as your response (the rating). Do not include any other text, explanations, or formatting.

    Text to rate: "${content}"
    Rating:`;

    try {
        const result = await model.generateContent(bullyingPrompt);
        const responseText = result.response.text();
        console.log("RAW GEMINI RESPONSE:", responseText);

        const raw = responseText.trim();

        // Extract first number between 0–10 even if Gemini adds text
        const match = raw.match(/\b(10|[0-9])\b/);

        if (!match) {
            console.warn("Could not extract bullying rating from Gemini response:", raw);
            return null;
        }

        const bullyingRating = Number(match[1]);

        // clamp value between 0 and 10 (extra safety)
        const safeRating = Math.min(10, Math.max(0, bullyingRating));

        console.log("Bullying rating:", safeRating);
        return safeRating;


        // let bullyingRating: number | null = null;
        // try {
        //     // Attempt to parse the response as a number
        //     const parsed = parseFloat(responseText.trim());
        //     if (!isNaN(parsed)) {
        //         bullyingRating = parsed;
        //         console.log("The bully marks:",bullyingRating);
        //     } else {
        //         console.warn("Gemini did not return a pure numerical rating:", responseText);
        //     }
        // } catch (parseError) {
        //     console.error("Error parsing Gemini response:", parseError);
        // }
        // console.log("The bully marks:",bullyingRating);
        // return bullyingRating;

    } catch (apiError) {
        console.error("Error calling Gemini API for bullying detection:", apiError);
        return null;
    }
}
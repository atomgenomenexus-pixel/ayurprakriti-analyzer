import { GoogleGenAI, Type } from "@google/genai";
import { ModuleResult, AssessmentModuleId, DoshaType } from "../types";

// Helper for retry logic as recommended for API stability
async function callWithRetry<T>(fn: () => Promise<T>, retries = 2, delay = 3000): Promise<T> {
  try {
    return await fn();
  } catch (e: any) {
    const errorString = JSON.stringify(e);
    const isQuotaError = errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED');
    
    if (isQuotaError && retries > 0) {
      console.warn(`Quota exceeded. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw e;
  }
}

// Extract JSON safely from response text
const extractJson = (text: string) => {
  try {
    let cleanJson = text.trim();
    if (cleanJson.includes('```')) {
      const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
      if (jsonMatch) cleanJson = jsonMatch[0];
    }
    const parsed = JSON.parse(cleanJson);
    
    if (parsed.answers && typeof parsed.answers === 'object') {
      const sanitizedAnswers: Record<string, string> = {};
      for (const [key, value] of Object.entries(parsed.answers)) {
        if (Array.isArray(value)) {
          sanitizedAnswers[key] = value.join(',');
        } else {
          sanitizedAnswers[key] = String(value);
        }
      }
      parsed.answers = sanitizedAnswers;
    }
    
    return parsed;
  } catch (e) {
    console.error("JSON Parse Error. Raw text:", text);
    throw new Error("Failed to parse clinical data from AI engine.");
  }
};

export interface VisualAnalysisResponse {
  answers: Record<string, string>;
  unclearIds: string[];
}

export const analyzeVisualFeatures = async (scanImages: Record<string, string>): Promise<VisualAnalysisResponse> => {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const imageParts = Object.entries(scanImages).map(([key, data]) => ({
      inlineData: { mimeType: "image/jpeg", data: data.split(",")[1] }
    }));

    const prompt = `
      You are a specialized Ayurvedic Clinical Diagnostic AI Expert. 
      Your task is to EXHAUSTIVELY populate the Prakruti Questionnaire based on the provided scans.
      You MUST provide an answer for EVERY ID listed below. If a feature is absolutely invisible, list it in "unclearIds".

      --- RIGOROUS CLINICAL MAPPING ---

      1. BODY FRAME (Source: 'body' image):
         - p_1_1 (Overall Frame): narrow / medium / broad
         - p_1_2 (Shoulders): narrow / medium / broad
         - p_1_3 (Chest): narrow / medium / broad
         - p_2_1 (Length): tall / medium / short
         - p_3_1 (Build): weak / medium / well
         - p_4_1 (Musculature): thin / loose / firm

      2. FOREHEAD & FACE (Source: 'forehead', 'lips', 'eyes' images):
         - p_2_2 (Forehead Height):
            * COUNT THE FINGERS placed horizontally on forehead.
            * IF Exactly 4 fingers cover height: "medium".
            * IF Fewer than 4 fingers cover height: "narrow".
            * IF More than 4 fingers (5+) cover height: "broad".
         - p_3_2 (Face Size): small / medium / large
         - p_5_4 (Skin Color): dark / reddish / yellowish / wheatish / dusky

      3. EYES (Source: 'eyes' image):
         - p_3_3 (Eye Size): large / medium / small (based on sclera visibility)
         - p_3_4 (Eyelash Size): small / medium / large (thickness/length)

      4. EXTREMITIES (Source: 'wrist', 'palm', 'nails', 'feet' images):
         - p_3_5 (Wrist Bony Prominence): narrow (fingers overlap) / medium (just touch) / wide (don't meet)
         - p_3_7 (Nail Ratio): small (L<B) / medium (L=B) / long (L>B)
         - p_10_1 (Palm Color): dark / reddish / yellowish / pink
         - p_10_2 (Palm Tendency): List [cracked, wrinkled, firm]
         - p_11_1 (Sole Color): dark / reddish / yellowish / pink
         - p_7_1 (Nail Color): dark / reddish / yellowish / pink
         - p_7_2 (Nail Texture): rough / smooth / brittle
         - p_7_3 (Nail Nature): firm / soft

      5. DERMAL FEATURES (Source: 'skin_detail' image):
         - p_5_1 (Appearance): List [lustrous, dry, clear, moles, wrinkled, freckles]
         - p_5_2 (Nature): dry / oily / normal
         - p_5_3 (Texture): rough / smooth / coarse

      6. ORAL FEATURES (Source: 'lips', 'dental' images):
         - p_3_6 (Lip Size): thin / medium / broad
         - p_9_1 (Lip Color): dark / reddish / yellowish / pink
         - p_9_2 (Lip Tendency): List [cracked, wrinkled, firm]
         - p_8_1 (Teeth Color): white / yellowish / blackish
         - p_8_2 (Teeth Shape): even / uneven
         - p_8_3 (Teeth Size): large / medium / tlarge / tsmall
         - p_8_4 (Palate Color): yellowish / reddish

      RETURN ONLY JSON:
      {
        "answers": {
          "p_1_1": "...", "p_1_2": "...", "p_1_3": "...", "p_2_1": "...", "p_2_2": "...",
          "p_3_1": "...", "p_3_2": "...", "p_3_3": "...", "p_3_4": "...", "p_3_5": "...",
          "p_3_6": "...", "p_3_7": "...", "p_4_1": "...", "p_5_1": "...", "p_5_2": "...",
          "p_5_3": "...", "p_5_4": "...", "p_7_1": "...", "p_7_2": "...", "p_7_3": "...",
          "p_8_1": "...", "p_8_2": "...", "p_8_3": "...", "p_8_4": "...", "p_9_1": "...",
          "p_9_2": "...", "p_10_1": "...", "p_10_2": "...", "p_11_1": "..."
        },
        "unclearIds": []
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ text: prompt }, ...imageParts] },
      config: { responseMimeType: "application/json", temperature: 0.1, seed: 42 }
    });
    
    return extractJson(response.text);
  });
};

export const analyzeSingleModule = async (
  moduleId: AssessmentModuleId,
  answers: Record<string, string>,
  profile: any
): Promise<ModuleResult> => {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const dataPayload = Object.entries(answers).map(([key, val]) => `${key}: ${val}`).join(", ");

    const prompt = `
      Role: Senior Ayurvedic Physician & Charaka Samhita Scholar.
      System: Clinical Diagnostic Engine based on Charaka Samhita Vimana Sthana 8.

      STRICT SCORING RULES:
      1. ZERO EVIDENCE RULE: If the data contains NO markers for a specific Dosha (Vata, Pitta, or Kapha), that Dosha's percentage score MUST be exactly 0. 
      2. STABILITY: The result must be deterministic. The same set of answers must always produce the same percentages.
      3. INTEGER FORMAT: All "scores" and "subScores" percentages MUST be whole numbers (0-100). NEVER return 0.5 for 50%.
      4. SUMMATION: Vata + Pitta + Kapha scores in "scores" MUST equal exactly 100.

      Input Data: ${dataPayload}
      Profile Metadata: ${JSON.stringify(profile)}

      Return ONLY a JSON object:
      {
        "moduleId": "${moduleId}",
        "scores": { "Vata": number, "Pitta": number, "Kapha": number },
        "classification": "string",
        "insight": "Concise metabolic clinical profile.",
        "reasoning": "Scientific explanation of scores. State why a dosha is 0 if no markers were found.",
        "subScores": { 
          "Anatomical": { "percentage": number, "classification": "string" },
          "Physiological": { "percentage": number, "classification": "string" }
        },
        "recommendations": { "ahara": ["Diet item 1", "..."], "vihara": ["Lifestyle item 1", "..."] },
        "references": ["Charaka Samhita Vimana 8.95-100", "..."],
        "agniStatus": "string (Tikshna/Manda/Vishama/Sama)"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts: [{ text: prompt }] },
      config: { 
        responseMimeType: "application/json", 
        temperature: 0.1,
        seed: 42,
        thinkingConfig: { thinkingBudget: 15000 }
      }
    });

    return extractJson(response.text);
  });
};
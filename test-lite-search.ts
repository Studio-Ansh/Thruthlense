import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: "Hello",
      config: { tools: [{ googleSearch: {} }] }
    });
    console.log(response.text);
  } catch (err) {
    console.error(err);
  }
}
main();

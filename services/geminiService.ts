import { GoogleGenAI } from "@google/genai";
import { DynamicTemplate, CVSection } from "../types";

export const generateWithGemini = async (prompt: string, model: string, apiKey?: string): Promise<string> => {
  const finalApiKey = apiKey || process.env.API_KEY;

  if (!finalApiKey) {
    return "API key not configured. Please add your key in Settings or contact support.";
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: finalApiKey });
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are a professional resume writing assistant. Your goal is to help users create a compelling resume. Generate clean, human-like text. Do not use markdown, especially asterisks for bolding. Focus on professional language and action verbs.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling AI API:", error);
    if (error instanceof Error) {
        return `An error occurred with the AI assistant: ${error.message}`;
    }
    return "An unknown error occurred while contacting the AI assistant.";
  }
};


export const generateTemplateJson = async (prompt: string, model: string, apiKey?: string): Promise<DynamicTemplate | { error: string }> => {
  const finalApiKey = apiKey || process.env.API_KEY;
  if (!finalApiKey) {
    return { error: "API key not configured." };
  }

  const systemInstruction = `You are a resume template designer. Your task is to generate a JSON object that defines the structure and style of a resume template based on the user's request.
The JSON object MUST strictly adhere to the following TypeScript interface:
\`\`\`typescript
export type TemplateLayout = 'single-column' | 'two-column';
export type SectionArea = 'main' | 'sidebar';
export type CVSection = 'personalDetails' | 'contactInfo' | 'workExperience' | 'skills' | 'education' | 'professionalSummary' | 'projects';
export type SectionComponent = 'default-summary' | 'default-experience' | 'default-education' | 'compact-skills' | 'default-projects' | 'default-contact';

export interface DynamicTemplate {
    id: string; // Should be a unique uuid, please generate one.
    name: string; // A descriptive name for the template, e.g., "Minimalist Blue"
    font: string; // A font family name from Google Fonts, e.g., 'Inter', 'Roboto', 'Lato', 'Merriweather'
    layout: {
        type: TemplateLayout;
        mainWidth?: string; // Tailwind CSS width class, e.g., 'w-2/3'. Required for 'two-column'.
        gap?: string; // Tailwind CSS gap class, e.g., 'gap-8'
    };
    sections: {
        // You can include any of the CVSection keys.
        [key in CVSection]?: {
            area: SectionArea; // 'main' or 'sidebar'. For 'single-column' layout, always use 'main'.
            order: number; // The display order of the section within its area.
            component: SectionComponent; // The type of component to render.
            title?: string; // The title for the section header, e.g., "Professional Experience".
        }
    };
    styles: {
        primaryColor: string; // A valid CSS hex color, e.g., '#3b82f6'
        headingSize: string; // Tailwind CSS text size class, e.g., 'text-2xl', 'text-3xl'
        subheadingSize: string; // Tailwind CSS text size class, e.g., 'text-lg', 'text-xl'
        bodySize: string; // Tailwind CSS text size class, e.g., 'text-sm', 'text-xs'
    }
}
\`\`\`
- For the 'sections' object, ensure 'personalDetails' is not included as it is handled by the template header.
- The 'id' must be a unique UUID in the format 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.
- The 'name' should be creative and reflect the user's prompt.
- Respond ONLY with the raw, valid JSON object. Do not include any explanations, comments, or markdown formatting like \`\`\`json. Your entire response must be parseable by JSON.parse().
`;

  try {
    const ai = new GoogleGenAI({ apiKey: finalApiKey });
    const response = await ai.models.generateContent({
      model: model,
      contents: `User request: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const generatedText = response.text.trim();
    // Basic validation
    if (!generatedText.startsWith('{') || !generatedText.endsWith('}')) {
        throw new Error("Generated content is not a valid JSON object.");
    }

    const template = JSON.parse(generatedText) as DynamicTemplate;
    // Further validation could be added here to check the schema
    return template;

  } catch (error) {
    console.error("Error generating template JSON with AI API:", error);
    if (error instanceof Error) {
        return { error: `AI Assistant Error: ${error.message}` };
    }
    return { error: "An unknown error occurred while generating the template." };
  }
};
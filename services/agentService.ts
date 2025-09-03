import { GoogleGenAI, Type } from "@google/genai";
import { Task, LogEntry } from '../types';
import { AGENT_ROLES } from '../constants';

// The API key is injected from the environment and is assumed to be present.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a structured task plan with dependencies based on a user's goal.
 * @param goal The user's high-level objective.
 * @returns A promise that resolves to an array of tasks.
 */
export const planTasks = async (goal: string): Promise<Omit<Task, 'status' | 'error'>[]> => {
  try {
    const systemInstruction = `You are a meticulous project planner. Your job is to break down a user's objective into a series of dependent tasks for a team of AI agents.
You must adhere to the following rules:
1.  Deconstruct the user's goal into a clear sequence of tasks.
2.  For each task, provide a unique 'id' (e.g., "research-market-trends"), a concise 'title', a detailed 'description' of what needs to be done, assign the most suitable 'agent' from the available roles, and list its 'dependencies' as an array of task IDs.
3.  Dependencies are crucial. A task should only list IDs of tasks that must be completed *before* it can start. The first task(s) should have an empty dependency array.
4.  The final task must always be assigned to the "Reviewer Agent". This task's purpose is to synthesize all previous work into a final report or product. It must depend on all other non-reviewer tasks.
5.  Ensure the plan is logical and efficient.
6.  Your entire output must be a single, valid JSON array of task objects, conforming to the provided schema. Do not include any other text, comments, or explanations.`;

    const contents = `
**User Objective:** "${goal}"
**Available Agent Roles:** ${AGENT_ROLES.join(', ')}
`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "A unique identifier for the task (e.g., 'research-market-trends')." },
              title: { type: Type.STRING, description: "A short, descriptive title for the task." },
              description: { type: Type.STRING, description: "A detailed explanation of the task's objective." },
              agent: { type: Type.STRING, enum: AGENT_ROLES, description: "The agent role best suited for this task." },
              dependencies: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "An array of task IDs that must be completed before this task can start."
              }
            },
            required: ["id", "title", "description", "agent", "dependencies"],
          },
        },
      },
    });

    const rawResponse = response.text.trim();
    let parsedTasks;

    try {
        parsedTasks = JSON.parse(rawResponse);
    } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", rawResponse);
        throw new Error("AI planner returned an invalid data structure. Please try refining your goal.");
    }
    
    if (!Array.isArray(parsedTasks)) {
      throw new Error("AI planner response was valid JSON but not the expected array of tasks.");
    }

    // Validate that the essential properties are there.
    return parsedTasks.map((task: any) => {
        if (!task.id || !task.title || !task.description || !task.agent || !Array.isArray(task.dependencies)) {
            throw new Error("AI planner returned a malformed task object.");
        }
        return task;
    });
  } catch (error) {
    console.error("Error in planTasks service:", error);
    const errorMessage = error instanceof Error ? `AI Planner Error: ${error.message}` : "An unknown error occurred during planning.";
    throw new Error(errorMessage);
  }
};

/**
 * Executes a single task and streams the agent's process.
 * @param task The task to be executed.
 * @param goal The overall mission goal.
 * @param logHistory A history of previous logs for context.
 * @param onChunk Callback for each streamed chunk of text.
 * @returns A promise that resolves when the stream is finished.
 */
export const executeTaskStream = async (
  task: Task,
  goal: string,
  logHistory: LogEntry[],
  onChunk: (chunk: string, agent: string) => void
): Promise<void> => {
  try {
    const historySummary = logHistory
        .slice(-5)
        .map(log => `> ${log.agent} (${log.type}): "${log.content.substring(0, 100)}..."`)
        .join('\n');

    const prompt = `You are the ${task.agent}.
Your current task is: "${task.title}" - ${task.description}.
This is one step in achieving the overall mission goal: "${goal}".
Recent Crew Activity (for context):
${historySummary}

Execute your task. Stream your thought process and actions in Markdown format. Use this structure:
**Thinking:** [Your reasoning and plan. IMPORTANT: Include effort hints in parenthesis, e.g., (heavy compute), (analyzing data), (network request) to show your workload.]
**Action:** [The specific action you are taking. Use markdown code blocks for code.]`;
    
    const responseStream = await ai.models.generateContentStream({
       model: "gemini-2.5-flash",
       contents: prompt,
    });

    for await (const chunk of responseStream) {
      onChunk(chunk.text, task.agent);
    }
  } catch (error) {
    console.error(`Error executing task stream for ${task.agent}:`, error);
    // Let the calling component (App.tsx) handle UI feedback for the error.
    // This prevents duplicate error messages in the log.
    throw error;
  }
};

/**
 * Generates the final, synthesized output based on the entire mission log.
 * @param goal The original user goal.
 * @param logHistory The complete history of all agent actions.
 * @returns A promise that resolves to the final formatted output string.
 */
export const generateFinalOutput = async (goal: string, logHistory: LogEntry[]): Promise<string> => {
    try {
        const historySummary = logHistory
            .map(log => `${log.agent} (${log.type}): ${log.content}`)
            .join('\n---\n');

        const prompt = `You are the Final Output Synthesizer. Your task is to produce the complete, final deliverable that fulfills the user's goal.
User Goal: "${goal}"
Synthesize the information from the execution log into a polished, well-formatted document, code, or report.
Provide ONLY the final product. Do not include any extra commentary, introductions, or summaries.

Execution Log:
${historySummary}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        return response.text;

    } catch (error) {
        console.error("Error generating final output:", error);
        return "Error: Failed to generate the final output. The AI model may have encountered an issue.";
    }
};

/**
 * Generates an image based on a text prompt using the Imagen model.
 * @param prompt The text prompt for the image generation.
 * @returns A promise that resolves to the base64 encoded image data.
 */
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages[0].image.imageBytes;
    } else {
      throw new Error("No image was generated by the model.");
    }
  } catch (error) {
    console.error("Error in generateImage service:", error);
    const errorMessage = error instanceof Error ? `Image Generation Error: ${error.message}` : "An unknown error occurred during image generation.";
    throw new Error(errorMessage);
  }
};
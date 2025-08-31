
import { GoogleGenAI, Type } from "@google/genai";
import { Task, LogEntry } from '../types';
import { AGENT_ROLES } from '../constants';

// This is a placeholder for a real API key, which should be handled securely
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder. App will not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "YOUR_API_KEY_HERE" });

export const planTasks = async (goal: string): Promise<Task[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a master AI project planner for a team of specialized AI agents. Your available agents are: ${AGENT_ROLES.join(', ')}. Given the user's goal: "${goal}", break it down into a sequence of tasks. For each task, specify the most suitable agent to perform it. Return a JSON array of objects, where each object has "title", "description", and "agent" properties. The "agent" must be one of the available agent types. Ensure the response is only the JSON array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              agent: { type: Type.STRING, enum: AGENT_ROLES },
            },
            required: ["title", "description", "agent"],
          },
        },
      },
    });

    const jsonString = response.text.trim();
    const parsedTasks = JSON.parse(jsonString);

    return parsedTasks.map((task: any, index: number) => ({
      ...task,
      id: `task-${index}-${Date.now()}`,
      status: 'pending',
    }));
  } catch (error) {
    console.error("Error planning tasks:", error);
    throw new Error("Failed to plan tasks. The AI model might have returned an unexpected format.");
  }
};

export const executeTaskStream = async (
  task: Task,
  goal: string,
  logHistory: LogEntry[],
  onChunk: (chunk: string, agent: string) => void,
  onComplete: () => void
) => {
  try {
    const historySummary = logHistory
        .slice(-5)
        .map(log => `${log.agent} (${log.type}): ${log.content.substring(0,100)}...`)
        .join('\n');

    const prompt = `
      You are the ${task.agent}.
      The overall project goal is: "${goal}".
      Your current task is: "${task.title} - ${task.description}".
      Previous actions summary for context:
      ${historySummary}

      Now, execute your task. Stream your thought process, actions, and observations in markdown format. 
      Your output must be structured and clear. For any action you take (e.g., searching, writing code), be explicit about it.
      
      Follow this format strictly:
      **Thinking:** Detail your step-by-step plan to tackle the task.
      **Action:** Describe the specific action you are about to perform. If you are using a tool, mention it (e.g., "Action: Searching the web for 'AI agent frameworks'"). For code, wrap it in markdown code blocks with the language identifier.
      **Observation:** State the result or outcome of your action.

      Keep your output concise and focused on the current task. Proceed now.
    `;
    
    const responseStream = await ai.models.generateContentStream({
       model: "gemini-2.5-flash",
       contents: prompt,
       // Disable thinking for faster, lower-latency responses suitable for a real-time UI stream.
       config: { thinkingConfig: { thinkingBudget: 0 } }
    });

    for await (const chunk of responseStream) {
      onChunk(chunk.text, task.agent);
    }
    onComplete();
  } catch (error) {
    console.error("Error executing task stream:", error);
    onChunk(`\n**Error:** Failed to execute task for ${task.agent}. Please check the console for details.`, 'System');
    onComplete();
  }
};


export const generateFinalOutput = async (goal: string, logHistory: LogEntry[]): Promise<string> => {
    try {
        const historySummary = logHistory
            .map(log => `${log.agent} (${log.type}): ${log.content}`)
            .join('\n---\n');

        const prompt = `
            You are the Final Output Generator.
            The original goal was: "${goal}".
            Based on the entire execution log provided below, synthesize all the information and generate the final, complete deliverable.
            The output should be a polished, well-formatted document, code, or report that directly fulfills the user's goal.
            Do not include any of your own commentary, just the final product.

            Execution Log:
            ${historySummary}
        `;

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
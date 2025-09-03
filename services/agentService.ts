import { GoogleGenAI, Type } from "@google/genai";
import { Task, LogEntry } from '../types';
import { AGENT_ROLES } from '../constants';

// The API key is injected from the environment and is assumed to be present.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const planTasks = async (goal: string): Promise<Task[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `As an expert AI project planner, your task is to break down the user's goal into a sequence of tasks for a team of specialized AI agents.
User Goal: "${goal}"
Available Agents: ${AGENT_ROLES.join(', ')}.
The final task should synthesize all previous results into a complete answer.
Your response MUST be a valid JSON array of objects, where each object has "title", "description", and "agent" properties. The "agent" must be one of the available agent types.
Do NOT include any text outside of the JSON array.`,
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

    const rawResponse = response.text.trim();
    // Find the start of the JSON array and the end. This is more robust against the model adding leading/trailing text.
    const startIndex = rawResponse.indexOf('[');
    const endIndex = rawResponse.lastIndexOf(']');

    if (startIndex === -1 || endIndex === -1) {
        throw new Error("AI response did not contain a valid JSON array.");
    }

    const jsonString = rawResponse.substring(startIndex, endIndex + 1);
    const parsedTasks = JSON.parse(jsonString);

    if (!Array.isArray(parsedTasks)) {
      throw new Error("AI response was valid JSON but not an array of tasks.");
    }

    return parsedTasks.map((task: any, index: number) => ({
      ...task,
      id: `task-${index}-${Date.now()}`,
      status: 'pending',
    }));
  } catch (error) {
    console.error("Error planning tasks:", error);
    const errorMessage = error instanceof Error ? `AI Planner Error: ${error.message}` : "An unknown error occurred during planning.";
    throw new Error(errorMessage);
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
      You are agent: ${task.agent}.
      Overall Goal: "${goal}".
      Your Current Task: "${task.title} - ${task.description}".
      Recent Activity:
      ${historySummary}

      Execute your task. Stream your process in markdown, following this strict format:
      **Thinking:** Your step-by-step plan.
      **Action:** The specific action you are taking. For code, use markdown code blocks.
      **Observation:** The result of your action.
      
      Proceed now.
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
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during execution.";
    onChunk(`\n**Error:** Failed to execute task for ${task.agent}. Reason: ${errorMessage}`, 'System');
    throw error;
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
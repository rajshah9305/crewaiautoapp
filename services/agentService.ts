import { GoogleGenAI, Type } from "@google/genai";
import { Task, LogEntry } from '../types';
import { AGENT_ROLES } from '../constants';

// The API key is injected from the environment and is assumed to be present.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const planTasks = async (goal: string): Promise<Task[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a master AI project planner for a team of specialized AI agents. Your available agents are: ${AGENT_ROLES.join(', ')}. Given the user's goal: "${goal}", break it down into a comprehensive, logical sequence of tasks. For each task, specify the most suitable agent to perform it. The final task should typically involve synthesizing the results into a complete answer. Return a JSON array of objects, where each object has "title", "description", and "agent" properties. The "agent" must be one of the available agent types. Ensure the response is only the JSON array.`,
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
      
      Your output MUST strictly follow this markdown format, with no exceptions:
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
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { constructPrompt } from "~/lib/utils";
import { initializeModel } from "~/lib/openai";

export async function generateContentOutline(transcript: string) {
  const chatModel = await initializeModel({
    openAIApiKey: process.env.OPEN_AI_API_KEY ?? "",
    model: process.env.OPEN_AI_MODEL ?? "gpt-4",
    temp: parseFloat(process.env.OPEN_AI_TEMPERATURE ?? "0.7"),
  });

  const INITIAL_PROMPT =
    "You are a content strategist tasked with creating a detailed outline for a course or blog post based on a given transcript.";

  const INSTRUCTIONS =
    "Generate a structured outline with main topics, subtopics, and key points. Include an introduction and conclusion.";

  const prompt = constructPrompt(transcript, INITIAL_PROMPT, INSTRUCTIONS);

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", INITIAL_PROMPT],
    ["user", "{input}"],
  ]);

  const chain = promptTemplate.pipe(chatModel);
  const result = await chain.invoke({ input: prompt });

  return result.content;
}

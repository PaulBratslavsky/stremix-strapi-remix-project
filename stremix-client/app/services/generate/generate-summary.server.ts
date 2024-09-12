import { ChatPromptTemplate } from "@langchain/core/prompts";
import { constructPrompt } from "~/lib/utils";
import { initializeModel } from "~/lib/openai";

export async function generateSummary(transcript: string) {
  const chatModel = await initializeModel({
    openAIApiKey: process.env.OPEN_AI_API_KEY ?? "",
    model: process.env.OPEN_AI_MODEL ?? "gpt-4-0125-preview",
    temp: parseFloat(process.env.OPEN_AI_TEMPERATURE ?? "0.7"),
  });

  const INITIAL_PROMPT =
    "You are an AI assistant tasked with creating a concise summary of a YouTube video based on its transcript.";

  const INSTRUCTIONS =
    "Provide a brief overview of the main topics covered in the video. Highlight key points and insights. Keep the summary clear and informative.";

  const prompt = constructPrompt(transcript, INITIAL_PROMPT, INSTRUCTIONS);

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", INITIAL_PROMPT],
    ["user", "{input}"],
  ]);

  const chain = promptTemplate.pipe(chatModel);
  const result = await chain.invoke({ input: prompt });

  return result.content;
}

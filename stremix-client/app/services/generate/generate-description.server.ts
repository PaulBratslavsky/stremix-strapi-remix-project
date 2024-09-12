import { ChatPromptTemplate } from "@langchain/core/prompts";
import { constructPrompt } from "~/lib/utils";
import { initializeModel } from "~/lib/openai";

export async function generateDescription(transcript: string) {

  const chatModel = await initializeModel({
    openAIApiKey: process.env.OPEN_AI_API_KEY ?? "",
    model: process.env.OPEN_AI_MODEL ?? "gpt-4o-mini",
    temp: parseFloat(process.env.OPEN_AI_TEMPERATURE ?? "0.7"),
  });

  const INITIAL_PROMPT =
    "You are a SEO expert and you are tasked to create a youtube video description and a title based on the transcript of a youtube video.";

  const INSTRUCTIONS =
    "write in first person and outline key points and benefits";

  const prompt = constructPrompt(transcript, INITIAL_PROMPT, INSTRUCTIONS);

  const promptTemplate = ChatPromptTemplate.fromMessages([
    [
      "system",
      INITIAL_PROMPT,
    ],
    ["user", "{input}"],
  ]);

  const chain = promptTemplate.pipe(chatModel);
  const result = await chain.invoke({ input: prompt });

  return result.content;
}

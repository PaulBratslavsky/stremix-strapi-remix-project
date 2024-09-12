import { ChatPromptTemplate } from "@langchain/core/prompts";
import { constructPrompt } from "~/lib/utils";
import { initializeModel } from "~/lib/openai";


export async function generateBlogPost(transcript: string) {
  const chatModel = await initializeModel({
    openAIApiKey: process.env.OPEN_AI_API_KEY ?? "",
    model: process.env.OPEN_AI_MODEL ?? "gpt-4o-mini",
    temp: parseFloat(process.env.OPEN_AI_TEMPERATURE ?? "0.7"),
  });

  const INITIAL_PROMPT =
    "You are a professional content writer tasked with creating an engaging and informative blog post based on a provided transcript.";

  const INSTRUCTIONS =
    "Write a well-structured blog post based on the given transcript. Include an introduction, main body with subheadings, and a conclusion. Ensure the blog post accurately reflects the content and key points from the transcript.";

  const prompt = constructPrompt(transcript, INITIAL_PROMPT, INSTRUCTIONS);

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", INITIAL_PROMPT],
    ["user", "{input}"],
  ]);

  const chain = promptTemplate.pipe(chatModel);
  const result = await chain.invoke({ input: prompt });

  return result.content;
}

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { TokenTextSplitter } from "@langchain/textsplitters";
import { initializeModel } from "~/lib/openai";

async function processTextChunks(chunks: string[], model: ChatOpenAI) {
  const punctuationPrompt = PromptTemplate.fromTemplate(
    "Add proper punctuation and capitalization to the following text chunk:\n\n{chunk}"
  );
  const punctuationChain = punctuationPrompt.pipe(model);

  const processedChunks = await Promise.all(
    chunks.map(async (chunk) => {
      const result = await punctuationChain.invoke({ chunk });
      return result.content as string;
    })
  );

  return processedChunks.join(" ");
}

export async function generateModifiedTranscript (rawTranscript: string) {
  const chatModel = await initializeModel({
    openAIApiKey: process.env.OPEN_AI_API_KEY ?? "",
    model: process.env.OPEN_AI_MODEL ?? "gpt-4",
    temp: parseFloat(process.env.OPEN_AI_TEMPERATURE ?? "0.7"),
  });

  const splitter = new TokenTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const transcriptChunks = await splitter.createDocuments([rawTranscript]);
  const chunkTexts = transcriptChunks.map(chunk => chunk.pageContent);
  const modifiedTranscript = await processTextChunks(chunkTexts, chatModel);

  return modifiedTranscript;
}

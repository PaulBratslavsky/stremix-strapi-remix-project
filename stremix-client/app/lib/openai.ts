import { ChatOpenAI } from "@langchain/openai";

interface InitializeModelProps {
  openAIApiKey: string;
  model: string;
  temp: number;
  maxTokens?: number;
}

export async function initializeModel({
  openAIApiKey,
  model,
  temp,
}: InitializeModelProps) {
  return new ChatOpenAI({
    temperature: temp,
    openAIApiKey: openAIApiKey,
    modelName: model,
    maxTokens: 1000,
  });
}
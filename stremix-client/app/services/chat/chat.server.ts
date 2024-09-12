import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { initializeModel } from "~/lib/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Document } from "langchain/document";
import { BaseLanguageModel } from "@langchain/core/language_models/base";
import { VectorStore } from "@langchain/core/vectorstores";

interface ChatResponse {
  answer: string;
  sourceDocuments: Document[];
}

async function chatWithData(
  query: string,
  model: BaseLanguageModel,
  vectorStore: VectorStore
): Promise<ChatResponse> {
  try {
    const prompt =
      ChatPromptTemplate.fromTemplate(`Answer the following question based on the context:

Context: {context}
Question: {input}

Answer:`);

    const documentChain = await createStuffDocumentsChain({
      llm: model,
      prompt,
    });

    const retrievalChain = await createRetrievalChain({
      combineDocsChain: documentChain,
      retriever: vectorStore.asRetriever(),
    });

    const response = await retrievalChain.invoke({
      input: query,
    });

    return {
      answer: response.answer,
      sourceDocuments: response.context,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function splitText(text: string, videoId: string): Promise<Document[]> {
  const splitter = new CharacterTextSplitter({
    separator: " ",
    chunkSize: 4000,
    chunkOverlap: 200,
  });

  const texts = [text];
  const metadata = {
    documentId: videoId,
  };

  const documents = await splitter.createDocuments(texts, [], {
    chunkHeader: `VIDEO ID: ${videoId}\n\n---\n\n`,
    appendChunkOverlapHeader: true,
  });

  const withMeta = documents.map((document, index) => {
    return {
      ...document,
      metadata: { ...metadata, documentCount: index },
    };
  });

  return withMeta;
}

export const chat = async (
  videoId: string,
  query: string,
  transcript: string
): Promise<ChatResponse> => {
  
  const chatConfig = await initializeModel({
    openAIApiKey: process.env.OPEN_AI_API_KEY ?? "",
    model: process.env.OPEN_AI_MODEL ?? "gpt-4o-mini",
    temp: parseFloat(process.env.OPEN_AI_TEMPERATURE ?? "0.7"),
  });

  const embeddingsConfig = {
    openAIApiKey: process.env.OPEN_AI_API_KEY ?? "",
    model: "text-embedding-ada-002",
    maxTokens: 8000,
  };

  const embeddings = new OpenAIEmbeddings(embeddingsConfig);
  const llm = new ChatOpenAI(chatConfig);

  const processed = await splitText(transcript, videoId);

  const vectorStore = await MemoryVectorStore.fromDocuments(
    processed,
    embeddings
  );

  const response = await chatWithData(query, llm, vectorStore);
  return response;
};

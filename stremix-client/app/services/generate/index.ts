import { generateDescription } from "./generate-description.server";
import { generateSummary } from "./generate-summary.server";
import { generateBlogPost } from "./generate-blogpost.server";
import { generateContentOutline } from "./generate-outline.server";
import { generateModifiedTranscript } from "./generate-modified-transcript.server";

interface GenerateContentProps {
  type: "summary" | "description" | "blogpost" | "outline" | "modifiedTranscript";
  transcript: string;
}

export async function generateContent({
  type,
  transcript,
}: GenerateContentProps) {
  switch (type) {
    case "description":
      return await generateDescription(transcript);
    case "blogpost":
      return await generateBlogPost(transcript);
    case "outline":
      return await generateContentOutline(transcript);
    case "modifiedTranscript":
      return await generateModifiedTranscript(transcript);
    default:
      return await generateSummary(transcript);
  }
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "react-hot-toast";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractYouTubeID(urlOrID: string): string | null {
  // Regular expression for YouTube ID format
  const regExpID = /^[a-zA-Z0-9_-]{11}$/;

  // Check if the input is a YouTube ID
  if (regExpID.test(urlOrID)) {
      return urlOrID;
  }

  // Regular expression for standard YouTube links
  const regExpStandard = /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;

  // Regular expression for YouTube Shorts links
  const regExpShorts = /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/;

  // Check for standard YouTube link
  const matchStandard = urlOrID.match(regExpStandard);
  if (matchStandard) {
      return matchStandard[1];
  }

  // Check for YouTube Shorts link
  const matchShorts = urlOrID.match(regExpShorts);
  if (matchShorts) {
      return matchShorts[1];
  }

  // Return null if no match is found
  return null;
}

export function renderMessage(message: string, type: string) {
  if (type === "success") toast.success(message);
  if (type === "error") toast.error(message);
  if (type === "loading") toast.loading(message);
  if (type === "info") toast(message);
  if (!type) toast(message);
}

export function constructPrompt(
  transcript: string,
  prompt: string,
  instructions: string
): string {
  return `
    <initial_prompt>
    ${prompt}
    </initial_prompt>

    <instructions>
    ${instructions}
    </instructions>

    <transcript>
    ${transcript}
    </transcript>
  `.trim();
}

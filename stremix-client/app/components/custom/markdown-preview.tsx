import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "~/lib/utils";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export const MarkdownPreview = forwardRef<HTMLDivElement, MarkdownPreviewProps>(
  ({ content, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "p-2 relative w-full h-full overflow-auto scroll-smooth bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-300 dark:border-gray-700",
          className
        )}
        id="markdown-preview"
      >
        <div className="p-4 prose dark:prose-invert max-w-none absolute top-0 left-0 w-full h-full">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    );
  }
);

MarkdownPreview.displayName = "MarkdownPreview";

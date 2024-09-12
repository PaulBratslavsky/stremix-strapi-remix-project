import { useState, useRef, useEffect } from "react";
import { SendIcon, SaveIcon } from "lucide-react";
import { LoaderFunctionArgs, json, ActionFunctionArgs } from "@remix-run/node";
import { dataAPI } from "~/lib/data-api";
import { chat } from "~/services/chat/chat.server";
import { generateContent } from "~/services/generate";
import { saveUpdateNote } from "~/services/note/save-update-note";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import {
  useLoaderData,
  isRouteErrorResponse,
  useRouteError,
  useFetcher,
} from "@remix-run/react";

import { YouTubePlayer } from "~/components/custom/youtube-player";
import { TextareaCustom } from "~/components/custom/textarea-custom";
import { ResizableLayout } from "~/components/custom/resizable-layout";
import { MarkdownPreview } from "~/components/custom/markdown-preview";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action") as string;
  const videoId = formData.get("videoId") as string;
  const transcript = formData.get("transcript") as string;
  const query = formData.get("query") as string;
  const type = formData.get("type") as "summary" | "description" | "blogpost" | "outline" | "chat";


  switch (action) {
    case "query":
      return handleQuery(type, videoId, query, transcript);
    case "save":
      return handleSave(formData);
    default:
      return json({ videoId });
  }
}

async function handleQuery(type: string, videoId: string, query: string, transcript: string) {
  if (type === "chat") {
    const response = await chat(videoId, query, transcript);
    return json({ data: response?.answer, type: "content", message: "Updated!" });
  } else {
    const content = await generateContent({ type: type as "summary" | "description" | "blogpost" | "outline" | "modifiedTranscript", transcript });
    return json({ data: content, type: "content", message: "Updated!" });
  }
}

async function handleSave(formData: FormData) {
  const note = await saveUpdateNote(formData);
  const documentId = note.data.documentId;
  return json({ data: documentId, type: "note", message: "Note Created!" });
}

// Remix Route
export async function loader({ params }: LoaderFunctionArgs) {
  const { videoId } = params;

  const transcript = await dataAPI(
    `http://localhost:1338/api/videos?filters[videoId][$eq]=${videoId}`,
    { method: "GET" }
  );

  if (!transcript?.data?.length) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json({ videoId, transcript });
}

export default function VideosByIdRoute() {
  const { transcript } = useLoaderData<typeof loader>();
  const item = transcript.data[0];

  const [note, setNote] = useState("");
  const [noteDocumentId, setNoteDocumentId] = useState<string | null>(null);
  const noteTextareaRef = useRef<HTMLTextAreaElement>(null);
  const markdownPreviewRef = useRef<HTMLDivElement>(null);

  const fetcher = useFetcher();

  const isSubmitting = fetcher.formData?.get("_action") === "query";
  const isSaving = fetcher.formData?.get("_action") === "save";

  const [selectedType, setSelectedType] = useState("summary");

  useEffect(() => {
    if (
      fetcher.data &&
      typeof fetcher.data === "object" &&
      "data" in fetcher.data &&
      "type" in fetcher.data
    ) {
      const responseData = fetcher.data as { data?: string; type?: string };
      if (responseData.type === "content" && typeof responseData.data === "string") {
        setNote(
          (prevNote) => prevNote + (prevNote ? "\n\n" : "") + responseData.data
        );

        // Use setTimeout to ensure the DOM has updated
        setTimeout(() => {
          if (noteTextareaRef.current) {
            noteTextareaRef.current.scrollTop =
              noteTextareaRef.current.scrollHeight;
          }
          if (markdownPreviewRef.current) {
            markdownPreviewRef.current.scrollTop =
              markdownPreviewRef.current.scrollHeight;
          }
        }, 0);
      } else if (responseData.type === "note" && typeof responseData.data === "string") {
        setNoteDocumentId(responseData.data);
      }
    }
  }, [fetcher.data]);

  const getButtonText = (isSubmitting: boolean, selectedType: string) => {
    if (isSubmitting)
      return selectedType === "chat" ? "Sending..." : "Generating...";
    return selectedType === "chat" ? "Send" : "Generate";
  };

  const getSaveButtonText = (isSaving: boolean, noteDocumentId: string | null) => {
    if (isSaving) return "Saving...";
    return noteDocumentId ? "Update Note" : "Save Note";
  };

  return (
    <ResizableLayout width={[45, 55]} key={item.id}>
      <div className="flex flex-col h-full m-4">
        <YouTubePlayer playerKey={item.id} id={item.videoId} />
        <TextareaCustom
          name="description"
          className="flex-grow mt-4"
          defaultValue={item.modifiedTranscript}
          disabled
        />
      </div>
      <div className="p-2 flex flex-col h-full gap-2">
        <fetcher.Form method="POST">
          <fieldset disabled={isSubmitting} className="space-y-2">
            <input type="hidden" name="videoId" defaultValue={item.videoId} />
            <input
              type="hidden"
              name="transcript"
              defaultValue={item.transcript}
            />
            <div className="flex items-center gap-2">
              <Select
                name="type"
                value={selectedType}
                onValueChange={(value) => setSelectedType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chat">Chat</SelectItem>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="description">Description</SelectItem>
                  <SelectItem value="blogpost">Blogpost</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="submit"
                name="_action"
                disabled={isSubmitting}
                value="query"
              >
                <SendIcon className="h-4 w-4 mr-2" />
                {getButtonText(isSubmitting, selectedType)}
              </Button>
            </div>
            {selectedType === "chat" && (
              <Textarea
                placeholder="Ask a question..."
                name="query"
                className="h-32"
                key={note}
              />
            )}
          </fieldset>
        </fetcher.Form>
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="preview" className="flex flex-col h-full gap-2">
            <TabsContent value="preview" className="flex-1">
              <MarkdownPreview
                ref={markdownPreviewRef}
                content={note}
                className="overflow-auto"
              />
            </TabsContent>
            <TabsContent value="markdown" className="flex-1">
              <Textarea
                ref={noteTextareaRef}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Your notes will appear here..."
                className="w-full h-full resize-none overflow-auto scroll-smooth"
              />
            </TabsContent>

            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="markdown">Edit Markdown</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="space-y-2">
          <fetcher.Form method="POST">
            <Button name="_action" className="w-full" value="save">
              <input
                type="hidden"
                name="videoDocumentId"
                defaultValue={item.documentId}
              />
              <input type="hidden" name="noteContent" defaultValue={note} />
              <input type="hidden" name="noteDocumentId" defaultValue={noteDocumentId ?? ""} />

              <SaveIcon className="h-4 w-4 mr-2" />
              {getSaveButtonText(isSaving, noteDocumentId)}
            </Button>
          </fetcher.Form>
        </div>
      </div>
    </ResizableLayout>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

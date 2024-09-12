import { NavLink } from "@remix-run/react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

interface VideoDataProps {
  id: number;
  documentId: string;
  videoId: string;
  transcript: string;
  modifiedTranscript: string;
  createdAt: string;
  publishedAt: string;
}

interface NotesListViewProps {
  data: VideoDataProps[];
}

export function NotesListView({ data }: Readonly<NotesListViewProps>) {
  return (
    <div className="w-full h-full flex flex-col">
      <ScrollArea className="flex-grow">
        <div>
          {data.map((item) => {
            const isActiveStyle = "bg-secondary";
            const linkStyle =
              "block p-4 mb-2 transition-all duration-200 hover:bg-secondary";
            const { documentId, videoId } = item;
            console.log(documentId);
            return (
              <NavLink
                key={documentId}
                to={videoId}
                className={({ isActive }) => {
                  return cn(linkStyle, isActive && isActiveStyle);
                }}
              >
                <h3 className="text-lg font-semibold text-primary mb-1">
                  Video ID: {item.videoId}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.modifiedTranscript.slice(0, 65)}
                </p>
              </NavLink>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

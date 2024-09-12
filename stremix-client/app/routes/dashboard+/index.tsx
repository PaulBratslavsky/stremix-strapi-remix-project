// React and Remix
import { useEffect } from "react";
import { redirect } from "@remix-run/node";
import {
  type MetaFunction,
  type ActionFunctionArgs,
  json,
  TypedResponse,
} from "@remix-run/node";

import {
  Form,
  useActionData,
  useNavigation,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

// Services
import {
  getNewTranscript,
  findExistingTranscript,
  saveTranscript,
} from "~/services/transcript";
import { generateContent } from "~/services/generate";

// Utils
import { extractYouTubeID, renderMessage } from "~/lib/utils";

// Components
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

// Page meta data
export const meta: MetaFunction = () => [
  { title: "YouTube Description Generator" },
  {
    name: "description",
    content: "Generate and save YouTube video descriptions",
  },
];

// Add this interface definition
interface ActionResponse {
  error: boolean;
  message: string;
  data?: {
    videoId: string;
    transcript: string;
    modifiedTranscript: string;
  };
}

// Update the action function signature
export async function action({
  request,
}: ActionFunctionArgs): Promise<TypedResponse<ActionResponse>> {
  const formData = await request.formData();
  const formItems = Object.fromEntries(formData);
  const videoId = extractYouTubeID(formItems.videoId as string);

  if (!videoId) return json({ error: true, message: "Invalid video ID" });

  const possibleTranscript = await findExistingTranscript(videoId);
  const ifTranscriptExists = possibleTranscript?.data?.length > 0;

  if (ifTranscriptExists) throw redirect(`/dashboard/transcripts/${videoId}`);

  switch (formItems._action) {
    case "generate": {
      const transcript = await getNewTranscript(videoId);

      if (!transcript)
        return json({ error: true, message: "Failed to fetch transcript" });

      const content = await generateContent({
        type: "modifiedTranscript",
        transcript,
      });

      return json({
        error: false,
        message: "Transcript generated!",
        data: {
          videoId,
          transcript,
          modifiedTranscript: content as string,
        },
      });
    }
    case "save":
      await saveTranscript(formData);
      throw redirect(`/dashboard/transcripts/${videoId}`);
    default:
      return json({ message: "No action found!", error: true });
  }
}

export default function DashboardIndexRoute() {
  const formActionData = useActionData<typeof action>();

  useEffect(() => {
    if (formActionData) {
      renderMessage(
        formActionData.message,
        formActionData.error ? "error" : "success"
      );
    }

  }, [formActionData]);


  return (
    <div className="container mx-auto">
      <div key={formActionData?.data?.videoId} className="flex flex-col gap-4">
        <GenerateForm />
        <SaveDescriptionForm data={formActionData?.data} />
      </div>
    </div>
  );
}

function GenerateForm() {
  const navigation = useNavigation();
  const isSubmitting = navigation.formData?.get("_action") === "generate";

  return (
    <Form method="POST">
      <fieldset
        disabled={isSubmitting}
        className="flex gap-2 items-center justify-center my-4"
      >
        <Input
          name="videoId"
          placeholder="Youtube Video ID or URL"
          className="w-full"
          required
        />

        <Button name="_action" value="generate" type="submit">
          {isSubmitting ? "Generating..." : "Generate"}
        </Button>
      </fieldset>
    </Form>
  );
}

function SaveDescriptionForm({
  data,
}: {
  readonly data?: {
    videoId: string;
    transcript: string;
    modifiedTranscript: string;
  };
}) {
  const navigation = useNavigation();
  const isSubmitting = navigation.formData?.get("_action") === "save";

  if (!data) return null;

  return (
    <Form method="POST" className="w-full m-4">
      <fieldset disabled={isSubmitting}>
        <input type="hidden" name="videoId" defaultValue={data.videoId} />
        <input type="hidden" name="transcript" defaultValue={data.transcript} />
        <Textarea
          name="modifiedTranscript"
          className="w-full h-[400px]"
          defaultValue={data.modifiedTranscript}
        />

        <Button
          name="_action"
          value="save"
          className="float-right my-2"
          type="submit"
        >
          {isSubmitting ? "Saving..." : "Save Transcript"}
        </Button>
      </fieldset>
    </Form>
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

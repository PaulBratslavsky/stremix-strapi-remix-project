// React and Remix
import { Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { dataAPI } from "~/lib/data-api";

export async function loader() {
  const BASE_URL = process.env.BASE_URL || "http://localhost:1338";
  const path = "/api/videos";
  const url = new URL(path, BASE_URL);

  const data = await dataAPI(url.href, { method: "GET" });
  // console.log(data);
  return json({ ...data });
}

// Components
import { ResizableLayout } from "~/components/custom/resizable-layout";
import { NotesListView } from "~/components/custom/notes-list-view";

// Remix Route
export default function VideosRoute() {
  const { data } = useLoaderData<typeof loader>();
  console.log(data);
  return (
    <ResizableLayout width={[20, 80]}>
      <NotesListView data={data} />
      <Outlet />
    </ResizableLayout>
  );
}

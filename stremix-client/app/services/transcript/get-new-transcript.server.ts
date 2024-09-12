import { dataAPI } from "~/lib/data-api";

export async function getNewTranscript(id: string) {
  const BASE_URL = "https://deserving-harmony-9f5ca04daf.strapiapp.com";
  const path = "utilai/yt-transcript/" + id;
  const url = new URL(path, BASE_URL);

  const data = await dataAPI(url.href, { method: "GET" });
  return data;
}

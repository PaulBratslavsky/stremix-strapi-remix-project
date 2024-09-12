import qs from "qs";
import { dataAPI } from "~/lib/data-api";

export async function findExistingTranscript(id: string) {
  const BASE_URL = "http://localhost:1338";
  const path = "api/videos";
  const url = new URL(path, BASE_URL);

  url.search = qs.stringify({
    filters: {
      videoId: {
        $eq: id,
      },
    },
  });

  console.log("########################## ");
  console.log("url.href", url.href);
  console.log("########################## ");

  const data = await dataAPI(url.href, { method: "GET" });
  return data;
}

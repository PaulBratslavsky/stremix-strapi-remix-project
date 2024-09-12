import { dataAPI } from "~/lib/data-api"; // Assuming this is the correct import path

export async function saveDescription(formData: FormData) {
  const BASE_URL = "http://localhost:1338";
  const path = "/api/videos";
  const url = new URL(BASE_URL + path);

  const videoId = formData.get("videoId") as string;
  const transcript = formData.get("transcript") as string;
  const content = formData.get("content") as string;
  const type = formData.get("type") as string;

  const payload = {
    data: {
      videoId,
      transcript,
      content,
      type
    },
  };

  // console.log(payload);

  try {
    const data = await dataAPI(url.href, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    console.log(data);

    return data;
  } catch (error) {
    console.error("Error saving description:", error);
    throw error;
  }
}

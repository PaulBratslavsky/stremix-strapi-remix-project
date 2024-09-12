import { dataAPI } from "~/lib/data-api"; // Assuming this is the correct import path

export async function saveUpdateNote(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const { videoDocumentId, noteDocumentId, noteContent } = data;

  if (noteDocumentId) {
    return updateNote(noteDocumentId as string, noteContent as string);
  } else {
    return createNote(videoDocumentId as string, noteContent as string);
  }
}

async function updateNote(noteDocumentId: string, noteContent: string) {
  const BASE_URL = "http://localhost:1338";
  const path = "/api/notes/" + noteDocumentId;
  const url = new URL(BASE_URL + path);

  const payload = {
    data: {
      content: noteContent,
    },
  };

  try {
    const data = await dataAPI(url.href, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return data;
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
}

async function createNote(videoDocumentId: string, noteContent: string) {
  const BASE_URL = "http://localhost:1338";
  const path = "/api/notes";
  const url = new URL(BASE_URL + path);

  const payload = {
    data: {
      title: "Note Title: " + new Date().toISOString(),
      content: noteContent,
      video: {
        connect: [videoDocumentId],
      },
    },
  };

  try {
    const data = await dataAPI(url.href, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
}

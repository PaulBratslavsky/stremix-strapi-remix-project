export async function dataAPI(
  url: string,
  options: {
    method: "GET" | "POST" | "PUT" | "DELETE";
    authToken?: string;
    body?: BodyInit | Record<string, unknown> | null;
  }
) {
  const { method, authToken, body } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  };

  const processBody = (body: BodyInit | Record<string, unknown> | null | undefined): BodyInit | undefined => {
    if (body instanceof FormData) return body;
    if (typeof body === 'object' && body !== null) return JSON.stringify(body);
    if (body) return body as BodyInit;
    return undefined;
  };

  const processedBody = processBody(body);

  const fetchOptions: RequestInit = {
    method,
    headers,
    body: processedBody,
  };

  try {
    const response = await fetch(url, fetchOptions);
    
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return await response.json();
    } else if (contentType?.includes("text/plain")) {
      return await response.text();
    } else {
      return { status: response.status, statusText: response.statusText };
    }
  } catch (error) {
    console.error(`Error ${method} data:`, error);
    throw error;
  }
}







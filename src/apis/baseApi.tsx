import { getSettings } from "../ultilies/helper"


type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

interface APIOptions {
  method: HTTPMethod;
  data?: any;
  contentType?: string;
  formData?: any;
}

export async function callAPIVirusTotal(url: string, { method, data, contentType }: APIOptions) {
  const settings = await getSettings();
  const { apikey } = settings;

  if (!apikey || !apikey.trim()) {
    console.log("APIKey is null");
    return null;
  }

  const headers: HeadersInit = {
    Accept: "application/json",
    "x-apikey": apikey,
  };

  let body: BodyInit | undefined = undefined;
  
  if (method !== "GET") {
    if (contentType === "application/json") {
      headers["Content-Type"] = contentType;
      body = JSON.stringify(data);
    } else if (contentType === "application/x-www-form-urlencoded") {
      headers["Content-Type"] = contentType;
      body = new URLSearchParams(data).toString();
    } else if (contentType === "multipart/form-data" && data instanceof FormData) {
      body = data;
    } else {
      body = data; // fallback for other content types
    }
  }

  const options: RequestInit = {
    method,
    headers,
    body,
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (err) {
    console.error("API call failed:", err);
    return null;
  }
}

import fetch from "node-fetch";

export async function downloadImage(url: string): Promise<ArrayBuffer> {
  const imageRes = await fetch(url);
  const imageData = await imageRes.arrayBuffer();
  return imageData;
}

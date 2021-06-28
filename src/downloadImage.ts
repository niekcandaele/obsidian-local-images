import got from "got";

/**
 * Downloads the image
 * We use got here, a library that only supports node
 * This is to get around a limitation of Electron blocking CORS requests with node-fetch
 * @param url The HTTP URL to the image
 * @returns
 */

export async function downloadImage(url: string): Promise<ArrayBuffer> {
  const res = await got(url, { responseType: "buffer" });
  return res.body;
}

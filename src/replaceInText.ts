import { sanitizeUrlToFileName } from "./sanitizeUrlToFileName";

/**
 * @param content The full text body to search
 * @param toReplace Search string, this is what will be replaced
 * @param url The HTTP url to the image source
 * @param path The local filepath to the new image
 */
export function replaceInText(
  content: string,
  toReplace: string,
  url: string,
  path: string
) {
  const newLink = `![Original source: ${url}](${path})`;
  return content.split(toReplace).join(newLink);
}

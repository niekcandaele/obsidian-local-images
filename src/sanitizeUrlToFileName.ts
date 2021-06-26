// File names cannot contain / or \
// So we try to get the image name from the last part of the url
export function sanitizeUrlToFileName(url: string) {
  return url.split("/").pop().split("\\").pop();
}

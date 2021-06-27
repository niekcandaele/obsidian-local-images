// File names cannot contain / or \
// And other characters get escaped weirdly, which can mess with the file path linking
// So we try to get the image name from the last part of the url
export function sanitizeUrlToFileName(url: string) {
  const extension = url.split(".").pop();
  return (
    url
      .split("/")
      .pop()
      .split("\\")
      .pop()
      .replace(/[\W_]+/g, "")
      // Make sure we keep the proper extension
      .replace(extension, `.${extension}`)
  );
}

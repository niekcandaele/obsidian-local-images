import type LocalImagesPlugin from "./main";

export async function tryCreateFolder(plugin: LocalImagesPlugin, path: string) {
  try {
    await plugin.app.vault.createFolder(path);
  } catch (error) {
    if (!error.message.contains("Folder already exists")) {
      throw error;
    }
  }
}

import type { App, TFile } from "obsidian";
import { downloadImage } from "./downloadImage";
import type LocalImagesPlugin from "./main";
import { replaceInText } from "./replaceInText";
import { sanitizeUrlToFileName } from "./sanitizeUrlToFileName";
import { saveFile } from "./saveFile";

const mdImageRegex =
  /!\[[^\]]*\]\((?<filename>.*?)(?=\"|\))(?<optionalpart>\".*\")?\)/g;

export async function run(plugin: LocalImagesPlugin, file: TFile) {
  let fileContent = await plugin.app.vault.read(file);
  const matches: IterableIterator<RegExpMatchArray> =
    // We disable the error so type checking doesnt work in the next line
    // However, by declaring the proper type above, we have type safety in the rest of the code
    // @ts-expect-error This uses the shim for matchall
    fileContent.matchAll(mdImageRegex);
  const filePath = plugin.app.fileManager.getNewFileParent(file.path);
  const imgFolderPath = `${filePath.path === "/" ? "" : filePath.path}/img`;
  try {
    await plugin.app.vault.createFolder(imgFolderPath);
  } catch (error) {
    if (!error.message.contains("Folder already exists")) {
      throw error;
    }
  }

  for (const match of matches) {
    // Ignore any links that are a different protocol than http (for now..)
    if (!/^http/.test(match.groups.filename)) {
      continue;
    }
    const filePath = `${imgFolderPath}/${sanitizeUrlToFileName(
      match.groups.filename
    )}`;

    const imgData = await downloadImage(match.groups.filename);
    await saveFile(plugin.app, filePath, imgData);
    fileContent = replaceInText(
      fileContent,
      match[0],
      match.groups.filename,
      filePath
    );
  }
  await plugin.app.vault.modify(file, fileContent);
}

export async function runAll(plugin: LocalImagesPlugin) {
  const files = plugin.app.vault.getMarkdownFiles();
  const includeRegex = new RegExp(plugin.settings.include, "i");

  for (const file of files) {
    if (file.path.match(includeRegex)) {
      await run(plugin, file);
    }
  }
}

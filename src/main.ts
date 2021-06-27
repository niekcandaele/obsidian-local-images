import {
  App,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  TFile,
  TFolder,
} from "obsidian";
import { sanitizeUrlToFileName } from "./sanitizeUrlToFileName";
import { replaceInText } from "./replaceInText";
import { shim } from "string.prototype.matchall";
import { run, runAll } from "./run";
import safeRegex from "safe-regex";

shim();

export interface ISettings {
  include: string;
}

const DEFAULT_SETTINGS: ISettings = {
  include: "*.md",
};

export default class LocalImagesPlugin extends Plugin {
  settings: ISettings;

  async onload() {
    console.log("loading plugin");

    await this.loadSettings();

    this.addStatusBarItem().setText("Status Bar Text");

    this.addCommand({
      id: "download-images-all",
      name: "Download images locally for all your notes",
      callback: async () => {
        try {
          await runAll(this);
        } catch (error) {
          this.displayError(error);
        }
      },
    });

    this.addCommand({
      id: "download-images",
      name: "Download images locally",
      callback: async () => {
        const currentFile = this.app.workspace.getActiveFile();

        if (!currentFile) {
          return this.displayError("Please select a file first");
        }

        await run(this, currentFile);
      },
    });

    this.addSettingTab(new SampleSettingTab(this.app, this));
  }
  displayError(error: Error | string, file?: TFile): void {
    if (file) {
      new Notice(
        `LocalImages: Error while handling file ${
          file.name
        }, ${error.toString()}`
      );
    } else {
      new Notice(error.toString());
    }

    console.error(`LocalImages: error: ${error}`);
  }

  onunload() {
    console.log("unloading plugin");
  }

  async loadSettings() {
    console.log("loading settings");

    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    console.log("saving settings");

    try {
      await this.saveData(this.settings);
    } catch (error) {
      this.displayError(error);
    }
  }
}

class SampleModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  onOpen() {
    let { contentEl } = this;
    contentEl.setText("Woah!");
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}

class SampleSettingTab extends PluginSettingTab {
  plugin: LocalImagesPlugin;

  constructor(app: App, plugin: LocalImagesPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Local images" });

    new Setting(containerEl)
      .setName("Include")
      .setDesc(
        "Include only files matching this regex pattern when running on all notes."
      )
      .addText((text) =>
        text.setValue(this.plugin.settings.include).onChange(async (value) => {
          if (!safeRegex(value)) {
            this.plugin.displayError(
              "Unsafe regex! https://www.npmjs.com/package/safe-regex"
            );
            return;
          }
          this.plugin.settings.include = value;
          await this.plugin.saveSettings();
        })
      );
  }
}

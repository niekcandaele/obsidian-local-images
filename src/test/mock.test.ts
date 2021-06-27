import { TFile } from "obsidian";
import Sinon from "sinon";
import type { ISettings } from "src/main";

export type IMockFile = Partial<TFile> & {
  content?: string;
  expected?: string;
};

export const getMockFile = (file: IMockFile): TFile => {
  const defaults = {
    basename: "test.md",
    path: "test.md",
    name: "test.md",
    extension: "md",
  };

  return Object.assign({}, defaults, file);
};

export const getMockPlugin = (
  notes: IMockFile[],
  settings: ISettings = { include: `\.md*` }
) => ({
  app: {
    vault: {
      getMarkdownFiles: Sinon.stub().returns(notes.map(getMockFile)),
      read: Sinon.stub().callsFake((mockNote: IMockFile) => mockNote.content),
      createFolder: Sinon.stub(),
      createBinary: Sinon.stub().resolves({ path: "/" }),
      modify: Sinon.stub(),
    },
    fileManager: {
      getNewFileParent: Sinon.stub().returns({ path: "/" }),
    },
  },
  settings,
});

beforeEach(() => {
  Sinon.restore();
});

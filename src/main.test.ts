import type { App, TFile } from "obsidian";
import Sinon from "sinon";
import { expect } from "./expect.test";
import type LocalImagesPlugin from "./main";
import { run, runAll } from "./run";
import { getMockPlugin, IMockFile } from "./test/mock.test";

const mockNotes: Record<string, IMockFile> = {
  mockNoteSimple: {
    content: `![Lipari-Obsidienne (5).jpg](https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Lipari-Obsidienne_%285%29.jpg/220px-Lipari-Obsidienne_%285%29.jpg)`,
    expected: `![Original source: https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Lipari-Obsidienne_%285%29.jpg/220px-Lipari-Obsidienne_%285%29.jpg](/img/220pxLipariObsidienne28529.jpg)`,
  },
  // Credits: Wikipedia :)
  mockNoteNormalLink: {
    content: `[Volcanic glass](https://en.wikipedia.org/wiki/Volcanic_glass "Volcanic glass")`,
    expected: `[Volcanic glass](https://en.wikipedia.org/wiki/Volcanic_glass "Volcanic glass")`,
  },
};

describe("main", () => {
  let mockPlugin = getMockPlugin(Object.values(mockNotes));

  beforeEach(() => {
    mockPlugin = getMockPlugin(Object.values(mockNotes));
  });

  it("Full flow", async () => {
    await runAll(mockPlugin as unknown as LocalImagesPlugin);

    for (const noteName in mockNotes) {
      if (Object.prototype.hasOwnProperty.call(mockNotes, noteName)) {
        //@ts-ignore
        const note = mockNotes[noteName];
        expect(mockPlugin.app.vault.modify).to.have.been.calledWith(
          Sinon.match.any,
          note.expected
        );
      }
    }
  });

  it("Can handle root storage", async () => {
    mockPlugin.app.fileManager.getNewFileParent.returns({ path: "/" });
    await run(
      mockPlugin as unknown as LocalImagesPlugin,
      mockNotes.mockNoteSimple as unknown as TFile
    );

    expect(mockPlugin.app.vault.createBinary).to.have.been.calledOnceWith(
      "/img/220pxLipariObsidienne28529.jpg",
      Sinon.match.any
    );
  });

  it("Can handle sub dir storage", async () => {
    mockPlugin.app.fileManager.getNewFileParent.returns({ path: "/test" });
    await run(
      mockPlugin as unknown as LocalImagesPlugin,
      mockNotes.mockNoteSimple as unknown as TFile
    );

    expect(mockPlugin.app.vault.createBinary).to.have.been.calledOnceWith(
      "/test/img/220pxLipariObsidienne28529.jpg",
      Sinon.match.any
    );
  });
});

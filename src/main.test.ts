import type { App, TFile } from "obsidian";
import Sinon from "sinon";
import { expect } from "./expect.test";
import LocalImagesPlugin from "./main";
import { run, runAll } from "./run";

const mockNotes = {
  mockNoteSimple: {
    input: `![Lipari-Obsidienne (5).jpg](https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Lipari-Obsidienne_%285%29.jpg/220px-Lipari-Obsidienne_%285%29.jpg)`,
    output: `![Original source: https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Lipari-Obsidienne_%285%29.jpg/220px-Lipari-Obsidienne_%285%29.jpg](/img/220pxLipariObsidienne28529.jpg)`,
  },
  // Credits: Wikipedia :)
  mockNoteNormalLink: {
    input: `[Volcanic glass](https://en.wikipedia.org/wiki/Volcanic_glass "Volcanic glass")`,
    output: `[Volcanic glass](https://en.wikipedia.org/wiki/Volcanic_glass "Volcanic glass")`,
  },
};

const getMockApp = () => ({
  vault: {
    getMarkdownFiles: Sinon.stub().returns(Object.values(mockNotes)),
    read: Sinon.stub().callsFake((mockNote) => mockNote.input),
    createFolder: Sinon.stub(),
    createBinary: Sinon.stub().resolves({ path: "/" }),
    modify: Sinon.stub(),
  },
  fileManager: {
    getNewFileParent: Sinon.stub().returns({ path: "/" }),
  },
});

describe("main", () => {
  let mockApp = getMockApp();

  beforeEach(() => {
    Sinon.restore();
    mockApp = getMockApp();
  });

  it("Full flow", async () => {
    await runAll(mockApp as unknown as App);

    for (const noteName in mockNotes) {
      if (Object.prototype.hasOwnProperty.call(mockNotes, noteName)) {
        //@ts-ignore
        const note = mockNotes[noteName];
        expect(mockApp.vault.modify).to.have.been.calledWith(
          Sinon.match.any,
          note.output
        );
      }
    }
  });

  it("Can handle root storage", async () => {
    mockApp.fileManager.getNewFileParent.returns({ path: "/" });
    await run(
      mockApp as unknown as App,
      mockNotes.mockNoteSimple as unknown as TFile
    );

    expect(mockApp.vault.createBinary).to.have.been.calledOnceWith(
      "/img/220pxLipariObsidienne28529.jpg",
      Sinon.match.any
    );
  });

  it("Can handle sub dir storage", async () => {
    mockApp.fileManager.getNewFileParent.returns({ path: "/test" });
    await run(
      mockApp as unknown as App,
      mockNotes.mockNoteSimple as unknown as TFile
    );

    expect(mockApp.vault.createBinary).to.have.been.calledOnceWith(
      "/test/img/220pxLipariObsidienne28529.jpg",
      Sinon.match.any
    );
  });
});

import type { App, TFile } from "obsidian";
import Sinon from "sinon";
import { expect } from "./expect.test";
import LocalImagesPlugin from "./main";
import { run } from "./run";

const manifest = require("../manifest.json");

// Credits: Wikipedia :)
const mockNote = {
  input: `
Obsidian

[![Lipari-Obsidienne (5).jpg](https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Lipari-Obsidienne_%285%29.jpg/220px-Lipari-Obsidienne_%285%29.jpg)](https://en.wikipedia.org/wiki/File:Lipari-Obsidienne_(5).jpg)

General

Category

[Volcanic glass](https://en.wikipedia.org/wiki/Volcanic_glass "Volcanic glass")
`,
  output:
    '\nObsidian\n\n[![Original source: https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Lipari-Obsidienne_%285%29.jpg/220px-Lipari-Obsidienne_%285%29.jpg](/)](https://en.wikipedia.org/wiki/File:Lipari-Obsidienne_(5).jpg)\n\nGeneral\n\nCategory\n\n[Volcanic glass](https://en.wikipedia.org/wiki/Volcanic_glass "Volcanic glass")\n',
};

const getMockApp = () => ({
  vault: {
    getFiles: Sinon.stub().returns([{}]),
    read: Sinon.stub().resolves(mockNote.input),
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
    await run(mockApp as unknown as App);
    expect(mockApp.vault.modify).to.have.been.calledOnceWith(
      Sinon.match.any,
      mockNote.output
    );
  });

  it("Can handle root storage", async () => {
    mockApp.fileManager.getNewFileParent.returns({ path: "/" });
    await run(mockApp as unknown as App);

    expect(mockApp.vault.createBinary).to.have.been.calledOnceWith(
      "/img/220pxLipariObsidienne28529.jpg",
      Sinon.match.any
    );
  });

  it("Can handle sub dir storage", async () => {
    mockApp.fileManager.getNewFileParent.returns({ path: "/test" });
    await run(mockApp as unknown as App);

    expect(mockApp.vault.createBinary).to.have.been.calledOnceWith(
      "/test/img/220pxLipariObsidienne28529.jpg",
      Sinon.match.any
    );
  });
});

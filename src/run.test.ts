import Sinon, { mock } from "sinon";
import { expect } from "./expect.test";
import type LocalImagesPlugin from "./main";
import { runAll } from "./run";
import { getMockPlugin } from "./test/mock.test";

const testFiles = [
  {
    path: "test/Volcanic glass - Wikipedia.md",
    name: "Volcanic glass - Wikipedia.md",
    basename: "Volcanic glass - Wikipedia",
    extension: "md",
  },
  {
    path: "really/deep/path.md",
    name: "path.md",
    basename: "path",
    extension: "md",
  },
  {
    path: "really/deep/path (10).md",
    name: "path (10).md",
    basename: "path (10)",
    extension: "md",
  },
  {
    path: "Obsidian - Wikipedia.md",
    name: "Obsidian - Wikipedia.md",
    basename: "Obsidian - Wikipedia",
    extension: "md",
  },
];

describe("runAll", () => {
  let mockPlugin = getMockPlugin(testFiles);

  beforeEach(() => {
    mockPlugin = getMockPlugin(testFiles);
  });

  it("Takes include setting into account", async () => {
    const readStub = mockPlugin.app.vault.read.resolves("");

    // First run it with generic md regex
    mockPlugin.settings.include = `\.md$`;
    await runAll(mockPlugin as unknown as LocalImagesPlugin);
    expect(readStub.callCount).to.be.eq(4);

    // Then narrow it down some more
    mockPlugin.settings.include = `really\/.*\.md$`;
    await runAll(mockPlugin as unknown as LocalImagesPlugin);
    expect(readStub.callCount).to.be.eq(6);
  });
});

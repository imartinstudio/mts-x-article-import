import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  CHANNEL_FROM_MAIN,
  CHANNEL_TO_MAIN,
  INJECT_DRAFT_WRITER_MESSAGE,
} from "../utils/main-world-messages.js";

describe("main-world import message contract", () => {
  it("keeps background and content inject message types aligned", () => {
    expect(INJECT_DRAFT_WRITER_MESSAGE).toBe("mts:inject-draft-writer");
  });

  it("uses versioned page-message channels so stale injected writers ignore new runs", () => {
    expect(CHANNEL_TO_MAIN).toBe("mts-content-v2");
    expect(CHANNEL_FROM_MAIN).toBe("mts-main-v2");
  });

  it("uses a local inject request constant when messaging the background worker", () => {
    const sourcePath = join(dirname(fileURLToPath(import.meta.url)), "main-world-import.ts");
    const source = readFileSync(sourcePath, "utf8");
    expect(source).toContain('const INJECT_DRAFT_WRITER_REQUEST = "mts:inject-draft-writer"');
    expect(source).toContain("type: INJECT_DRAFT_WRITER_REQUEST");
    expect(source).not.toMatch(/type:\s*INJECT_DRAFT_WRITER_MESSAGE\b/);
  });

  it("uses a versioned MAIN world singleton key", () => {
    const sourcePath = join(
      dirname(fileURLToPath(import.meta.url)),
      "../main-world/draft-writer.ts",
    );
    const source = readFileSync(sourcePath, "utf8");
    expect(source).toContain('"__MTS_DRAFT_WRITER_V2__"');
    expect(source).not.toContain("__MTS_DRAFT_WRITER__?: boolean");
  });
});

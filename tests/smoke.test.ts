/**
 * Entry smoke tests: each bundled entry point must execute in a DOM
 * environment without throwing at import time.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { CHANNEL_FROM_MAIN, CHANNEL_TO_MAIN } from "../src/utils/main-world-messages.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("entry smoke", () => {
  it("content script entry executes without runtime crash", async () => {
    await expect(import("../src/content/x-articles.js")).resolves.toBeDefined();
  });

  it("background service worker entry registers its message listener", async () => {
    const addListener = vi.fn();
    vi.stubGlobal("chrome", {
      runtime: { id: "smoke", onMessage: { addListener } },
      scripting: { executeScript: vi.fn() },
    });
    await import("../src/background/main-world-bridge.js");
    expect(addListener).toHaveBeenCalledTimes(1);
  });

  it("main-world draft writer installs singleton and answers ready ping", async () => {
    await import("../src/main-world/draft-writer.js");
    expect(
      (window as unknown as Record<string, boolean | undefined>)["__YT2X_DRAFT_WRITER_V2__"],
    ).toBe(true);

    const ready = await new Promise<boolean>((resolve) => {
      const timeout = window.setTimeout(() => resolve(false), 2_000);
      const listener = (event: MessageEvent): void => {
        const data = event.data as { source?: string; kind?: string };
        if (data?.source === CHANNEL_FROM_MAIN && data?.kind === "ready") {
          window.clearTimeout(timeout);
          window.removeEventListener("message", listener);
          resolve(true);
        }
      };
      window.addEventListener("message", listener);
      // jsdom 的 window.postMessage 不设置 event.source，手动构造以通过 writer 的来源校验。
      window.dispatchEvent(
        new MessageEvent("message", {
          source: window,
          data: { source: CHANNEL_TO_MAIN, kind: "ready?" },
        }),
      );
    });
    expect(ready).toBe(true);
  });
});

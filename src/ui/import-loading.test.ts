import { afterEach, describe, expect, it } from "vitest";
import { formatIndexedStep, showImportLoading } from "./import-loading.js";

describe("import-loading", () => {
  afterEach(() => {
    document.querySelector("[data-mts-import-loading]")?.remove();
    document.documentElement.removeAttribute("data-mts-import-busy");
  });

  it("formats indexed step labels", () => {
    expect(formatIndexedStep("正在插入图片", 2, 5)).toBe("正在插入图片（2/5）");
    expect(formatIndexedStep("正在插入图片", 1, 1)).toBe("正在插入图片");
  });

  it("shows and updates loading overlay", () => {
    const loading = showImportLoading("步骤一");
    const host = document.querySelector("[data-mts-import-loading]");
    expect(host).not.toBeNull();
    expect(document.documentElement.getAttribute("data-mts-import-busy")).toBe("true");

    loading.update("步骤二");
    const message = host?.shadowRoot?.querySelector("[data-role='message']");
    expect(message?.textContent).toBe("步骤二");

    loading.close();
    expect(document.querySelector("[data-mts-import-loading]")).toBeNull();
    expect(document.documentElement.getAttribute("data-mts-import-busy")).toBeNull();
  });

  it("uses the import dialog visual language for its overlay", () => {
    const loading = showImportLoading("步骤一");
    const host = document.querySelector("[data-mts-import-loading]") as HTMLElement;
    const styleText = host.shadowRoot?.querySelector("style")?.textContent ?? "";

    expect(styleText).toContain("border-radius: 14px");
    expect(styleText).toContain("background: #1a1a1c");
    expect(styleText).toContain("box-shadow: 0 16px 48px rgba(0,0,0,0.5)");
    expect(styleText).toContain("border-top-color: #4d9de0");

    loading.close();
  });
});

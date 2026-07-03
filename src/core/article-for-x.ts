import { z } from "zod";

export const XArticleSubscriptionTierSchema = z.enum(["premium", "premium-plus"]);
export type XArticleSubscriptionTier = z.infer<typeof XArticleSubscriptionTierSchema>;

export type ArticleForXAdaptation = {
  kind: "deep-heading" | "video" | "premium-table" | "premium-image" | "mermaid";
  message: string;
  placeholder?: string;
  sourceMarkdown?: string;
};

export type AdaptArticleForXResult = {
  markdown: string;
  adaptations: ArticleForXAdaptation[];
  warnings: string[];
};

export const adaptArticleForX = (input: {
  markdown: string;
  subscriptionTier: XArticleSubscriptionTier;
  sourceVideoUrl?: string;
}): AdaptArticleForXResult => {
  const adaptations: ArticleForXAdaptation[] = [];
  const warnings: string[] = [];
  const lines = input.markdown.replaceAll("\r\n", "\n").split("\n");
  const output: string[] = [];
  let inCodeFence = false;
  let inMermaid = false;
  let tableLines: string[] = [];
  let tableNumber = 0;

  const flushTable = (): void => {
    if (tableLines.length === 0) return;
    if (input.subscriptionTier === "premium-plus") {
      output.push(...tableLines);
    } else {
      tableNumber += 1;
      const placeholder = `yt2x-table-${tableNumber}.png`;
      adaptations.push({
        kind: "premium-table",
        message: "已将 Markdown 表格转换为图片（X Premium 不支持文章内原生表格）。",
        placeholder,
        sourceMarkdown: tableLines.join("\n"),
      });
      output.push(`![表格](${placeholder})`);
    }
    tableLines = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      flushTable();
      if (!inCodeFence) {
        inMermaid = /^```mermaid(?:\s|$)/iu.test(trimmed);
        if (inMermaid) {
          adaptations.push({
            kind: "mermaid",
            message: "已将 Mermaid 图表替换为待处理提示（X Articles 无法直接粘贴 Mermaid）。",
          });
          warnings.push("Mermaid 图表需先转换为图片，再复核最终 X Article 草稿。");
          output.push("> Mermaid 图表需转换为图片后再发布。");
        } else {
          output.push(line);
        }
        inCodeFence = true;
      } else {
        if (!inMermaid) output.push(line);
        inCodeFence = false;
        inMermaid = false;
      }
      continue;
    }

    if (inCodeFence) {
      if (!inMermaid) output.push(line);
      continue;
    }

    if (/^\s*(?:[-*]|\d+\.)\s+.*!\[[^\]]*\]\([^)]+\)/u.test(line)) {
      warnings.push("Markdown 列表中的图片需人工确认后再插入 X Articles。");
    }

    if (isMarkdownTableLine(line)) {
      tableLines.push(line);
      continue;
    }
    flushTable();

    const heading = /^(#{3,6})\s+(.+)$/u.exec(line);
    if (heading !== null && input.subscriptionTier === "premium") {
      output.push(`**${stripOuterEmphasis(heading[2]!.trim())}**`);
      adaptations.push({
        kind: "deep-heading",
        message: "已将 H3 及更深层级标题转换为加粗文本（X Premium 不支持深层标题）。",
      });
      continue;
    }

    output.push(line);
  }
  flushTable();

  return {
    markdown: output.join("\n").replace(/\n{3,}/gu, "\n\n").trimEnd() + "\n",
    adaptations,
    warnings: [...new Set(warnings)],
  };
};

const isMarkdownTableLine = (line: string): boolean => {
  const trimmed = line.trim();
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.split("|").length >= 4;
};

const stripOuterEmphasis = (text: string): string => {
  const pair = /^(\*\*|__)(.+)\1$/u.exec(text);
  return pair?.[2] ?? text;
};

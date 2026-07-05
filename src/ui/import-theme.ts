export type ImportUiTheme = {
  bg: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  accentHover: string;
  warn: string;
  warnText: string;
  border: string;
  shadow: string;
  backdrop: string;
  font: string;
};

export const isDarkMode = (): boolean =>
  detectPageDarkMode() ?? window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true;

const detectPageDarkMode = (): boolean | null => {
  const colorScheme = getComputedStyle(document.documentElement).colorScheme;
  if (/\bdark\b/i.test(colorScheme)) return true;
  if (/\blight\b/i.test(colorScheme)) return false;

  const bodyBackground = getComputedStyle(document.body).backgroundColor;
  return backgroundIsDark(bodyBackground);
};

const backgroundIsDark = (color: string): boolean | null => {
  const rgb = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
  if (rgb === null) return null;
  const alpha = rgb[4] === undefined ? 1 : Number(rgb[4]);
  if (alpha < 0.5) return null;

  const red = Number(rgb[1]);
  const green = Number(rgb[2]);
  const blue = Number(rgb[3]);
  return red * 0.299 + green * 0.587 + blue * 0.114 < 128;
};

export const getImportUiTheme = (dark = isDarkMode()): ImportUiTheme => ({
  bg: dark ? "#1a1a1c" : "#ffffff",
  surface: dark ? "#242426" : "#f5f5f7",
  text: dark ? "#e4e4e5" : "#1d1d1f",
  muted: dark ? "#86868b" : "#6e6e73",
  accent: dark ? "#4d9de0" : "#3b82c4",
  accentHover: dark ? "#3d8dcc" : "#3570b0",
  warn: dark ? "rgba(245,158,11,0.1)" : "rgba(245,158,11,0.08)",
  warnText: dark ? "#fbbf24" : "#b45309",
  border: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
  shadow: dark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.1)",
  backdrop: "rgba(0,0,0,.35)",
  font: "14px/1.5 system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
});

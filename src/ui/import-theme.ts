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
  window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true;

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

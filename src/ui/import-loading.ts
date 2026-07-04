import { getImportUiTheme } from "./import-theme.js";

export const IMPORT_BUTTON_IDS = {
  icon: "mts-import-markdown-icon-btn",
  text: "mts-import-markdown-text-btn",
} as const;
export const IMPORT_BUTTON_ID = IMPORT_BUTTON_IDS.text;
const LOADING_HOST_ATTR = "data-mts-import-loading";
const BUSY_ATTR = "data-mts-import-busy";

export type ImportLoadingHandle = {
  update: (message: string) => void;
  close: () => void;
};

export const formatIndexedStep = (label: string, index: number, total: number): string =>
  total <= 1 ? label : `${label}（${index}/${total}）`;

export const setImportButtonDisabled = (disabled: boolean): void => {
  for (const id of Object.values(IMPORT_BUTTON_IDS)) {
    const button = document.getElementById(id);
    if (!(button instanceof HTMLButtonElement)) continue;
    button.disabled = disabled;
    button.setAttribute("aria-busy", disabled ? "true" : "false");
    button.style.opacity = disabled ? "0.55" : "";
    button.style.pointerEvents = disabled ? "none" : "";
    button.style.cursor = disabled ? "not-allowed" : "pointer";
  }
};

export const showImportLoading = (message: string): ImportLoadingHandle => {
  document.querySelector(`[${LOADING_HOST_ATTR}]`)?.remove();
  document.documentElement.setAttribute(BUSY_ATTR, "true");
  setImportButtonDisabled(true);

  const host = document.createElement("div");
  host.setAttribute(LOADING_HOST_ATTR, "true");
  const shadow = host.attachShadow({ mode: "open" });
  const c = getImportUiTheme();
  shadow.innerHTML = `
<style>
  :host { all: initial; }
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    display: grid;
    place-items: center;
    background: ${c.backdrop};
    font: ${c.font};
    color: ${c.text};
    pointer-events: auto;
    user-select: none;
    animation: yt-fade 150ms ease-out;
  }
  .panel {
    width: min(360px, calc(100vw - 32px));
    padding: 24px 28px 22px;
    border-radius: 14px;
    border: 1px solid ${c.border};
    background: ${c.bg};
    box-shadow: 0 16px 48px ${c.shadow};
    text-align: center;
    animation: yt-enter 200ms cubic-bezier(0.22,1,0.36,1);
  }
  .spinner {
    width: 28px;
    height: 28px;
    margin: 0 auto 14px;
    border: 3px solid ${c.surface};
    border-top-color: ${c.accent};
    border-radius: 50%;
    animation: mts-spin 0.8s linear infinite;
  }
  @keyframes yt-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes yt-enter {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes mts-spin {
    to { transform: rotate(360deg); }
  }
  .message {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: ${c.text};
  }
  .hint {
    margin: 10px 0 0;
    font-size: 13px;
    color: ${c.muted};
  }
</style>
<div class="backdrop" role="alertdialog" aria-modal="true" aria-busy="true" aria-live="polite">
  <div class="panel">
    <div class="spinner" aria-hidden="true"></div>
    <p class="message" data-role="message"></p>
    <p class="hint">导入进行中，请勿操作页面或关闭标签页</p>
  </div>
</div>`;

  const messageEl = shadow.querySelector("[data-role='message']");
  const update = (text: string): void => {
    if (messageEl !== null) messageEl.textContent = text;
  };
  update(message);
  document.body.appendChild(host);

  const close = (): void => {
    host.remove();
    document.documentElement.removeAttribute(BUSY_ATTR);
    setImportButtonDisabled(false);
  };

  return { update, close };
};

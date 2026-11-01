export const TOAST_EVENT = "krg:toast";

export type ToastDetail = {
  title: string;
  body?: string;
  tone?: "info" | "flag" | "error";
};

export function toast(detail: ToastDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ToastDetail>(TOAST_EVENT, { detail }));
}

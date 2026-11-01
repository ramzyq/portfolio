export const BOOT_DONE_EVENT = "krg:boot-done";
export const BOOT_STORAGE_KEY = "krg-booted";

/**
 * Runs before first paint (inlined in <body>) and decides whether the boot
 * screen should show: once per tab session, never with reduced motion, and
 * never under browser automation (screenshots/tests).
 */
export const BOOT_INLINE_SCRIPT = `(function(){try{
if(sessionStorage.getItem("${BOOT_STORAGE_KEY}"))return;
if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
if(navigator.webdriver)return;
document.documentElement.setAttribute("data-boot","on");
}catch(e){}})();`;

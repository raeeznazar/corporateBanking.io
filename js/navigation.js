/**
 * Mobile navigation drawer, footer accordion and placeholder-link handling.
 */

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const trapFocus = (container, event) => {
  const focusable = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

export const initMobileNav = () => {
  const openButton = document.getElementById("nav-open");
  const closeButton = document.getElementById("nav-close");
  const drawer = document.getElementById("mobile-nav");
  if (!openButton || !closeButton || !drawer) return;

  let lastFocused = null;

  const openDrawer = () => {
    lastFocused = document.activeElement;
    drawer.dataset.open = "true";
    document.body.dataset.navOpen = "true";
    openButton.setAttribute("aria-expanded", "true");
    closeButton.focus();
    document.addEventListener("keydown", onKeydown);
  };

  const closeDrawer = () => {
    drawer.dataset.open = "false";
    document.body.dataset.navOpen = "false";
    openButton.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused) lastFocused.focus();
  };

  const onKeydown = (event) => {
    if (event.key === "Escape") {
      closeDrawer();
      return;
    }
    if (event.key === "Tab") {
      trapFocus(drawer, event);
    }
  };

  openButton.addEventListener("click", openDrawer);
  closeButton.addEventListener("click", closeDrawer);
  drawer.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeDrawer));
};

export const initFooterAccordion = () => {
  const toggles = document.querySelectorAll("[data-footer-toggle]");
  const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      if (isDesktop()) return;
      const column = toggle.closest(".c-footer__col");
      const isOpen = column.dataset.open === "true";
      column.dataset.open = String(!isOpen);
    });
  });
};

export const initPlaceholderLinks = () => {
  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
  });
};

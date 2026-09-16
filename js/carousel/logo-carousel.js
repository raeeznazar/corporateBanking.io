/**
 * Auto-scrolling.
 */

const DESKTOP_QUERY = "(min-width: 1024px)";
const MIN_WIDTH_MULTIPLIER = 2;
const MAX_CLONE_PASSES = 6;

const ensureLoopableWidth = (viewport, container) => {
  if (container.dataset.cloned === "true") return;

  const originalSlides = Array.from(container.children);
  let passes = 0;

  while (container.scrollWidth < viewport.clientWidth * MIN_WIDTH_MULTIPLIER && passes < MAX_CLONE_PASSES) {
    originalSlides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("img").forEach((img) => img.setAttribute("alt", ""));
      container.appendChild(clone);
    });
    passes += 1;
  }

  container.dataset.cloned = "true";
};

export const initLogoCarousel = () => {
  const root = document.querySelector("[data-logo-carousel]");
  if (!root) return;

  if (!window.EmblaCarousel || !window.EmblaCarouselAutoScroll) {
    console.error(
      "[logo-carousel] Embla failed to load — window.EmblaCarousel:",
      typeof window.EmblaCarousel,
      "window.EmblaCarouselAutoScroll:",
      typeof window.EmblaCarouselAutoScroll,
      "Check that js/carousel/vendor/embla-carousel.umd.js and embla-carousel-auto-scroll.umd.js " +
        "actually returned 200 in the Network tab — a 404 there (e.g. from an IDE preview server " +
        "using a different base path) would explain a static, non-scrolling strip with no other error.",
    );
    return;
  }

  const viewport = root.querySelector(".embla__viewport");
  const container = root.querySelector(".embla__container");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktop = window.matchMedia(DESKTOP_QUERY);

  let emblaApi = null;

  const create = () => {
    if (emblaApi) return;

    ensureLoopableWidth(viewport, container);

    // Respect reduced-motion: keep the carousel draggable, but skip autoplay.
    const plugins = prefersReducedMotion
      ? []
      : [
          window.EmblaCarouselAutoScroll({
            speed: 1,
            startDelay: 8,
            stopOnMouseEnter: true,
            stopOnInteraction: false,
          }),
        ];

    emblaApi = window.EmblaCarousel(viewport, { loop: true, align: "start", dragFree: true }, plugins);

    console.info("[logo-carousel] initialized. plugins:", Object.keys(emblaApi.plugins()), "reducedMotion:", prefersReducedMotion);
  };

  const destroy = () => {
    if (!emblaApi) return;
    emblaApi.destroy();
    emblaApi = null;
  };

  const sync = () => (isDesktop.matches ? create() : destroy());

  sync();
  isDesktop.addEventListener("change", sync);
};

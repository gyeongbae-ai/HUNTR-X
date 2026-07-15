let initialized = false;

export function initMotionEffects() {
  if (initialized) return;
  initialized = true;

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  document.body.classList.add("motion-ready");

  if (reducedMotion || !finePointer) return;

  let frame;
  document.addEventListener("pointermove", (event) => {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      root.style.setProperty("--pointer-x", `${event.clientX}px`);
      root.style.setProperty("--pointer-y", `${event.clientY}px`);
      root.style.setProperty("--parallax-x", `${nx * -10}px`);
      root.style.setProperty("--parallax-y", `${ny * -8}px`);
      frame = null;
    });
  }, { passive: true });
}

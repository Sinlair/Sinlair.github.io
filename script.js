document.documentElement.classList.add("js-enhanced");

document.querySelectorAll(".currentYear").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const stagedNodes = document.querySelectorAll(".staged");

if (prefersReducedMotion) {
  stagedNodes.forEach((node) => {
    node.classList.add("is-visible");
  });
} else {
  window.requestAnimationFrame(() => {
    stagedNodes.forEach((node, index) => {
      window.setTimeout(() => {
        node.classList.add("is-visible");
      }, 70 * index);
    });
  });
}

const triggers = document.querySelectorAll("[data-view-trigger]");
const panels = document.querySelectorAll("[data-view-panel]");
const validViews = new Set(["overview", "projects", "approach", "links"]);

const setView = (view, syncHash = true) => {
  const nextView = validViews.has(view) ? view : "overview";

  triggers.forEach((trigger) => {
    const isCurrent = trigger.dataset.viewTrigger === nextView;
    trigger.classList.toggle("is-current", isCurrent);
    trigger.setAttribute("aria-pressed", String(isCurrent));
  });

  panels.forEach((panel) => {
    const isCurrent = panel.dataset.viewPanel === nextView;
    panel.classList.toggle("is-active", isCurrent);
  });

  if (syncHash) {
    const nextHash = nextView === "overview" ? "" : `#${nextView}`;
    const nextUrl = `${window.location.pathname}${nextHash}`;
    window.history.replaceState(null, "", nextUrl);
  }
};

const resolveHashView = () => {
  const hash = window.location.hash.replace("#", "");
  return validViews.has(hash) ? hash : "overview";
};

triggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    setView(trigger.dataset.viewTrigger);
  });
});

window.addEventListener("hashchange", () => {
  setView(resolveHashView(), false);
});

setView(resolveHashView(), false);

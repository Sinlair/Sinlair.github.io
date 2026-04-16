document.querySelectorAll(".currentYear").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

document.documentElement.classList.add("js-enhanced");

const root = document.documentElement;
const body = document.body;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ensureGlobalMotionLayer = () => {
  if (!body.querySelector(".scroll-progress")) {
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    progressBar.setAttribute("aria-hidden", "true");
    body.prepend(progressBar);
  }

  if (!prefersReducedMotion && !body.querySelector(".cursor-aura")) {
    const cursorAura = document.createElement("div");
    cursorAura.className = "cursor-aura";
    cursorAura.setAttribute("aria-hidden", "true");
    body.append(cursorAura);
  }
};

ensureGlobalMotionLayer();

const syncViewportState = () => {
  const scrollRange = Math.max(root.scrollHeight - window.innerHeight, 0);
  const progress = scrollRange > 0 ? window.scrollY / scrollRange : 0;

  root.style.setProperty("--scroll-progress", progress.toFixed(4));
};

let viewportFrame = 0;
const queueViewportSync = () => {
  if (viewportFrame) {
    return;
  }

  viewportFrame = window.requestAnimationFrame(() => {
    syncViewportState();
    viewportFrame = 0;
  });
};

syncViewportState();
window.addEventListener("scroll", queueViewportSync, { passive: true });
window.addEventListener("resize", queueViewportSync);

const currentPage = body.dataset.page;
if (currentPage) {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === currentPage) {
      link.classList.add("is-current");
      link.setAttribute("aria-current", "page");
    }
  });
}

const rotator = document.querySelector(".hero-rotator");
if (rotator) {
  const words = rotator.dataset.words
    ?.split(",")
    .map((word) => word.trim())
    .filter(Boolean) ?? [];

  if (words.length > 1) {
    let index = 0;
    window.setInterval(() => {
      index = (index + 1) % words.length;
      rotator.classList.remove("is-swapping");
      void rotator.offsetWidth;
      rotator.textContent = words[index];
      rotator.classList.add("is-swapping");
    }, 2200);
  }
}

const revealTargets = [
  ...document.querySelectorAll(".site-header, .panel, .site-footer"),
];

if (prefersReducedMotion) {
  revealTargets.forEach((node) => {
    node.classList.add("is-visible");
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  revealTargets.forEach((node, index) => {
    node.style.setProperty("--reveal-distance", `${18 + index * 4}px`);
    revealObserver.observe(node);
  });
}

if (!prefersReducedMotion) {
  let pointerTargetX = window.innerWidth * 0.5;
  let pointerTargetY = window.innerHeight * 0.3;
  let pointerX = pointerTargetX;
  let pointerY = pointerTargetY;

  const renderPointer = () => {
    pointerX += (pointerTargetX - pointerX) * 0.14;
    pointerY += (pointerTargetY - pointerY) * 0.14;

    root.style.setProperty("--pointer-x", `${pointerX}px`);
    root.style.setProperty("--pointer-y", `${pointerY}px`);
    root.style.setProperty("--cursor-x", `${pointerX}px`);
    root.style.setProperty("--cursor-y", `${pointerY}px`);

    window.requestAnimationFrame(renderPointer);
  };

  renderPointer();

  const resetPointer = () => {
    pointerTargetX = window.innerWidth * 0.5;
    pointerTargetY = window.innerHeight * 0.3;
  };

  window.addEventListener("pointermove", (event) => {
    pointerTargetX = event.clientX;
    pointerTargetY = event.clientY;
  });

  window.addEventListener("pointerdown", (event) => {
    pointerTargetX = event.clientX;
    pointerTargetY = event.clientY;
  });

  window.addEventListener("blur", resetPointer);
  window.addEventListener("mouseout", (event) => {
    if (!event.relatedTarget) {
      resetPointer();
    }
  });
}

const interactivePanels = document.querySelectorAll(".panel");

interactivePanels.forEach((panel) => {
  if (prefersReducedMotion) {
    return;
  }

  const resetPanel = () => {
    panel.classList.remove("is-hovered");
    panel.style.setProperty("--panel-tilt-x", "0deg");
    panel.style.setProperty("--panel-tilt-y", "0deg");
    panel.style.setProperty("--panel-glow", "0");
  };

  panel.addEventListener("pointermove", (event) => {
    const rect = panel.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const rotateY = ((offsetX / rect.width) - 0.5) * 6;
    const rotateX = (0.5 - (offsetY / rect.height)) * 6;

    panel.classList.add("is-hovered");
    panel.style.setProperty("--panel-tilt-x", `${rotateX.toFixed(2)}deg`);
    panel.style.setProperty("--panel-tilt-y", `${rotateY.toFixed(2)}deg`);
    panel.style.setProperty("--panel-glow", "1");
    panel.style.setProperty("--pointer-x", `${offsetX}px`);
    panel.style.setProperty("--pointer-y", `${offsetY}px`);
  });

  panel.addEventListener("pointerleave", resetPanel);
  panel.addEventListener("pointercancel", resetPanel);
});

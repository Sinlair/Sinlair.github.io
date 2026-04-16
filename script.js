document.querySelectorAll(".currentYear").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

document.documentElement.classList.add("js-enhanced");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const currentPage = document.body.dataset.page;
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
  let pointerFrame = 0;
  let pointerX = window.innerWidth * 0.5;
  let pointerY = window.innerHeight * 0.3;

  const syncPointer = () => {
    document.body.style.setProperty("--pointer-x", `${pointerX}px`);
    document.body.style.setProperty("--pointer-y", `${pointerY}px`);
    pointerFrame = 0;
  };

  window.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;

    if (!pointerFrame) {
      pointerFrame = window.requestAnimationFrame(syncPointer);
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
    const rotateX = ((0.5 - (offsetY / rect.height)) * 6);

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

// ============================================================
// Canvas particle network
// ============================================================
if (!prefersReducedMotion) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0.5;";
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  const PARTICLE_COLORS = [
    "31,111,209", // primary blue — matches --accent
    "27,139,120", // teal — matches --accent-alt
  ];
  const MAX_DIST = 130;       // px; maximum distance to draw a connection line
  const MAX_LINE_ALPHA = 0.22; // maximum opacity for connection lines
  const CONNECTION_LINE_WIDTH = 0.75;
  const PARTICLE_VELOCITY_SCALE = 0.38; // controls drift speed
  const MIN_PARTICLE_RADIUS = 0.7;
  const PARTICLE_RADIUS_RANGE = 1.6;
  const MOBILE_BREAKPOINT = 720;
  const MOBILE_PARTICLE_COUNT = 28;
  const DESKTOP_PARTICLE_COUNT = 52;
  let canvasW = 0;
  let canvasH = 0;
  let pts = [];
  let netAnimId = 0;

  function resizeCanvas() {
    canvasW = canvas.width = window.innerWidth;
    canvasH = canvas.height = window.innerHeight;
  }

  function spawnParticles() {
    const count = canvasW < MOBILE_BREAKPOINT ? MOBILE_PARTICLE_COUNT : DESKTOP_PARTICLE_COUNT;
    pts = Array.from({ length: count }, () => ({
      x: Math.random() * canvasW,
      y: Math.random() * canvasH,
      vx: (Math.random() - 0.5) * PARTICLE_VELOCITY_SCALE,
      vy: (Math.random() - 0.5) * PARTICLE_VELOCITY_SCALE,
      r: Math.random() * PARTICLE_RADIUS_RANGE + MIN_PARTICLE_RADIUS,
      c: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    }));
  }

  function tickParticles() {
    ctx.clearRect(0, 0, canvasW, canvasH);

    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      a.x += a.vx;
      a.y += a.vy;
      if (a.x < 0) a.x = canvasW;
      else if (a.x > canvasW) a.x = 0;
      if (a.y < 0) a.y = canvasH;
      else if (a.y > canvasH) a.y = 0;

      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${a.c},0.72)`;
      ctx.fill();

      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < MAX_DIST * MAX_DIST) {
          const alpha = (1 - Math.sqrt(d2) / MAX_DIST) * MAX_LINE_ALPHA;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${a.c},${alpha.toFixed(3)})`;
          ctx.lineWidth = CONNECTION_LINE_WIDTH;
          ctx.stroke();
        }
      }
    }

    netAnimId = requestAnimationFrame(tickParticles);
  }

  resizeCanvas();
  spawnParticles();
  tickParticles();

  window.addEventListener("resize", () => {
    cancelAnimationFrame(netAnimId);
    resizeCanvas();
    spawnParticles();
    tickParticles();
  });
}

// ============================================================
// Ripple on click
// ============================================================
document.querySelectorAll(".button, .link-stack a").forEach((el) => {
  el.addEventListener("click", (e) => {
    if (prefersReducedMotion) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${
      e.clientX - rect.left - size / 2
    }px;top:${e.clientY - rect.top - size / 2}px;`;
    el.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  });
});

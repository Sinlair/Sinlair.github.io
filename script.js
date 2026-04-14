const yearNode = document.getElementById("currentYear");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
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
      rotator.textContent = words[index];
    }, 2200);
  }
}

const revealNodes = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealNodes.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.18,
  });

  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

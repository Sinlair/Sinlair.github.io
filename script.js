document.querySelectorAll(".currentYear").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

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

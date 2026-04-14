const roles = [
  "前端开发 / 学习者",
  "AI 应用探索者",
  "项目交付执行者",
];

const roleText = document.getElementById("role-text");
const year = document.getElementById("year");
const revealItems = document.querySelectorAll(".reveal");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (roleText) {
  let index = 0;
  window.setInterval(() => {
    index = (index + 1) % roles.length;
    roleText.textContent = roles[index];
  }, 2200);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
  },
);

revealItems.forEach((item) => observer.observe(item));

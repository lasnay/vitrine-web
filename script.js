const CONTACT_EMAIL = "contact@exemple.fr";

document.getElementById("year").textContent = new Date().getFullYear();

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
nav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", false);
  }
});

document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const subject = `Demande d'audit — ${data.get("name")}`;
  const body = [
    `Nom : ${data.get("name")}`,
    `E-mail : ${data.get("email")}`,
    `Site : ${data.get("site") || "aucun"}`,
    "",
    data.get("message"),
  ].join("\n");
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

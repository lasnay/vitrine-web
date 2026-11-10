const CONTACT_EMAIL = "lasnay.dev@gmail.com";

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
    `Entreprise : ${data.get("company") || "—"}`,
    `Téléphone : ${data.get("phone") || "—"}`,
    `Site actuel : ${data.get("has_site") || "—"} ${data.get("site") ? "(" + data.get("site") + ")" : ""}`,
    `Budget : ${data.get("budget") || "—"}`,
    "",
    data.get("message"),
  ].join("\n");
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

document.getElementById("test-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let url = document.getElementById("test-url").value.trim();
  if (!url) return;
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  let host;
  try { host = new URL(url).hostname; } catch { return; }
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host)) return;
  const tool = e.submitter && e.submitter.dataset.tool === "security" ? "security" : "speed";
  const target = tool === "security"
    ? `https://developer.mozilla.org/fr/observatory/analyze?host=${encodeURIComponent(host)}`
    : `https://pagespeed.web.dev/report?url=${encodeURIComponent(url)}&form_factor=mobile`;
  window.open(target, "_blank", "noopener");
});

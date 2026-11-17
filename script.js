const CONTACT_EMAIL = "lasnay.dev@gmail.com";
const FORM_ENDPOINT = "https://formspree.io/f/xgakojlk";

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

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

function openMailto(data) {
  const subject = `Demande d'audit — ${data.get("name")}`;
  const body = [
    `Nom : ${data.get("name")}`,
    `E-mail : ${data.get("email")}`,
    `Besoin : ${data.get("need") || "—"}`,
    `Entreprise : ${data.get("company") || "—"}`,
    `Téléphone : ${data.get("phone") || "—"}`,
    `Site actuel : ${data.get("has_site") || "—"} ${data.get("site") ? "(" + data.get("site") + ")" : ""}`,
    `Budget : ${data.get("budget") || "—"}`,
    "",
    data.get("message"),
  ].join("\n");
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(contactForm);
  if (data.get("_gotcha")) return;
  if (!FORM_ENDPOINT) {
    openMailto(data);
    return;
  }
  const button = contactForm.querySelector('button[type="submit"]');
  button.disabled = true;
  formStatus.textContent = "Envoi en cours…";
  formStatus.dataset.state = "";
  try {
    const payload = Object.fromEntries(data.entries());
    payload._subject = `Demande d'audit — ${data.get("name")}`;
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("send failed");
    contactForm.reset();
    formStatus.dataset.state = "ok";
    formStatus.textContent = "Merci ! Votre demande est bien partie, je vous réponds sous 48 h.";
  } catch {
    formStatus.dataset.state = "error";
    formStatus.textContent = `L'envoi n'a pas fonctionné. Écrivez-moi directement à ${CONTACT_EMAIL}.`;
  } finally {
    button.disabled = false;
  }
});

document.getElementById("test-url").addEventListener("input", (e) => e.target.setCustomValidity(""));

document.getElementById("test-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("test-url");
  let url = input.value.trim();
  if (!url) return;
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  let host = "";
  try { host = new URL(url).hostname; } catch {}
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host)) {
    input.setCustomValidity("Adresse non reconnue. Exemple : www.votre-site.fr");
    input.reportValidity();
    return;
  }
  const tool = e.submitter && e.submitter.dataset.tool === "security" ? "security" : "speed";
  const target = tool === "security"
    ? `https://developer.mozilla.org/fr/observatory/analyze?host=${encodeURIComponent(host)}`
    : `https://pagespeed.web.dev/report?url=${encodeURIComponent(url)}&form_factor=mobile`;
  window.open(target, "_blank", "noopener");
});

document.querySelectorAll("[data-need]").forEach((link) => {
  link.addEventListener("click", () => {
    const select = document.querySelector('select[name="need"]');
    if (select) select.value = link.dataset.need;
  });
});

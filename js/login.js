import { getProfile, getSession, loginDemo, loginUser } from "./auth.js";
import { initMotionEffects } from "./motion.js";

initMotionEffects();

if (getSession()) {
  window.location.replace(getProfile() ? "dashboard.html" : "onboarding.html");
}

const form = document.querySelector("#loginForm");
const errorBox = document.querySelector("#loginError");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorBox.classList.add("hidden");
  const submitButton = form.querySelector("button[type=submit]");
  submitButton.disabled = true;
  const data = new FormData(form);
  try {
    await loginUser(String(data.get("studentNumber")).trim(), String(data.get("password")));
    const next = new URLSearchParams(window.location.search).get("next");
    window.location.href = next || (getProfile() ? "dashboard.html" : "onboarding.html");
  } catch (error) {
    errorBox.textContent = error.message || "Login failed.";
    errorBox.classList.remove("hidden");
    submitButton.disabled = false;
  }
});

document.querySelectorAll("[data-demo]").forEach((button) => {
  button.addEventListener("click", () => {
    loginDemo(button.dataset.demo);
    window.location.href = "dashboard.html";
  });
});

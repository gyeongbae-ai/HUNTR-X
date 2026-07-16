import { registerUser } from "./auth.js";
import { initMotionEffects } from "./motion.js";

initMotionEffects();

const form = document.querySelector("#signupForm");
const errorBox = document.querySelector("#signupError");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorBox.classList.add("hidden");
  const submitButton = form.querySelector("button[type=submit]");
  submitButton.disabled = true;
  const data = new FormData(form);
  const password = String(data.get("password"));
  const passwordConfirm = String(data.get("passwordConfirm"));

  if (password !== passwordConfirm) {
    errorBox.textContent = "비밀번호가 서로 다릅니다.";
    errorBox.classList.remove("hidden");
    submitButton.disabled = false;
    return;
  }

  try {
    await registerUser({
      name: String(data.get("name")).trim(),
      studentNumber: String(data.get("studentNumber")).trim(),
      password,
      createdAt: new Date().toISOString(),
    });
    window.location.href = "onboarding.html";
  } catch (error) {
    errorBox.textContent = error.message || "Signup failed.";
    errorBox.classList.remove("hidden");
    submitButton.disabled = false;
  }
});

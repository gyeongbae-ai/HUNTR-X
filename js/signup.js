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

  if (password.length < 6) {
    errorBox.textContent = "비밀번호는 6자 이상으로 입력해 주세요.";
    errorBox.classList.remove("hidden");
    submitButton.disabled = false;
    return;
  }

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
    errorBox.textContent = /password|6 character/i.test(error.message || "")
      ? "비밀번호는 6자 이상으로 입력해 주세요."
      : error.message || "회원가입 중 문제가 발생했습니다.";
    errorBox.classList.remove("hidden");
    submitButton.disabled = false;
  }
});

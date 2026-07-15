import { clonePersona, ensureEvidenceData, STORAGE_KEYS } from "./data.js";

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.users)) || [];
  } catch {
    return [];
  }
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.session));
  } catch {
    return null;
  }
}

export function getProfile() {
  try {
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.profile));
    if (profile?.id === "TEST_P04_PHYS_EARLY") {
      const migrated = clonePersona("softwareEarly");
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(migrated));
      return migrated;
    }
    return ensureEvidenceData(profile);
  } catch {
    return null;
  }
}

export function saveProfile(profile) {
  const normalized = ensureEvidenceData(profile);
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent("gradquest:profile-updated", { detail: normalized }));
}

export function registerUser(payload) {
  const users = getUsers();
  if (users.some((user) => user.studentNumber === payload.studentNumber)) {
    throw new Error("이미 가입된 학번입니다.");
  }

  users.push(payload);
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  localStorage.setItem(
    STORAGE_KEYS.session,
    JSON.stringify({ studentNumber: payload.studentNumber, name: payload.name }),
  );
}

export function loginUser(studentNumber, password) {
  const user = getUsers().find(
    (candidate) => candidate.studentNumber === studentNumber && candidate.password === password,
  );
  if (!user) throw new Error("학번 또는 비밀번호를 확인해 주세요.");

  localStorage.setItem(
    STORAGE_KEYS.session,
    JSON.stringify({ studentNumber: user.studentNumber, name: user.name }),
  );
  return user;
}

export function loginDemo(personaKey) {
  const profile = clonePersona(personaKey);
  localStorage.setItem(
    STORAGE_KEYS.session,
    JSON.stringify({ studentNumber: profile.studentNumber, name: profile.name, demo: true }),
  );
  saveProfile(profile);
  return profile;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.session);
  localStorage.removeItem(STORAGE_KEYS.profile);
  localStorage.removeItem(STORAGE_KEYS.parsedDocument);
  window.location.href = "index.html";
}

export function requireAuth() {
  const session = getSession();
  if (!session) {
    const next = encodeURIComponent(window.location.pathname.split("/").pop() || "dashboard.html");
    window.location.replace(`index.html?next=${next}`);
    return null;
  }
  return session;
}

export function ensureProfile() {
  const profile = getProfile();
  if (!profile) {
    window.location.replace("onboarding.html");
    return null;
  }
  return profile;
}

import { clonePersona, ensureEvidenceData, STORAGE_KEYS } from "./data.js";
import {
  getCloudValue,
  signInCloudUser,
  signOutCloudUser,
  signUpCloudUser,
  setCloudValue,
} from "./cloud-store.js";

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

export async function saveProfile(profile) {
  const normalized = ensureEvidenceData(profile);
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent("gradquest:profile-updated", { detail: normalized }));
  if (getSession()?.cloud) {
    try {
      await setCloudValue("profile", normalized);
      window.dispatchEvent(new CustomEvent("gradquest:profile-synced", { detail: normalized }));
      return true;
    } catch (error) {
      console.warn("Failed to sync profile to cloud storage.", error);
      window.dispatchEvent(new CustomEvent("gradquest:profile-sync-failed", { detail: { error } }));
      return false;
    }
  }
  return true;
}

export async function registerUser(payload) {
  const cloud = await signUpCloudUser(payload);
  if (cloud) {
    localStorage.setItem(
      STORAGE_KEYS.session,
      JSON.stringify({
        studentNumber: payload.studentNumber,
        name: payload.name,
        email: cloud.email,
        cloud: true,
        userId: cloud.user?.id,
      }),
    );
    return payload;
  }

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

export async function loginUser(studentNumber, password) {
  const cloud = await signInCloudUser(studentNumber, password);
  if (cloud) {
    const account = await getCloudValue("account").catch(() => null);
    const profile = await getCloudValue("profile").catch(() => null);
    const normalizedProfile = profile ? ensureEvidenceData(profile) : null;
    const metadata = cloud.user?.user_metadata || {};
    const session = {
      studentNumber:
        normalizedProfile?.studentNumber ||
        account?.studentNumber ||
        metadata.student_number ||
        String(studentNumber).trim(),
      name: normalizedProfile?.name || account?.name || metadata.name || "GradQuest",
      email: cloud.email,
      cloud: true,
      userId: cloud.user?.id,
    };

    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
    if (normalizedProfile) {
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(normalizedProfile));
    } else {
      const localProfile = getProfile();
      if (localProfile?.studentNumber === session.studentNumber) {
        await setCloudValue("profile", localProfile).catch(() => null);
      }
    }
    return { ...account, ...session };
  }

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
  signOutCloudUser().catch(() => null);
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

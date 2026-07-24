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

function getProfileStorageKey(studentNumber) {
  const owner = String(studentNumber || "").trim();
  return owner ? `${STORAGE_KEYS.profile}:${owner}` : STORAGE_KEYS.profile;
}

function getStoredProfileFor(studentNumber) {
  try {
    return JSON.parse(localStorage.getItem(getProfileStorageKey(studentNumber)));
  } catch {
    return null;
  }
}

function syncNormalizedProfile(profile, session, previousValue = "") {
  const normalized = ensureEvidenceData(profile);
  const nextValue = JSON.stringify(normalized);
  if (nextValue === previousValue) return normalized;
  localStorage.setItem(STORAGE_KEYS.profile, nextValue);
  const owner = normalized.studentNumber || session?.studentNumber;
  if (owner) localStorage.setItem(getProfileStorageKey(owner), nextValue);
  if (session?.cloud) {
    setCloudValue("profile", normalized).catch((error) => {
      console.warn("Failed to sync normalized profile migration.", error);
    });
  }
  return normalized;
}

export function getProfile() {
  try {
    const session = getSession();
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.profile));
    if (session?.studentNumber && profile?.studentNumber !== session.studentNumber) {
      const accountProfile = getStoredProfileFor(session.studentNumber);
      if (accountProfile) {
        return syncNormalizedProfile(accountProfile, session, JSON.stringify(accountProfile));
      }
      return null;
    }
    if (profile?.id === "TEST_P04_PHYS_EARLY") {
      const migrated = clonePersona("softwareEarly");
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(migrated));
      localStorage.setItem(getProfileStorageKey(migrated.studentNumber), JSON.stringify(migrated));
      return migrated;
    }
    return syncNormalizedProfile(profile, session, JSON.stringify(profile));
  } catch {
    return null;
  }
}

export async function saveProfile(profile) {
  const normalized = ensureEvidenceData(profile);
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(normalized));
  const owner = normalized.studentNumber || getSession()?.studentNumber;
  if (owner) localStorage.setItem(getProfileStorageKey(owner), JSON.stringify(normalized));
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

function clearCompletedValues(value) {
  if (Array.isArray(value)) return value.map((item) => clearCompletedValues(item));
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => {
      if (key === "completed") return [key, typeof item === "boolean" ? false : 0];
      return [key, clearCompletedValues(item)];
    }),
  );
}

export function createEmptyProfile(profile, session = getSession()) {
  if (!profile || !session?.studentNumber || session.demo) return null;

  const emptyProfile = clearCompletedValues(ensureEvidenceData(structuredClone(profile)));
  emptyProfile.id = `USER_${session.studentNumber}`;
  emptyProfile.studentNumber = session.studentNumber;
  emptyProfile.name = session.name || emptyProfile.name;
  emptyProfile.currentSemester = 0;
  emptyProfile.gpa = 0;
  emptyProfile.courses = [];
  emptyProfile.nonCurricular = [];
  emptyProfile.evidenceImports = [];
  emptyProfile.academicCalendarEvents = [];
  emptyProfile.programPlans = [];
  emptyProfile.whatIfWorkspace = { activePlanId: null, plans: [] };
  emptyProfile.courseEvidenceGaps = [];
  emptyProfile.lastResetAt = new Date().toISOString();
  return emptyProfile;
}

export async function resetProfileData() {
  const session = getSession();
  if (!session?.studentNumber || session.demo) return false;
  const currentProfile = getProfile();
  const emptyProfile = createEmptyProfile(currentProfile, session);
  if (!emptyProfile) return false;

  const saved = await saveProfile(emptyProfile);
  localStorage.removeItem(STORAGE_KEYS.parsedDocument);
  window.dispatchEvent(new CustomEvent("gradquest:profile-reset", { detail: emptyProfile }));
  return saved;
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
      localStorage.setItem(getProfileStorageKey(session.studentNumber), JSON.stringify(normalizedProfile));
    } else {
      const localProfile = getStoredProfileFor(session.studentNumber) || getProfile();
      if (localProfile?.studentNumber === session.studentNumber) {
        localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(ensureEvidenceData(localProfile)));
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
  const accountProfile = getStoredProfileFor(user.studentNumber);
  if (accountProfile) {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(ensureEvidenceData(accountProfile)));
  } else {
    const activeProfile = getProfile();
    if (!activeProfile || activeProfile.studentNumber !== user.studentNumber) {
      localStorage.removeItem(STORAGE_KEYS.profile);
    }
  }
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

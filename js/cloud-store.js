let clientPromise;
let configPromise;

async function getConfig() {
  if (!configPromise) {
    configPromise = fetch("/api/auth-config", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : {}))
      .catch(() => ({}));
  }
  return configPromise;
}

export function getAuthEmail(identifier) {
  const value = String(identifier || "").trim().toLowerCase();
  if (value.includes("@")) return value;
  return `${value}@gradquest.local`;
}

export async function getCloudClient() {
  if (clientPromise) return clientPromise;
  clientPromise = (async () => {
    const config = await getConfig();
    if (!config.supabaseUrl || !config.supabaseAnonKey) return null;
    const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
    return createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  })().catch(() => null);
  return clientPromise;
}

export async function isCloudEnabled() {
  return Boolean(await getCloudClient());
}

export async function signUpCloudUser({ name, studentNumber, password }) {
  const supabase = await getCloudClient();
  if (!supabase) return null;

  const email = getAuthEmail(studentNumber);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        student_number: studentNumber,
        login_id: studentNumber,
      },
    },
  });

  if (error) throw error;
  if (!data.session) {
    throw new Error("Supabase email confirmation is enabled. Turn it off or confirm the account before signing in.");
  }

  await setCloudValue("account", { name, studentNumber, email, createdAt: new Date().toISOString() });
  return { user: data.user, session: data.session, email };
}

export async function signInCloudUser(identifier, password) {
  const supabase = await getCloudClient();
  if (!supabase) return null;

  const email = getAuthEmail(identifier);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { user: data.user, session: data.session, email };
}

export async function signOutCloudUser() {
  const supabase = await getCloudClient();
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getCloudUser() {
  const supabase = await getCloudClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

export async function getCloudValue(key) {
  const supabase = await getCloudClient();
  const user = await getCloudUser();
  if (!supabase || !user) return null;

  const { data, error } = await supabase
    .from("gradquest_user_data")
    .select("value")
    .eq("user_id", user.id)
    .eq("key", key)
    .maybeSingle();

  if (error) throw error;
  return data?.value || null;
}

export async function setCloudValue(key, value) {
  const supabase = await getCloudClient();
  const user = await getCloudUser();
  if (!supabase || !user) return null;

  const { data, error } = await supabase
    .from("gradquest_user_data")
    .upsert({
      user_id: user.id,
      key,
      value,
      updated_at: new Date().toISOString(),
    })
    .select("key")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCloudValue(key) {
  const supabase = await getCloudClient();
  const user = await getCloudUser();
  if (!supabase || !user) return null;

  const { error } = await supabase
    .from("gradquest_user_data")
    .delete()
    .eq("user_id", user.id)
    .eq("key", key);

  if (error) throw error;
  return true;
}

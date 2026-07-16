export default function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  response.status(200).json({
    supabaseUrl: process.env.SUPABASE_URL || "https://afvpftdfaywxmbugssbt.supabase.co",
    supabaseAnonKey:
      process.env.SUPABASE_ANON_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      "sb_publishable_Seu0CXUiuRqcrn7EAq8ubw_cy63obRU",
  });
}

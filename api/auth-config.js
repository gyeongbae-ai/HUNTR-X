export default function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  response.status(200).json({
    supabaseUrl: process.env.SUPABASE_URL || "https://afvpftdfaywxmbugssbt.supabase.co",
    supabaseAnonKey:
      process.env.SUPABASE_ANON_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmdnBmdGRmYXl3eG1idWdzc2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNTE1MjAsImV4cCI6MjA5OTcyNzUyMH0.PI6Hxc8NbsgUl4HU1CMPgL1nWjOxjEWomqT8Y4nsYhE",
  });
}

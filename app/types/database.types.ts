// Auto-generated Supabase types placeholder
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > app/types/database.types.ts
export type Database = {
  public: {
    Tables: {
      tenants: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      user_profiles: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      chat_sessions: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      chat_messages: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
    }
    Functions: {
      verify_student_pin: { Args: { p_profile_id: string; p_pin: string }; Returns: boolean }
    }
  }
}

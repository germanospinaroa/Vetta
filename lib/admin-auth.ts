import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAuthorizedAdmin() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const { data: member, error: memberError } = await supabase
    .from("admin_members")
    .select("role")
    .eq("user_id", data.user.id)
    .maybeSingle();
  return memberError || !member ? null : data.user;
}

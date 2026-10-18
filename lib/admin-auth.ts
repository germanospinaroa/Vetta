import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminRole = "operator" | "admin";

export async function getAuthorizedAdmin(requiredRole?: AdminRole) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const { data: member, error: memberError } = await supabase
    .from("admin_members")
    .select("role")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (memberError || !member) return null;
  if (requiredRole && member.role !== requiredRole) return null;
  return data.user;
}

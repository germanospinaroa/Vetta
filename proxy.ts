import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response;
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(values) { values.forEach(({ name, value }) => { request.cookies.set(name, value); response = NextResponse.next({ request }); response.cookies.set(name, value); }); },
    },
  });
  const { data } = await supabase.auth.getUser();
  if (!data.user && request.nextUrl.pathname.startsWith("/admin")) {
    const target = new URL("/auth/login", request.url);
    target.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    const redirectResponse = NextResponse.redirect(target);
    response.cookies.getAll().forEach(({ name, value, ...options }) => redirectResponse.cookies.set(name, value, options));
    return redirectResponse;
  }
  return response;
}

export const config = { matcher: ["/admin/:path*", "/auth/:path*"] };

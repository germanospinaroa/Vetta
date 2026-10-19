import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "@/lib/admin-auth";
import { createQaSessionToken, qaSessionCookieName } from "@/lib/qa-session";

export async function POST(request: Request) {
  const admin = await getAuthorizedAdmin("admin");
  if (!admin) return NextResponse.json({ ok: false, code: "unauthorized" }, { status: 401 });
  // A POST-to-GET redirect is required here. The default 307 preserves POST
  // and can prevent the browser from loading the landing as a normal request.
  const response = NextResponse.redirect(new URL("/", request.url), 303);
  response.headers.set("Cache-Control", "private, no-store");
  response.cookies.set(qaSessionCookieName, createQaSessionToken(), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 900 });
  return response;
}

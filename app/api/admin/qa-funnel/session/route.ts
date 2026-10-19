import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "@/lib/admin-auth";
import { createQaSessionToken, qaSessionCookieName } from "@/lib/qa-session";

export async function POST(request: Request) {
  const admin = await getAuthorizedAdmin("admin");
  if (!admin) return NextResponse.json({ ok: false, code: "unauthorized" }, { status: 401 });
  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.set(qaSessionCookieName, createQaSessionToken(), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 900 });
  return response;
}

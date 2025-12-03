import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(req: NextRequest) {
  
  const token = req.cookies.get("Ihamrickadmindashboardtoken")?.value;


  const isAuthPage = req.nextUrl.pathname.startsWith("/login");


  console.log("Middleware triggered for path:", req.nextUrl.pathname);
  console.log("Token found:", token);

  if (!token && !isAuthPage) {
    console.log("No token found. Redirecting to login...");
    return NextResponse.redirect(new URL("/login", req.url));
  }


  if (token && isAuthPage) {
    console.log("User is logged in. Redirecting from login to dashboard...");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }


  console.log("User is authorized or on the login page. Proceeding...");
  return NextResponse.next();
}

// Middleware config to apply it globally to all routes except static files
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", 
  ],
};

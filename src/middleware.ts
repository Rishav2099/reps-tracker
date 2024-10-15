import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in", "/sign-up", "/"]);


export default clerkMiddleware((auth, req) => {
  const { userId } = auth();
  const currentUrl = new URL(req.url);
  const isHomePage = currentUrl.pathname === "/";
  const isApiRequest = currentUrl.pathname.startsWith("/api");

  // If the user is signed in and not on the home page, redirect to /home
  if (userId && isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // If the user is not signed in and trying to access a private route, redirect to /sign-in
  if (!userId) {
    if (!isPublicRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // For API requests, we could return a 401 JSON response instead of redirecting
    if (isApiRequest) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
});


export const config = {
  matcher: [
    // Exclude Next.js internals and static assets (e.g., CSS, JS files)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run middleware for API routes
    "/(api|trpc)(.*)",
  ],
};


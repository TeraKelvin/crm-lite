import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Redirect clients trying to access sales rep routes
    if (token?.role === "CLIENT") {
      if (
        pathname.startsWith("/deals/new") ||
        (pathname.startsWith("/deals/") && pathname !== "/deals")
      ) {
        return NextResponse.redirect(new URL("/client-portal", req.url));
      }
      if (pathname === "/" || pathname === "/deals") {
        return NextResponse.redirect(new URL("/client-portal", req.url));
      }
    }

    // Redirect sales reps trying to access client portal
    if (token?.role === "SALES_REP" && pathname.startsWith("/client-portal")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/deals/:path*",
    "/client-portal/:path*",
  ],
};

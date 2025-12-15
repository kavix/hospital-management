import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        if (path.startsWith("/admin") && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        if (path.startsWith("/doctor") && token?.role !== "doctor") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        if (path.startsWith("/receptionist") && token?.role !== "receptionist") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        if (path.startsWith("/patient") && token?.role !== "patient") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/admin/:path*", "/doctor/:path*", "/receptionist/:path*", "/patient/:path*"],
};

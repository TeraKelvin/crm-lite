"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navLinkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive(path)
        ? "bg-blue-700 text-white"
        : "text-blue-100 hover:bg-blue-600 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-white text-xl font-bold">
                CRM-Lite
              </Link>
              <div className="hidden md:flex ml-10 space-x-4">
                {session?.user.role === "SALES_REP" ? (
                  <>
                    <Link href="/" className={navLinkClass("/")}>
                      Dashboard
                    </Link>
                    <Link href="/deals" className={navLinkClass("/deals")}>
                      Deals
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/client-portal"
                    className={navLinkClass("/client-portal")}
                  >
                    My Deals
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-blue-100 text-sm">
                {session?.user.name}
                {session?.user.role === "CLIENT" && session?.user.companyName && (
                  <span className="ml-1 text-blue-200">
                    ({session.user.companyName})
                  </span>
                )}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-600 hover:text-white"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

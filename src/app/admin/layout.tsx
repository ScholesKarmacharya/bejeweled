"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

type ContactMessage = {
  _id: string;
  status:
    | "New"
    | "Read"
    | "Replied";
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname =
    usePathname();

  const [
    newMessageCount,
    setNewMessageCount,
  ] = useState(0);

  /*
   * Login page should show
   * ONLY the login form.
   */
  const isLoginPage =
    pathname === "/admin/login";

  const links = [
    {
      label: "Dashboard",
      href: "/admin",
    },
    {
      label: "Orders",
      href: "/admin/orders",
    },
    {
      label: "Products",
      href: "/admin/products",
    },
    {
      label: "Messages",
      href: "/admin/messages",
    
    icons: {
  icon: "/icon.png",
  shortcut: "/icon.png",
  apple: "/icon.png",
},},
  ];

  
  
  /* =====================================================
     LOAD NEW MESSAGE COUNT
  ====================================================== */

  useEffect(() => {
    /*
     * Do not fetch admin messages
     * while on login page.
     */
    if (isLoginPage) {
      return;
    }

    async function loadMessageCount() {
      try {
        const response =
          await fetch(
            "/api/admin/messages",
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          return;
        }

        const data =
          await response.json();

        const messages: ContactMessage[] =
          Array.isArray(
            data.messages
          )
            ? data.messages
            : [];

        const count =
          messages.filter(
            (message) =>
              message.status ===
              "New"
          ).length;

        setNewMessageCount(
          count
        );
      } catch (error) {
        console.error(
          "Message badge error:",
          error
        );
      }
    }

    loadMessageCount();
  }, [
    pathname,
    isLoginPage,
  ]);

  /* =====================================================
     ACTIVE LINK
  ====================================================== */

  function isActive(
    href: string
  ) {
    if (href === "/admin") {
      return (
        pathname === "/admin"
      );
    }

    return pathname.startsWith(
      href
    );
  }

  /* =====================================================
     LOGIN PAGE
     NO ADMIN NAVIGATION
  ====================================================== */

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[#f6f0e4]">
        {children}
      </div>
    );
  }

  /* =====================================================
     AUTHENTICATED ADMIN AREA
  ====================================================== */

  return (
    <div className="min-h-screen bg-[#f7f7f5]">

      {/* =================================================
          ADMIN NAVIGATION
      ================================================= */}

      <div className="border-b border-gray-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <nav className="flex flex-wrap gap-2 py-4">

            {links.map(
              (link) => {
                const active =
                  isActive(
                    link.href
                  );

                const isMessages =
                  link.href ===
                  "/admin/messages";

                return (
                  <Link
                    key={
                      link.href
                    }
                    href={
                      link.href
                    }
                    className={`relative rounded-xl px-5 py-2.5 text-sm font-semibold transition duration-200 ${
                      active
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black"
                    }`}
                  >
                    {link.label}

                    {isMessages &&
                      newMessageCount >
                        0 && (
                        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white shadow-sm">
                          {newMessageCount >
                          99
                            ? "99+"
                            : newMessageCount}
                        </span>
                      )}

                  </Link>
                );
              }
            )}

          </nav>

        </div>

      </div>

      {/* =================================================
          ADMIN PAGE CONTENT
      ================================================= */}

      {children}

    </div>
  );
}
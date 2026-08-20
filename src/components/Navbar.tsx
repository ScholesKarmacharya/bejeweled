"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const { cartCount } =
    useCart();

  const navLinks = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Products",
      href: "/products",
    },
    {
      label: "About Us",
      href: "/about",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ];

  /* =====================================================
     CLOSE MOBILE MENU AFTER NAVIGATION
  ====================================================== */

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function isActive(
    href: string
  ) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(
      href
    );
  }

  const trackOrderActive =
    pathname.startsWith(
      "/track-order"
    );

  const cartActive =
    pathname.startsWith(
      "/cart"
    );

  return (
    <header className="sticky top-0 z-50 border-b border-[#c9a45b]/15 bg-[#150b07]/95 text-white backdrop-blur-md">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          href="/"
          aria-label="Bejeweled home"
          className="group inline-flex items-center"
        >

          <div className="flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-full sm:h-[74px] sm:w-[74px]">

            <img
              src="/logo.jpeg"
              alt="Bejeweled"
              className="h-[82px] w-[82px] max-w-none object-cover transition duration-300 group-hover:scale-[1.04]"
            />

          </div>

        </Link>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <div className="hidden items-center gap-8 md:flex lg:gap-9">

          {navLinks.map(
            (link) => {

              const active =
                isActive(
                  link.href
                );

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition duration-300 lg:text-[12px] ${
                    active
                      ? "text-[#ddb96c]"
                      : "text-white/70 hover:text-[#ddb96c]"
                  }`}
                >
                  {link.label}

                  <span
                    className={`absolute bottom-0 left-0 h-px bg-[#d6b15f] transition-all duration-300 ${
                      active
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />

                </Link>
              );
            }
          )}

          {/* TRACK ORDER */}

          <Link
            href="/track-order"
            className={`group relative py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition duration-300 lg:text-[12px] ${
              trackOrderActive
                ? "text-[#ddb96c]"
                : "text-white/70 hover:text-[#ddb96c]"
            }`}
          >
            Track Order

            <span
              className={`absolute bottom-0 left-0 h-px bg-[#d6b15f] transition-all duration-300 ${
                trackOrderActive
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
            />

          </Link>

          {/* CART */}

          <Link
            href="/cart"
            aria-label="Shopping cart"
            className={`group relative ml-1 flex h-10 w-10 items-center justify-center rounded-full border transition duration-300 ${
              cartActive
                ? "border-[#c9a45b]/60 bg-[#c9a45b]/10 text-[#e1bf77]"
                : "border-white/10 text-white/80 hover:border-[#c9a45b]/50 hover:bg-[#c9a45b]/10 hover:text-[#e1bf77]"
            }`}
          >

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.6}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25h9.75c.725 0 1.35-.49 1.545-1.188l1.5-5.25A1.125 1.125 0 0019.212 6.375H5.106m2.394 7.875L6.375 17.25m1.125-3h9.75m-9.75 0L5.106 6.375m0 0L4.5 3.75M8.25 21a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0zm9.75 0a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z"
              />
            </svg>

            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d8b260] px-1 text-[9px] font-bold text-[#1a0d07] shadow-sm">

                {cartCount > 99
                  ? "99+"
                  : cartCount}

              </span>
            )}

          </Link>

        </div>

        {/* =================================================
            MOBILE RIGHT SIDE
        ================================================= */}

        <div className="flex items-center gap-2 md:hidden">

          {/* MOBILE CART */}

          <Link
            href="/cart"
            aria-label="Shopping cart"
            className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition duration-300 ${
              cartActive
                ? "border-[#c9a45b]/60 bg-[#c9a45b]/10 text-[#e1bf77]"
                : "border-white/15 text-white/85 hover:border-[#c9a45b]/50 hover:bg-[#c9a45b]/10 hover:text-[#e1bf77]"
            }`}
          >

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.7}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25h9.75c.725 0 1.35-.49 1.545-1.188l1.5-5.25A1.125 1.125 0 0019.212 6.375H5.106m2.394 7.875L6.375 17.25m1.125-3h9.75m-9.75 0L5.106 6.375m0 0L4.5 3.75M8.25 21a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0zm9.75 0a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z"
              />
            </svg>

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d8b260] px-1 text-[9px] font-bold text-[#1a0d07]">

                {cartCount > 99
                  ? "99+"
                  : cartCount}

              </span>
            )}

          </Link>

          {/* MENU BUTTON */}

          <button
            type="button"
            onClick={() =>
              setMenuOpen(
                (current) =>
                  !current
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/85 transition duration-300 hover:border-[#c9a45b]/50 hover:bg-[#c9a45b]/10 hover:text-[#e1bf77]"
            aria-label={
              menuOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={
              menuOpen
            }
          >

            {menuOpen ? (

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path
                  strokeLinecap="round"
                  d="M6 6l12 12M18 6 6 18"
                />
              </svg>

            ) : (

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path
                  strokeLinecap="round"
                  d="M5 7h14M5 12h14M5 17h14"
                />
              </svg>

            )}

          </button>

        </div>

      </nav>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      <div
        className={`overflow-hidden border-t border-[#c9a45b]/15 bg-[#150b07] transition-all duration-300 md:hidden ${
          menuOpen
            ? "max-h-[520px] opacity-100"
            : "max-h-0 border-t-0 opacity-0"
        }`}
      >

        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">

          {navLinks.map(
            (link) => {

              const active =
                isActive(
                  link.href
                );

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex items-center justify-between border-b border-white/[0.07] py-4 text-sm font-medium transition ${
                    active
                      ? "text-[#ddb96c]"
                      : "text-white/70 hover:text-[#ddb96c]"
                  }`}
                >

                  <span>
                    {link.label}
                  </span>

                  <span className="text-[#a98746] transition duration-300 group-hover:translate-x-1">
                    →
                  </span>

                </Link>
              );
            }
          )}

          {/* TRACK ORDER */}

          <Link
            href="/track-order"
            className={`group flex items-center justify-between border-b border-white/[0.07] py-4 text-sm font-medium transition ${
              trackOrderActive
                ? "text-[#ddb96c]"
                : "text-white/70 hover:text-[#ddb96c]"
            }`}
          >

            <span>
              Track Order
            </span>

            <span className="text-[#a98746] transition duration-300 group-hover:translate-x-1">
              →
            </span>

          </Link>

          {/* CART */}

          <Link
            href="/cart"
            className={`flex items-center justify-between py-4 text-sm font-medium transition ${
              cartActive
                ? "text-[#ddb96c]"
                : "text-white/70 hover:text-[#ddb96c]"
            }`}
          >

            <span>
              Cart
            </span>

            {cartCount > 0 ? (

              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#d8b260] px-2 text-[10px] font-bold text-[#1a0d07]">

                {cartCount > 99
                  ? "99+"
                  : cartCount}

              </span>

            ) : (

              <span className="text-[#a98746]">
                →
              </span>

            )}

          </Link>

        </div>

      </div>

    </header>
  );
}
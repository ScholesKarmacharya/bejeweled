import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#b9975b]/20 bg-[#17110c] text-white">

      {/* =====================================================
          MAIN FOOTER
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16 lg:px-8">

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="max-w-sm">

            
              <div className="flex h-[82px] w-[82px] items-center justify-center overflow-hidden rounded-full">

                <img
                  src="/logo.jpeg"
                  alt="Bejeweled"
                  className="h-[96px] w-[96px] max-w-none object-cover transition duration-300 group-hover:scale-105"
                />

              </div>
            

            <p className="mt-5 text-sm leading-7 text-white/55">
              Original brass and gold plated jewelry selected
              for everyday elegance, meaningful celebrations,
              and moments worth remembering.
            </p>

            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c9a766]">
              Elegance in Every Detail
            </p>

          </div>

          {/* =================================================
              SHOP
          ================================================= */}

          <div>

            <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a766]">
              Shop
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <Link
                href="/products"
                className="w-fit text-sm text-white/60 transition duration-200 hover:translate-x-1 hover:text-[#e0bd72]"
              >
                All Jewelry
              </Link>

              <Link
                href="/products?category=Necklace"
                className="w-fit text-sm text-white/60 transition duration-200 hover:translate-x-1 hover:text-[#e0bd72]"
              >
                Necklaces
              </Link>

              <Link
                href="/products?category=Ring"
                className="w-fit text-sm text-white/60 transition duration-200 hover:translate-x-1 hover:text-[#e0bd72]"
              >
                Rings
              </Link>

              <Link
                href="/products?category=Earring"
                className="w-fit text-sm text-white/60 transition duration-200 hover:translate-x-1 hover:text-[#e0bd72]"
              >
                Earrings
              </Link>


              <Link
                href="/products?category=Bangles"
                className="w-fit text-sm text-white/60 transition duration-200 hover:translate-x-1 hover:text-[#e0bd72]"
              >
                Bangles
              </Link>

            </div>

          </div>

          {/* =================================================
              INFORMATION
          ================================================= */}

          <div>

            <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a766]">
              Information
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <Link
                href="/about"
                className="w-fit text-sm text-white/60 transition duration-200 hover:translate-x-1 hover:text-[#e0bd72]"
              >
                About Us
              </Link>

              <Link
                href="/contact"
                className="w-fit text-sm text-white/60 transition duration-200 hover:translate-x-1 hover:text-[#e0bd72]"
              >
                Contact
              </Link>

              <Link
                href="/track-order"
                className="w-fit text-sm text-white/60 transition duration-200 hover:translate-x-1 hover:text-[#e0bd72]"
              >
                Track Order
              </Link>

              <Link
                href="/cart"
                className="w-fit text-sm text-white/60 transition duration-200 hover:translate-x-1 hover:text-[#e0bd72]"
              >
                Your Cart
              </Link>

            </div>

          </div>

          {/* =================================================
              CONTACT
          ================================================= */}

          <div>

            <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a766]">
              Contact
            </h3>

            <div className="mt-5 space-y-4 text-sm leading-6 text-white/60">

              {/* LOCATION */}

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9f824c]">
                  Location
                </p>

                <p className="mt-1.5">
                  Butwal, Nepal
                </p>

              </div>

              {/* PHONE */}

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9f824c]">
                  Phone
                </p>

                <a
                  href="tel:+9779749397472"
                  className="mt-1.5 inline-block transition hover:text-[#e0bd72]"
                >
                  +977 9749397472
                </a>

              </div>

              {/* EMAIL */}

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9f824c]">
                  Email
                </p>

                <a
                  href="mailto:contact@bejeweled.com"
                  className="mt-1.5 inline-block break-all transition hover:text-[#e0bd72]"
                >
                  contact@bejeweled.com
                </a>

              </div>

            </div>

            {/* =================================================
                SOCIAL MEDIA
            ================================================= */}

            <div className="mt-7 border-t border-white/10 pt-6">

              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9f824c]">
                Follow Us
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">

                {/* INSTAGRAM */}

                <a
                  href="https://www.instagram.com/bejeweled.4u/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Bejeweled on Instagram"
                  className="group inline-flex items-center gap-2 text-sm text-white/60 transition duration-300 hover:text-[#e0bd72]"
                >

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                    aria-hidden="true"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="5"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="4"
                    />

                    <circle
                      cx="17.5"
                      cy="6.5"
                      r="0.8"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>

                  <span>
                    Instagram
                  </span>

                </a>

                {/* FACEBOOK */}

                <a
                  href="https://www.facebook.com/bejewel3d"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Bejeweled on Facebook"
                  className="group inline-flex items-center gap-2 text-sm text-white/60 transition duration-300 hover:text-[#e0bd72]"
                >

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                    aria-hidden="true"
                  >
                    <path d="M13.5 22v-9h3l.5-3.5h-3.5V7.25c0-1.02.28-1.71 1.75-1.71H17V2.41c-.3-.04-1.34-.13-2.55-.13-2.52 0-4.25 1.54-4.25 4.37V9.5H7.35V13h2.85v9h3.3Z" />
                  </svg>

                  <span>
                    Facebook
                  </span>

                </a>

                {/* TIKTOK */}

                <a
                  href="https://www.tiktok.com/@bejeweled.4u"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Bejeweled on TikTok"
                  className="group inline-flex items-center gap-2 text-sm text-white/60 transition duration-300 hover:text-[#e0bd72]"
                >

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                    aria-hidden="true"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2-2.75V9.4a6.33 6.33 0 1 0 5.45 6.27V8.73a8.16 8.16 0 0 0 4.77 1.52V6.82c-.34 0-.67-.04-1-.13Z" />
                  </svg>

                  <span>
                    TikTok
                  </span>

                </a>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          BOTTOM BAR
      ====================================================== */}

      <div className="border-t border-white/[0.08]">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-[11px] sm:flex-row sm:items-center sm:justify-between lg:px-8">

          <p className="text-white/35">
            © {new Date().getFullYear()} Bejeweled. All rights reserved.
          </p>

          <p className="text-[#c9a766]/60">
            Original Brass & Gold Plated Jewelry
          </p>

        </div>

      </div>

    </footer>
  );
}
import Link from "next/link";

import {
  Cormorant_Garamond,
  Allura,
  Montserrat,
} from "next/font/google";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

/* =====================================================
   PRODUCT TYPE
====================================================== */

type ProductItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  featured: boolean;
};

/* =====================================================
   REVALIDATION
====================================================== */

export const revalidate = 60;

/* =====================================================
   CATEGORIES
====================================================== */

const categories = [
  {
    name: "Rings",
    subtitle:
      "Timeless pieces for every moment",
    image: "/ring.png",
    category: "Ring",
  },

  {
    name: "Necklaces",
    subtitle:
      "Elegant details made to stand out",
    image: "/necklace.png",
    category: "Necklace",
  },

  {
    name: "Watches",
    subtitle:
      "Classic style with lasting character",
    image: "/watch.png",
    category: "Watch",
  },

  {
    name: "Bangles",
    subtitle:
      "Traditional elegance with a modern finish",
    image: "/bengals.png",
    category: "Bangles",
  },

  {
    name: "Earrings",
    subtitle:
      "Refined accents for every occasion",
    image: "/earing.png",
    category: "Earring",
  },
];

/* =====================================================
   FONTS
====================================================== */

const cormorant =
  Cormorant_Garamond({
    subsets: ["latin"],
    weight: [
      "400",
      "500",
      "600",
    ],
  });

const allura = Allura({
  subsets: ["latin"],
  weight: "400",
});

const montserrat =
  Montserrat({
    subsets: ["latin"],
    weight: [
      "400",
      "500",
      "600",
    ],
  });

/* =====================================================
   LOAD FEATURED PRODUCTS
====================================================== */

async function getFeaturedProducts(): Promise<
  ProductItem[]
> {
  try {
    await connectDB();

    /*
      We only request the four products
      required by the homepage.
    */

    let products =
      await Product.find({
        featured: true,
      })
        .select(
          "_id name description price category image stock featured"
        )
        .sort({
          createdAt: -1,
        })
        .limit(4)
        .lean();

    /*
      Same behavior as before:
      if no featured products exist,
      show four newest products.
    */

    if (products.length === 0) {
      products =
        await Product.find()
          .select(
            "_id name description price category image stock featured"
          )
          .sort({
            createdAt: -1,
          })
          .limit(4)
          .lean();
    }

    return products.map(
      (product) => ({
        _id: String(
          product._id
        ),

        name:
          product.name ?? "",

        description:
          product.description ??
          "",

        price:
          Number(
            product.price ?? 0
          ),

        category:
          product.category ??
          "",

        image:
          product.image ?? "",

        stock:
          Number(
            product.stock ?? 0
          ),

        featured:
          Boolean(
            product.featured
          ),
      })
    );
  } catch (error) {
    console.error(
      "Homepage products error:",
      error
    );

    return [];
  }
}

/* =====================================================
   HOME
====================================================== */

export default async function Home() {
  const featuredProducts =
    await getFeaturedProducts();

  return (
    <main className="bg-[#f6f0e4] text-[#1d1b18]">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative min-h-[88vh] overflow-hidden bg-[#120805]">

        {/* BACKGROUND IMAGE */}

        <img
          src="/banner.png"
          alt="Bejeweled gold plated jewelry collection"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* DARK OVERLAY */}

        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#160906]/95 via-[#160906]/65 to-transparent" />

        {/* CONTENT */}

        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl items-center px-6 py-20 sm:px-8 lg:px-10">

          <div className="max-w-[650px]">

            <p
              className={`${montserrat.className} text-[11px] font-medium uppercase tracking-[0.55em] text-[#d4ad61] sm:text-xs`}
            >
              Bejeweled
            </p>

            <div className="mt-5 flex items-center gap-3">

              <span className="h-px w-10 bg-[#b98c3f]" />

              <span className="text-[15px] text-[#c59a4f]">
                ❈
              </span>

              <span className="h-px w-10 bg-[#b98c3f]" />

            </div>

            <h1
              className={`${cormorant.className} mt-7 text-[48px] font-medium leading-[0.95] tracking-[-0.025em] text-[#f8f5ef] sm:text-[62px] lg:text-[76px]`}
            >
              Timeless Beauty,
            </h1>

            <p
              className={`${allura.className} -mt-1 text-[52px] leading-none text-[#d7ad61] sm:text-[68px] lg:text-[82px]`}
            >
              Crafted for You
            </p>

            <div
              className={`${montserrat.className} mt-8 space-y-1 text-[14px] leading-7 text-[#f1e6d3] sm:text-[16px]`}
            >
              <p>
                Original Brass &amp;
                Gold Plated Jewelry{" "}

                <span className="text-[#e9bd60]">
                  ✦
                </span>
              </p>

              <p className="text-white/75">
                Elegance in Every Detail.
              </p>
            </div>

            <div className="mt-7 flex max-w-[285px] items-center gap-3">

              <span className="h-px flex-1 bg-[#a77c38]/80" />

              <span className="text-xs text-[#c99b4c]">
                ❈
              </span>

              <span className="h-px flex-1 bg-[#a77c38]/80" />

            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <Link
                href="/products"
                className={`${montserrat.className} inline-flex min-w-[215px] items-center justify-center rounded-full bg-gradient-to-r from-[#f3d18b] to-[#d6a64e] px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#211408] shadow-[0_8px_28px_rgba(201,154,73,0.18)] transition duration-300 hover:-translate-y-0.5 hover:from-[#f7dda4] hover:to-[#e2b862] hover:shadow-[0_12px_32px_rgba(201,154,73,0.28)]`}
              >
                Shop Collection
              </Link>

              <Link
                href="/about"
                className={`${montserrat.className} inline-flex min-w-[175px] items-center justify-center rounded-full border border-[#d2a851] px-7 py-3.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[#efd49b] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d2a851] hover:text-[#1a0d07]`}
              >
                Our Story
              </Link>

            </div>

            {/* TRUST POINTS */}

            <div className="mt-12 grid max-w-[620px] grid-cols-1 gap-5 border-t border-[#a77c38]/20 pt-7 sm:grid-cols-3 sm:gap-0">

              <div className="group flex items-center gap-3 sm:border-r sm:border-[#a77c38]/35 sm:pr-6">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[#d1a752] transition duration-300 group-hover:scale-110">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-8 w-8"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  >
                    <path d="M3 8l4-5h10l4 5-9 13L3 8Z" />
                    <path d="M3 8h18M7 3l5 18M17 3l-5 18" />
                  </svg>

                </div>

                <p
                  className={`${montserrat.className} text-[10px] font-medium uppercase leading-5 tracking-[0.08em] text-[#e6c278]`}
                >
                  Premium
                  <br />
                  Quality
                </p>

              </div>

              <div className="group flex items-center gap-3 sm:border-r sm:border-[#a77c38]/35 sm:px-6">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[#d1a752] transition duration-300 group-hover:scale-110">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-8 w-8"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <circle cx="12" cy="5" r="3" />
                    <circle cx="12" cy="19" r="3" />
                    <circle cx="5" cy="12" r="3" />
                    <circle cx="19" cy="12" r="3" />
                  </svg>

                </div>

                <p
                  className={`${montserrat.className} text-[10px] font-medium uppercase leading-5 tracking-[0.08em] text-[#e6c278]`}
                >
                  Handcrafted
                  <br />
                  Design
                </p>

              </div>

              <div className="group flex items-center gap-3 sm:pl-6">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[#d1a752] transition duration-300 group-hover:scale-110">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-8 w-8"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  >
                    <path d="M12 2 20 5v6c0 5-3.2 8.6-8 11-4.8-2.4-8-6-8-11V5l8-3Z" />
                    <path d="m8.5 12 2.2 2.2 4.8-5" />
                  </svg>

                </div>

                <p
                  className={`${montserrat.className} text-[10px] font-medium uppercase leading-5 tracking-[0.08em] text-[#e6c278]`}
                >
                  Long Lasting
                  <br />
                  Finish
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CATEGORIES
      ====================================================== */}

      <section className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="flex items-end justify-between gap-6">

            <div>

              <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#98763f]">
                Discover
              </p>

              <h2 className="mt-2 text-3xl font-medium tracking-[-0.02em] text-[#211d18]">
                Shop by Category
              </h2>

            </div>

            <Link
              href="/products"
              className="hidden items-center gap-2 text-sm font-medium text-gray-500 transition duration-200 hover:text-[#9a7740] sm:inline-flex"
            >
              View All
              <span>→</span>
            </Link>

          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">

            {categories.map(
              (category) => (
                <Link
                  key={
                    category.name
                  }
                  href={`/products?category=${encodeURIComponent(
                    category.category
                  )}`}
                  className="group relative overflow-hidden rounded-[18px] bg-[#211d18] sm:rounded-[24px]"
                >

                  <img
                    src={
                      category.image
                    }
                    alt={
                      category.name
                    }
                    className="h-[235px] w-full object-cover transition duration-500 ease-out group-hover:scale-[1.045] sm:h-[330px] lg:h-[390px]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">

                    <p className="hidden text-xs leading-5 text-white/65 sm:block">
                      {
                        category.subtitle
                      }
                    </p>

                    <div className="mt-1 flex items-end justify-between gap-3 sm:mt-2">

                      <h3 className="text-lg font-medium text-white sm:text-2xl">
                        {
                          category.name
                        }
                      </h3>

                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/40 text-sm text-white transition duration-300 group-hover:border-[#d2b16a] group-hover:bg-[#d2b16a] group-hover:text-[#211d18] sm:h-10 sm:w-10">
                        →
                      </span>

                    </div>

                  </div>

                </Link>
              )
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          FEATURED COLLECTION
      ====================================================== */}

      <section className="bg-[#fffaf2] px-6 py-20 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9a7a45]">
                Curated by Bejeweled
              </p>

              <h2 className="mt-2 text-3xl font-medium tracking-tight text-[#211d18]">
                Featured Collection
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                A refined selection
                of pieces chosen
                for timeless style,
                detail, and everyday
                elegance.
              </p>

            </div>

            <Link
              href="/products"
              className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#9a7a45]"
            >
              Shop All

              <span className="transition duration-300 group-hover:translate-x-1">
                →
              </span>

            </Link>

          </div>

          {featuredProducts.length >
          0 ? (

            <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">

              {featuredProducts.map(
                (product) => (
                  <div
                    key={
                      product._id
                    }
                    className="group"
                  >

                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#f4f1eb]">

                      <img
                        src={
                          product.image
                        }
                        alt={
                          product.name
                        }
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
                      />

                      {product.featured && (

                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#8a6d3d] backdrop-blur">
                          Featured
                        </span>

                      )}

                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100">

                        <div className="w-full p-4">

                          <div className="rounded-xl bg-white/90 px-4 py-3 text-center backdrop-blur">

                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a6d3d]">
                              Bejeweled Selection
                            </p>

                            <p className="mt-1 text-xs text-gray-600">
                              Chosen for timeless elegance
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                    <div className="mt-4">

                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9a7a45]">
                        {
                          product.category
                        }
                      </p>

                      <div className="mt-1 flex items-start justify-between gap-3">

                        <h3 className="text-[15px] font-medium leading-6 text-[#211d18] transition group-hover:text-[#9a7a45]">
                          {
                            product.name
                          }
                        </h3>

                        <p className="shrink-0 text-sm font-medium text-gray-700">
                          Rs.{" "}
                          {product.price.toLocaleString()}
                        </p>

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>

          ) : (

            <div className="mt-10 rounded-2xl border border-gray-200 bg-[#faf9f7] px-6 py-14 text-center">

              <p className="text-sm text-gray-500">
                Featured collection
                pieces will appear
                here once products
                are added.
              </p>

            </div>

          )}

        </div>

      </section>

      {/* =====================================================
          EDITORIAL STORY
      ====================================================== */}

      <section className="px-6 py-24 lg:px-8">

        <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-[#b9975b]/20 bg-[#1c1711] shadow-[0_24px_70px_rgba(48,35,15,0.12)]">

          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">

            <div className="group relative min-h-[520px] overflow-hidden">

              <img
                src="/edit.png"
                alt="Bejeweled jewelry craftsmanship"
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6">

                <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/25 px-4 py-2 backdrop-blur-md">

                  <span className="h-1.5 w-1.5 rounded-full bg-[#d8b96e]" />

                  <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-white/85">
                    Detail. Finish.
                    Presence.
                  </p>

                </div>

              </div>

            </div>

            <div className="relative flex items-center px-8 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">

              <div className="absolute left-8 top-10 h-px w-16 bg-[#b9975b]/50 sm:left-12 lg:left-16" />

              <div className="max-w-xl">

                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#d0ae68]">
                  The Bejeweled Standard
                </p>

                <h2 className="mt-5 text-3xl font-medium leading-tight tracking-[-0.025em] text-white sm:text-4xl lg:text-[44px]">
                  Designed to be noticed.

                  <span className="block text-[#d4b56f]">
                    Chosen to be remembered.
                  </span>

                </h2>

                <p className="mt-6 text-sm leading-7 text-white/60 sm:text-base">
                  We look beyond
                  the first impression.
                  Proportion, finish,
                  balance, and how
                  a piece feels when
                  worn all matter.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">

                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition duration-300 hover:border-[#b9975b]/40 hover:bg-white/[0.055]">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#c9a85f]">
                      01
                    </p>

                    <h3 className="mt-2 text-sm font-semibold text-white">
                      Refined Selection
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-white/45">
                      Pieces chosen
                      for balance,
                      finish, and
                      lasting appeal.
                    </p>

                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition duration-300 hover:border-[#b9975b]/40 hover:bg-white/[0.055]">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#c9a85f]">
                      02
                    </p>

                    <h3 className="mt-2 text-sm font-semibold text-white">
                      Everyday Luxury
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-white/45">
                      Jewelry made
                      to feel special
                      without feeling
                      excessive.
                    </p>

                  </div>

                </div>

                <Link
                  href="/about"
                  className="group mt-9 inline-flex items-center gap-3 rounded-full border border-[#b9975b]/45 px-5 py-3 text-sm font-semibold text-[#e0c17d] transition duration-300 hover:-translate-y-0.5 hover:border-[#d5b66f] hover:bg-[#d5b66f] hover:text-[#1c1711]"
                >
                  Discover Our Story

                  <span className="transition duration-300 group-hover:translate-x-1">
                    →
                  </span>

                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          SERVICE STRIP
      ====================================================== */}

      <section className="border-y border-[#c9b07a]/25 bg-[#efe4cf] px-6 py-16 sm:py-20 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-5 md:grid-cols-3">

            {[
              {
                number: "01",

                title:
                  "Thoughtfully Selected",

                text:
                  "Jewelry chosen with attention to proportion, finish, and lasting everyday appeal.",
              },

              {
                number: "02",

                title:
                  "Personal Order Review",

                text:
                  "Every order is reviewed before moving into preparation, fulfilment, and delivery.",
              },

              {
                number: "03",

                title:
                  "Clear Order Tracking",

                text:
                  "Follow your order from payment review through preparation, dispatch, and delivery.",
              },
            ].map(
              (item) => (
                <div
                  key={
                    item.number
                  }
                  className="group rounded-2xl border border-transparent px-2 py-2 transition duration-300 hover:-translate-y-1 hover:border-[#c9b07a]/25 hover:bg-white/70 hover:shadow-[0_12px_30px_rgba(80,60,30,0.06)] md:px-5 md:py-6"
                >

                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#b99654]/30 bg-[#ebe2cf] text-xs font-semibold text-[#8b6a32] transition duration-300 group-hover:bg-[#c9a861] group-hover:text-[#1d1811]">
                      {
                        item.number
                      }
                    </div>

                    <div>

                      <h3 className="text-lg font-medium text-[#211d18]">
                        {
                          item.title
                        }
                      </h3>

                      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">
                        {
                          item.text
                        }
                      </p>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="px-6 py-20 sm:py-24 lg:px-8">

        <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-[#1a1712]">

          <div className="px-7 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">

            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#c7a55d]">
              Bejeweled Collection
            </p>

            <h2 className="mt-4 max-w-2xl text-3xl font-medium leading-tight tracking-[-0.025em] text-white sm:text-4xl lg:text-5xl">
              Find something worth
              holding on to.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
              Explore jewelry
              selected for the
              moments that matter,
              from everyday pieces
              to something a little
              more special.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#d2b16a] px-7 py-3.5 text-sm font-semibold text-[#19150f] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e4c987] hover:shadow-[0_10px_30px_rgba(210,177,106,0.18)]"
              >
                Explore Collection
                <span>→</span>
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-white/80 transition duration-300 hover:border-[#c7a55d]/70 hover:bg-white/5 hover:text-[#e4c987]"
              >
                Need Help Choosing?
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
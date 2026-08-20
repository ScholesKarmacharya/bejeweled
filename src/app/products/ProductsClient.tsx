"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import {
  useCart,
} from "@/context/CartContext";

import type {
  ProductItem,
} from "./page";

/* =====================================================
   CATEGORIES
====================================================== */

const categories = [
  "All",
  "Necklace",
  "Watch",
  "Earring",
  "Ring",
  "Bangles",
];

/* =====================================================
   COMPONENT
====================================================== */

type ProductsClientProps = {
  initialProducts: ProductItem[];
};

export default function ProductsClient({
  initialProducts,
}: ProductsClientProps) {
  /*
    Products are already loaded by the server.

    No useEffect fetch.
    No loading screen.
    No API request during initial page load.
  */

  const [products] =
    useState<ProductItem[]>(
      initialProducts
    );

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    notification,
    setNotification,
  ] = useState("");

  /* =====================================================
     QUANTITY SELECTED BEFORE ADDING TO CART
  ====================================================== */

  const [
    selectedQuantities,
    setSelectedQuantities,
  ] = useState<
    Record<string, number>
  >({});

  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  /* =====================================================
     READ CATEGORY FROM URL
  ====================================================== */

  useEffect(() => {
    function readCategoryFromUrl() {
      const params =
        new URLSearchParams(
          window.location.search
        );

      const categoryFromUrl =
        params.get("category");

      if (!categoryFromUrl) {
        setSelectedCategory(
          "All"
        );

        return;
      }

      const validCategory =
        categories.find(
          (category) =>
            category.toLowerCase() ===
            categoryFromUrl.toLowerCase()
        );

      setSelectedCategory(
        validCategory ??
          "All"
      );
    }

    readCategoryFromUrl();

    window.addEventListener(
      "popstate",
      readCategoryFromUrl
    );

    return () => {
      window.removeEventListener(
        "popstate",
        readCategoryFromUrl
      );
    };
  }, []);

  /* =====================================================
     CATEGORY CHANGE
  ====================================================== */

  function handleCategoryChange(
    category: string
  ) {
    setSelectedCategory(
      category
    );

    if (
      category === "All"
    ) {
      window.history.pushState(
        {},
        "",
        "/products"
      );

      return;
    }

    window.history.pushState(
      {},
      "",
      `/products?category=${encodeURIComponent(
        category
      )}`
    );
  }

  /* =====================================================
     FILTER PRODUCTS
  ====================================================== */

  const filteredProducts =
    products.filter(
      (product) => {
        const matchesCategory =
          selectedCategory ===
            "All" ||
          product.category
            .toLowerCase() ===
            selectedCategory.toLowerCase();

        const query =
          searchQuery
            .trim()
            .toLowerCase();

        const matchesSearch =
          !query ||
          product.name
            .toLowerCase()
            .includes(query) ||
          product.category
            .toLowerCase()
            .includes(query) ||
          product.description
            .toLowerCase()
            .includes(query);

        return (
          matchesCategory &&
          matchesSearch
        );
      }
    );

  /* =====================================================
     CART QUANTITY
  ====================================================== */

  function getCartQuantity(
    productId: string
  ) {
    const item =
      cart.find(
        (item) =>
          item._id ===
          productId
      );

    return (
      item?.quantity ?? 0
    );
  }

  /* =====================================================
     SELECTED QUANTITY
  ====================================================== */

  function getSelectedQuantity(
    productId: string
  ) {
    return (
      selectedQuantities[
        productId
      ] ?? 0
    );
  }

  /* =====================================================
     INCREASE
  ====================================================== */

  function handleIncrease(
    product: ProductItem
  ) {
    const cartQuantity =
      getCartQuantity(
        product._id
      );

    if (cartQuantity > 0) {
      if (
        cartQuantity <
        product.stock
      ) {
        increaseQuantity(
          product._id
        );
      }

      return;
    }

    const currentQuantity =
      getSelectedQuantity(
        product._id
      );

    if (
      currentQuantity <
      product.stock
    ) {
      setSelectedQuantities(
        (previous) => ({
          ...previous,

          [product._id]:
            currentQuantity +
            1,
        })
      );
    }
  }

  /* =====================================================
     DECREASE
  ====================================================== */

  function handleDecrease(
    product: ProductItem
  ) {
    const cartQuantity =
      getCartQuantity(
        product._id
      );

    if (cartQuantity > 0) {
      if (
        cartQuantity > 1
      ) {
        decreaseQuantity(
          product._id
        );
      }

      return;
    }

    const currentQuantity =
      getSelectedQuantity(
        product._id
      );

    if (
      currentQuantity > 0
    ) {
      setSelectedQuantities(
        (previous) => ({
          ...previous,

          [product._id]:
            currentQuantity -
            1,
        })
      );
    }
  }

  /* =====================================================
     ADD TO CART
  ====================================================== */

  function handleAddToCart(
    product: ProductItem
  ) {
    const cartQuantity =
      getCartQuantity(
        product._id
      );

    if (cartQuantity > 0) {
      setNotification(
        `${product.name} is already in your cart`
      );

      window.setTimeout(
        () => {
          setNotification(
            ""
          );
        },
        3000
      );

      return;
    }

    const selectedQuantity =
      getSelectedQuantity(
        product._id
      );

    if (
      selectedQuantity ===
      0
    ) {
      return;
    }

    for (
      let index = 0;
      index <
      selectedQuantity;
      index++
    ) {
      addToCart(
        product
      );
    }

    setNotification(
      `${product.name} added to your cart`
    );

    window.setTimeout(
      () => {
        setNotification(
          ""
        );
      },
      3000
    );

    setSelectedQuantities(
      (previous) => ({
        ...previous,

        [product._id]:
          0,
      })
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f4ec]">

      {/* =====================================================
          NOTIFICATION
      ====================================================== */}

      {notification && (

        <div className="fixed right-4 top-24 z-50 w-[calc(100%-2rem)] max-w-md sm:right-6">

          <div className="flex items-start gap-4 rounded-2xl border border-[#c9b07a]/30 bg-white p-4 shadow-2xl">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-lg font-bold text-green-600">
              ✓
            </div>

            <div className="flex-1">

              <p className="font-semibold text-[#211d18]">
                Added to Cart
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {
                  notification
                }
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setNotification(
                  ""
                )
              }
              className="text-gray-400 transition hover:text-[#211d18]"
              aria-label="Close notification"
            >
              ✕
            </button>

          </div>

        </div>

      )}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

        {/* HEADER */}

        <div className="mx-auto max-w-2xl text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9a7a45]">
            Bejeweled Collection
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#211d18] sm:text-5xl">
            Our Jewelry
          </h1>

          <p className="mt-4 text-base leading-7 text-gray-500">
            Discover elegant
            pieces selected for
            everyday style,
            meaningful moments,
            and special occasions.
          </p>

        </div>

        {/* CATEGORIES */}

        <div className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-3">

          {categories.map(
            (category) => (

              <button
                key={
                  category
                }
                type="button"
                onClick={() =>
                  handleCategoryChange(
                    category
                  )
                }
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition duration-300 ${
                  selectedCategory ===
                  category
                    ? "bg-[#211d18] text-white shadow-sm"
                    : "border border-[#c9b07a]/30 bg-white text-gray-600 hover:border-[#b9975b] hover:text-[#9a7a45]"
                }`}
              >
                {
                  category
                }
              </button>

            )
          )}

        </div>

        {/* SEARCH */}

        <div className="mx-auto mt-8 max-w-2xl">

          <div className="relative">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9a7a45]"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
              />

              <path
                strokeLinecap="round"
                d="m16.5 16.5 4 4"
              />

            </svg>

            <input
              type="text"
              value={
                searchQuery
              }
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="Search by name, category, or style..."
              className="w-full rounded-full border border-[#c9b07a]/35 bg-white py-3.5 pl-12 pr-12 text-sm text-[#211d18] shadow-sm outline-none transition placeholder:text-gray-400 focus:border-[#9a7a45] focus:ring-2 focus:ring-[#9a7a45]/10"
            />

            {searchQuery && (

              <button
                type="button"
                onClick={() =>
                  setSearchQuery(
                    ""
                  )
                }
                aria-label="Clear search"
                className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-sm text-gray-400 transition hover:bg-[#f4ede0] hover:text-[#211d18]"
              >
                ×
              </button>

            )}

          </div>

          {searchQuery && (

            <p className="mt-3 text-center text-xs text-gray-500">

              {
                filteredProducts.length
              }{" "}

              {filteredProducts.length ===
              1
                ? "result"
                : "results"}{" "}

              for{" "}

              <span className="font-semibold text-[#8a6d3d]">
                “
                {
                  searchQuery
                }
                ”
              </span>

            </p>

          )}

        </div>

        {/* PRODUCT COUNT */}

        <div className="mt-12 flex items-end justify-between border-b border-[#c9b07a]/25 pb-4">

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9a7a45]">
              Collection
            </p>

            <h2 className="mt-1 text-xl font-semibold text-[#211d18]">
              {selectedCategory ===
              "All"
                ? "All Products"
                : selectedCategory}
            </h2>

            <p className="mt-1 text-sm text-gray-500">

              {
                filteredProducts.length
              }{" "}

              {filteredProducts.length ===
              1
                ? "product"
                : "products"}

            </p>

          </div>

          {(searchQuery ||
            selectedCategory !==
              "All") && (

            <button
              type="button"
              onClick={() => {
                setSearchQuery(
                  ""
                );

                handleCategoryChange(
                  "All"
                );
              }}
              className="text-xs font-semibold text-[#8a6d3d] transition hover:text-[#211d18]"
            >
              Clear Filters
            </button>

          )}

        </div>

        {/* NO PRODUCTS */}

        {filteredProducts.length ===
        0 ? (

          <div className="py-24 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#c9b07a]/25 bg-[#efe3cb] text-xl text-[#9a7a45]">
              ⌕
            </div>

            <h2 className="mt-5 text-xl font-semibold text-[#211d18]">
              No products found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">

              {searchQuery
                ? `We couldn't find anything matching "${searchQuery}". Try another search or browse a different category.`
                : "No products are currently available in this category."}

            </p>

            {(searchQuery ||
              selectedCategory !==
                "All") && (

              <button
                type="button"
                onClick={() => {
                  setSearchQuery(
                    ""
                  );

                  handleCategoryChange(
                    "All"
                  );
                }}
                className="mt-6 rounded-full border border-[#c9b07a]/40 bg-white px-6 py-3 text-sm font-semibold text-[#7b633b] transition hover:border-[#9a7a45] hover:text-[#9a7a45]"
              >
                View All Products
              </button>

            )}

          </div>

        ) : (

          /* PRODUCT GRID */

          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredProducts.map(
              (product) => {
                const cartQuantity =
                  getCartQuantity(
                    product._id
                  );

                const selectedQuantity =
                  getSelectedQuantity(
                    product._id
                  );

                const quantity =
                  cartQuantity >
                  0
                    ? cartQuantity
                    : selectedQuantity;

                return (

                  <article
                    key={
                      product._id
                    }
                    className="group overflow-hidden rounded-2xl border border-[#c9b07a]/20 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#b9975b]/40 hover:shadow-xl"
                  >

                    <div className="relative aspect-square overflow-hidden bg-[#eee8dd]">

                      <Image
                        src={
                          product.image
                        }
                        alt={
                          product.name
                        }
                        fill
                        sizes="
                          (max-width: 640px) 100vw,
                          (max-width: 1024px) 50vw,
                          (max-width: 1280px) 33vw,
                          25vw
                        "
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />

                      {product.featured && (

                        <span className="absolute left-4 top-4 rounded-full border border-[#c9b07a]/20 bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#8a6d3d] shadow-sm backdrop-blur">
                          Featured
                        </span>

                      )}

                      {product.stock ===
                        0 && (

                        <div className="absolute inset-0 flex items-center justify-center bg-black/25">

                          <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow">
                            Out of Stock
                          </span>

                        </div>

                      )}

                    </div>

                    <div className="p-5">

                      <p className="text-xs font-semibold uppercase tracking-widest text-[#9a7a45]">
                        {
                          product.category
                        }
                      </p>

                      <h3 className="mt-2 text-lg font-semibold text-[#211d18]">
                        {
                          product.name
                        }
                      </h3>

                      <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-500">
                        {
                          product.description
                        }
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-4">

                        <p className="text-lg font-bold text-[#211d18]">
                          Rs.{" "}
                          {product.price.toLocaleString()}
                        </p>

                        <p
                          className={`text-xs ${
                            product.stock <=
                              5
                              ? "font-medium text-amber-600"
                              : "text-gray-400"
                          }`}
                        >
                          {
                            product.stock
                          }{" "}
                          available
                        </p>

                      </div>

                      <div className="mt-5 flex items-center justify-center">

                        <button
                          type="button"
                          onClick={() =>
                            handleDecrease(
                              product
                            )
                          }
                          disabled={
                            quantity ===
                            0
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d7c8ac] text-lg font-medium text-[#574a36] transition hover:border-[#b9975b] hover:bg-[#faf2e2] hover:text-[#9a7a45] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          −
                        </button>

                        <span className="mx-4 flex min-w-8 justify-center text-sm font-semibold text-[#211d18]">
                          {
                            quantity
                          }
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleIncrease(
                              product
                            )
                          }
                          disabled={
                            quantity >=
                            product.stock
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d7c8ac] text-lg font-medium text-[#574a36] transition hover:border-[#b9975b] hover:bg-[#faf2e2] hover:text-[#9a7a45] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          +
                        </button>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleAddToCart(
                            product
                          )
                        }
                        disabled={
                          product.stock ===
                            0 ||
                          quantity ===
                            0
                        }
                        className="mt-4 w-full rounded-xl bg-[#211d18] px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-[#9a7a45] disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        {product.stock ===
                        0
                          ? "Out of Stock"
                          : quantity ===
                            0
                          ? "Select Quantity"
                          : cartQuantity >
                            0
                          ? "Already in Cart"
                          : "Add to Cart"}
                      </button>

                    </div>

                  </article>

                );
              }
            )}

          </div>

        )}

      </section>

    </main>
  );
}
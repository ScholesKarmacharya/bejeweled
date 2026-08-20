"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  const cartItemCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  /* =====================================================
     WHATSAPP ORDER
  ====================================================== */

  function orderViaWhatsApp() {
    const whatsappNumber = "9779749397472";

    let message = `Hello Bejeweled Team! 👋✨

I’m interested in placing an order for the following products:

━━━━━━━━━━━━━━━━━━

🛍️ ORDER DETAILS

`;

    cart.forEach((item, index) => {
      const itemTotal =
        item.price * item.quantity;

      message += `${index + 1}. ${item.name}
• Quantity: ${item.quantity}
• Price: Rs. ${item.price.toLocaleString()} each
• Subtotal: Rs. ${itemTotal.toLocaleString()}

━━━━━━━━━━━━━━━━━━

`;
    });

    message += `💰 TOTAL AMOUNT: Rs. ${cartTotal.toLocaleString()}

Before confirming my order, I would appreciate it if you could send me the images of the selected products so I can verify them.

🚚 DELIVERY & AVAILABILITY

Please let me know:
• Product availability
• Estimated delivery time
• Delivery charges
• Available payment options

Once everything is confirmed, I’ll be happy to proceed with the order.

Thank you for your assistance! 💎

Best regards,
Bejeweled Customer`;

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  /* =====================================================
     EMPTY CART
  ====================================================== */

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8f4ec] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">

        <div className="mx-auto flex min-h-[65vh] max-w-2xl flex-col items-center justify-center text-center">

          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#c8a560]/25 bg-[#efe3cb] text-3xl">
            🛍️
          </div>

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9a7a45]">
            Your Selection
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#211d18] sm:text-4xl">
            Your cart is empty
          </h1>

          <p className="mt-4 max-w-md text-sm leading-7 text-gray-500 sm:text-base">
            You haven&apos;t added anything yet. Explore the
            Bejeweled collection and find something that feels
            right for you.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#211d18] px-7 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#9a7a45]"
          >
            Explore Collection
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f4ec] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 sm:mb-10">

          <div className="flex items-center gap-3">

            <span className="h-px w-8 bg-[#b9975b]" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9a7a45]">
              Your Selection
            </p>

          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#211d18] sm:text-4xl">
            Shopping Cart
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {cartItemCount}{" "}
            {cartItemCount === 1
              ? "item"
              : "items"}{" "}
            in your cart
          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* =================================================
              CART ITEMS
          ================================================= */}

          <div className="space-y-4">

            {cart.map((item) => (
              <article
                key={item._id}
                className="rounded-2xl border border-[#c9b07a]/20 bg-white p-4 shadow-sm transition duration-300 hover:border-[#c9a15c]/35 hover:shadow-md sm:p-5"
              >

                <div className="flex gap-4 sm:gap-6">

                  {/* IMAGE */}

                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f1ece3] sm:h-36 sm:w-36">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />

                  </div>

                  {/* DETAILS */}

                  <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-2 sm:gap-4">

                      <div className="min-w-0">

                        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9a7a45] sm:text-[10px]">
                          {item.category}
                        </p>

                        <h2 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-[#211d18] sm:text-lg sm:leading-6">
                          {item.name}
                        </h2>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(
                            item._id
                          )
                        }
                        className="shrink-0 text-[11px] font-medium text-gray-400 transition hover:text-red-500 sm:text-xs"
                      >
                        Remove
                      </button>

                    </div>

                    <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                      Rs.{" "}
                      {item.price.toLocaleString()}{" "}
                      each
                    </p>

                    {/* QUANTITY + TOTAL */}

                    <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex w-fit items-center overflow-hidden rounded-lg border border-gray-200">

                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(
                              item._id
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center text-lg text-gray-700 transition hover:bg-[#f2eadb] hover:text-[#8c6c37]"
                          aria-label={`Decrease ${item.name}`}
                        >
                          −
                        </button>

                        <span className="flex h-9 min-w-10 items-center justify-center border-x border-gray-200 text-sm font-semibold text-gray-900">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(
                              item._id
                            )
                          }
                          disabled={
                            item.quantity >=
                            item.stock
                          }
                          className="flex h-9 w-9 items-center justify-center text-lg text-gray-700 transition hover:bg-[#f2eadb] hover:text-[#8c6c37] disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label={`Increase ${item.name}`}
                        >
                          +
                        </button>

                      </div>

                      <div className="sm:text-right">

                        <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 sm:hidden">
                          Subtotal
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-[#211d18] sm:mt-0 sm:text-base">
                          Rs.{" "}
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString()}
                        </p>

                      </div>

                    </div>

                    {item.quantity >=
                      item.stock &&
                      item.stock > 0 && (
                        <p className="mt-3 text-xs text-amber-600">
                          Maximum available quantity selected.
                        </p>
                      )}

                  </div>

                </div>

              </article>
            ))}

            {/* CONTINUE SHOPPING */}

            <Link
              href="/products"
              className="group inline-flex items-center gap-2 pt-3 text-sm font-medium text-gray-500 transition hover:text-[#9a7a45]"
            >
              <span className="transition group-hover:-translate-x-1">
                ←
              </span>

              Continue Shopping
            </Link>

          </div>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <aside className="h-fit rounded-2xl border border-[#c9b07a]/25 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-28">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a7a45]">
                  Order
                </p>

                <h2 className="mt-1 text-xl font-semibold text-[#211d18]">
                  Summary
                </h2>

              </div>

              <span className="rounded-full bg-[#f3ead8] px-3 py-1 text-xs font-semibold text-[#826535]">
                {cartItemCount}{" "}
                {cartItemCount === 1
                  ? "item"
                  : "items"}
              </span>

            </div>

            <div className="mt-6 space-y-4">

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-medium text-[#211d18]">
                  Rs.{" "}
                  {cartTotal.toLocaleString()}
                </span>

              </div>

            

              <div className="border-t border-[#c9b07a]/20 pt-4">

                <div className="flex items-end justify-between gap-4">

                  <div>

                    <span className="text-sm font-semibold text-[#211d18]">
                      Total
                    </span>

                    <p className="mt-1 text-[10px] text-gray-400">
                      Final amount before payment confirmation
                    </p>

                  </div>

                  <span className="shrink-0 text-xl font-bold text-[#211d18]">
                    Rs.{" "}
                    {cartTotal.toLocaleString()}
                  </span>

                </div>

              </div>

            </div>

            {/* CHECKOUT */}

            <Link
              href="/checkout"
              className="mt-7 flex w-full items-center justify-center rounded-xl bg-[#211d18] px-5 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#9a7a45]"
            >
              Proceed to Checkout
            </Link>

            {/* WHATSAPP */}

            <button
              type="button"
              onClick={orderViaWhatsApp}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#329d5a] bg-white px-5 py-3.5 text-sm font-semibold text-[#258148] transition duration-300 hover:bg-green-50"
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M20.52 3.48A11.82 11.82 0 0012.04 0C5.48 0 .13 5.35.13 11.91c0 2.1.55 4.15 1.6 5.96L.03 24l6.27-1.64a11.88 11.88 0 005.74 1.47h.01c6.56 0 11.91-5.35 11.91-11.91 0-3.18-1.24-6.17-3.44-8.44zM12.05 21.8h-.01a9.86 9.86 0 01-5.03-1.38l-.36-.21-3.72.98.99-3.63-.23-.37a9.83 9.83 0 01-1.51-5.28c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.12 1.03 6.99 2.9a9.84 9.84 0 012.9 7c0 5.45-4.44 9.88-9.9 9.88zm5.42-7.4c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.55.72.31 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
              </svg>

              Order via WhatsApp

            </button>

            <p className="mt-4 text-center text-xs leading-5 text-gray-400">
              Checkout online or contact us directly through WhatsApp
              before confirming your order.
            </p>

          </aside>

        </div>

      </div>

    </main>
  );
}
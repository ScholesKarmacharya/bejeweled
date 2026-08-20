"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();

  const {
    cart,
    cartTotal,
    clearCart,
  } = useCart();

  const [loading, setLoading] =
    useState(false);

  const [
    paymentConfirmed,
    setPaymentConfirmed,
  ] = useState(false);

  const [
    paymentReference,
    setPaymentReference,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    formData,
    setFormData,
  ] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  /* =====================================================
     FORM CHANGE
  ====================================================== */

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

    if (errorMessage) {
      setErrorMessage("");
    }
  }

  /* =====================================================
     PLACE ORDER
  ====================================================== */

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setErrorMessage("");

    const cleanedPaymentReference =
      paymentReference.trim();

    if (!cleanedPaymentReference) {
      setErrorMessage(
        "Please enter your Fonepay transaction/reference ID."
      );

      return;
    }

    if (
      cleanedPaymentReference.length <
      3
    ) {
      setErrorMessage(
        "Please enter a valid Fonepay transaction/reference ID."
      );

      return;
    }

    if (!paymentConfirmed) {
      setErrorMessage(
        "Please confirm that you have completed the Fonepay payment."
      );

      return;
    }

    if (cart.length === 0) {
      setErrorMessage(
        "Your cart is empty."
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/orders",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              customer: {
                fullName:
                  formData.fullName.trim(),

                email:
                  formData.email.trim(),

                phone:
                  formData.phone.trim(),

                address:
                  formData.address.trim(),

                city:
                  formData.city.trim(),
              },

              /*
               * Server only needs
               * productId + quantity.
               */
              items: cart.map(
                (item) => ({
                  productId:
                    item._id,

                  quantity:
                    item.quantity,
                })
              ),

              paymentMethod:
                "Fonepay",

              paymentReference:
                cleanedPaymentReference,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to place order."
        );
      }

      const orderId =
        data.order?._id;

      if (!orderId) {
        throw new Error(
          "Order was created but no Order ID was returned."
        );
      }

      clearCart();

      router.push(
        `/order-success?id=${encodeURIComponent(
          orderId
        )}`
      );
    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while placing your order."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     EMPTY CART
  ====================================================== */

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8f4ec] px-4 py-16 sm:px-6 lg:px-8">

        <div className="mx-auto flex min-h-[65vh] max-w-2xl flex-col items-center justify-center text-center">

          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#c9a15c]/25 bg-[#efe3cb] text-3xl">
            🛒
          </div>

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9a7a45]">
            Bejeweled
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#211d18] sm:text-4xl">
            Your cart is empty
          </h1>

          <p className="mt-4 max-w-md text-sm leading-7 text-gray-500 sm:text-base">
            Add something from our collection before continuing
            to checkout.
          </p>

          <Link
            href="/products"
            className="mt-8 rounded-full bg-[#211d18] px-7 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#9a7a45]"
          >
            Browse Collection
          </Link>

        </div>

      </main>
    );
  }

  /* =====================================================
     CHECKOUT
  ====================================================== */

  return (
    <main className="min-h-screen bg-[#f8f4ec] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 sm:mb-10">

          <div className="flex items-center gap-3">

            <span className="h-px w-8 bg-[#b9975b]" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9a7a45]">
              Secure Checkout
            </p>

          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#211d18] sm:text-4xl">
            Complete Your Order
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500">
            Enter your delivery information, complete your
            Fonepay payment, and submit your order for review.
          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* LEFT */}

          <div>

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-[#c9b07a]/25 bg-white p-5 shadow-sm sm:p-8"
            >

              {/* DELIVERY */}

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9a7a45]">
                  Step 01
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#211d18]">
                  Delivery Information
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Please enter accurate details so we can process
                  and deliver your order correctly.
                </p>

              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                {/* FULL NAME */}

                <div className="sm:col-span-2">

                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-600"
                  >
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={
                      formData.fullName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="w-full rounded-xl border border-gray-200 bg-[#fdfcf9] px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#b9975b] focus:bg-white focus:ring-2 focus:ring-[#b9975b]/10"
                  />

                </div>

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-600"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-gray-200 bg-[#fdfcf9] px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#b9975b] focus:bg-white focus:ring-2 focus:ring-[#b9975b]/10"
                  />

                </div>

                {/* PHONE */}

                <div>

                  <label
                    htmlFor="phone"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-600"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="98XXXXXXXX"
                    autoComplete="tel"
                    className="w-full rounded-xl border border-gray-200 bg-[#fdfcf9] px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#b9975b] focus:bg-white focus:ring-2 focus:ring-[#b9975b]/10"
                  />

                </div>

                {/* ADDRESS */}

                <div className="sm:col-span-2">

                  <label
                    htmlFor="address"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-600"
                  >
                    Delivery Address
                  </label>

                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={
                      formData.address
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Street, tole, area"
                    autoComplete="street-address"
                    className="w-full rounded-xl border border-gray-200 bg-[#fdfcf9] px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#b9975b] focus:bg-white focus:ring-2 focus:ring-[#b9975b]/10"
                  />

                </div>

                {/* CITY */}

                <div className="sm:col-span-2">

                  <label
                    htmlFor="city"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-600"
                  >
                    City
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={
                      formData.city
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Kathmandu"
                    autoComplete="address-level2"
                    className="w-full rounded-xl border border-gray-200 bg-[#fdfcf9] px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#b9975b] focus:bg-white focus:ring-2 focus:ring-[#b9975b]/10"
                  />

                </div>

              </div>

              {/* PAYMENT */}

              <div className="mt-10 border-t border-[#c9b07a]/20 pt-8">

                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9a7a45]">
                  Step 02
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#211d18]">
                  Payment
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Scan the Fonepay QR using your supported banking
                  or wallet application.
                </p>

                <div className="mt-5 overflow-hidden rounded-2xl border border-[#c9b07a]/25">

                  {/* FONEPAY HEADER */}

                  <div className="flex items-center justify-between border-b border-[#c9b07a]/20 bg-[#faf6ed] p-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">

                        <span className="text-sm font-bold text-red-600">
                          FP
                        </span>

                      </div>

                      <div>

                        <p className="font-semibold text-[#211d18]">
                          Fonepay
                        </p>

                        <p className="text-xs text-gray-500 sm:text-sm">
                          Scan QR to pay
                        </p>

                      </div>

                    </div>

                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8c6d38]">
                      Payment
                    </span>

                  </div>

                  {/* QR + PAYMENT DETAILS */}

                  <div className="bg-white p-5 text-center sm:p-6">

                    <div className="mx-auto max-w-[320px] overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">

                      <img
                        src="/fonepay-qr.jpeg"
                        alt="Bejeweled Fonepay QR Payment"
                        className="h-auto w-full"
                      />

                    </div>

                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                      Amount to Pay
                    </p>

                    <p className="mt-1 text-2xl font-bold text-[#211d18] sm:text-3xl">
                      Rs.{" "}
                      {cartTotal.toLocaleString()}
                    </p>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                      Complete the payment first, then enter the
                      transaction/reference ID shown in your bank
                      or wallet payment confirmation.
                    </p>

                    {/* PAYMENT REFERENCE */}

                    <div className="mx-auto mt-6 max-w-md text-left">

                      <label
                        htmlFor="paymentReference"
                        className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#786b5b]"
                      >
                        Fonepay Transaction / Reference ID
                      </label>

                      <input
                        id="paymentReference"
                        name="paymentReference"
                        type="text"
                        required
                        maxLength={100}
                        value={
                          paymentReference
                        }
                        onChange={(event) => {
                          setPaymentReference(
                            event.target.value
                          );

                          if (errorMessage) {
                            setErrorMessage("");
                          }
                        }}
                        placeholder="Enter transaction/reference ID"
                        autoComplete="off"
                        className="w-full rounded-xl border border-[#d8c8a8] bg-[#fdfcf9] px-4 py-3.5 text-sm font-medium text-[#211d18] outline-none transition placeholder:font-normal placeholder:text-gray-300 focus:border-[#9a7a45] focus:bg-white focus:ring-2 focus:ring-[#9a7a45]/10"
                      />

                      <div className="mt-2 flex items-start gap-2">

                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          className="mt-0.5 h-4 w-4 shrink-0 text-[#9a7a45]"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                          />

                          <path
                            strokeLinecap="round"
                            d="M12 10v6M12 7h.01"
                          />
                        </svg>

                        <p className="text-xs leading-5 text-gray-500">
                          Enter the transaction or reference ID exactly
                          as shown in your payment confirmation.
                        </p>

                      </div>

                    </div>

                    {/* CONFIRMATION */}

                    <label
                      className={`mx-auto mt-6 flex max-w-md cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition ${
                        paymentConfirmed
                          ? "border-[#b9975b] bg-[#faf2e2]"
                          : "border-gray-200 bg-gray-50 hover:border-[#c9a15c]"
                      }`}
                    >

                      <input
                        type="checkbox"
                        checked={
                          paymentConfirmed
                        }
                        onChange={(event) => {
                          setPaymentConfirmed(
                            event.target.checked
                          );

                          if (errorMessage) {
                            setErrorMessage("");
                          }
                        }}
                        className="mt-1 h-4 w-4 accent-[#8a6a36]"
                      />

                      <span>

                        <span className="block text-sm font-semibold text-[#211d18]">
                          I have completed the payment
                        </span>

                        <span className="mt-1 block text-xs leading-5 text-gray-500">
                          I confirm that I have paid the total amount
                          shown above using Fonepay.
                        </span>

                      </span>

                    </label>

                  </div>

                </div>

              </div>

              {/* ERROR */}

              {errorMessage && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              {/* PLACE ORDER */}

              <button
                type="submit"
                disabled={
                  loading ||
                  !paymentConfirmed ||
                  !paymentReference.trim() ||
                  cart.length === 0
                }
                className="mt-7 w-full rounded-xl bg-[#211d18] px-5 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#9a7a45] disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-gray-300"
              >
                {loading
                  ? "Placing Your Order..."
                  : `Place Order · Rs. ${cartTotal.toLocaleString()}`}
              </button>

              {(
                !paymentReference.trim() ||
                !paymentConfirmed
              ) && (
                <p className="mt-3 text-center text-xs leading-5 text-gray-400">
                  Complete your Fonepay payment, enter the
                  transaction/reference ID, and confirm the payment
                  before placing your order.
                </p>
              )}

            </form>

          </div>

          {/* ORDER SUMMARY */}

          <aside className="h-fit rounded-2xl border border-[#c9b07a]/25 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-28">

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a7a45]">
                Your Selection
              </p>

              <h2 className="mt-1 text-xl font-semibold text-[#211d18]">
                Order Summary
              </h2>

            </div>

            <div className="mt-6 space-y-5">

              {cart.map(
                (item) => (

                  <div
                    key={item._id}
                    className="flex gap-4"
                  >

                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f1ece3]">

                      <img
                        src={
                          item.image
                        }
                        alt={
                          item.name
                        }
                        className="h-full w-full object-cover"
                      />

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#9a7a45]">
                        {
                          item.category
                        }
                      </p>

                      <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-[#211d18]">
                        {item.name}
                      </h3>

                      <div className="mt-2 flex items-center justify-between gap-3">

                        <p className="text-xs text-gray-500">
                          Qty:{" "}
                          {
                            item.quantity
                          }
                        </p>

                        <p className="text-sm font-semibold text-[#211d18]">
                          Rs.{" "}
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString()}
                        </p>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

            <div className="my-6 border-t border-[#c9b07a]/20" />

            <div className="flex justify-between text-sm">

              <span className="text-gray-500">
                Subtotal
              </span>

              <span className="font-medium text-[#211d18]">
                Rs.{" "}
                {cartTotal.toLocaleString()}
              </span>

            </div>

            <div className="my-6 border-t border-[#c9b07a]/20" />

            <div className="flex items-end justify-between gap-4">

              <span className="font-semibold text-[#211d18]">
                Total
              </span>

              <span className="text-xl font-bold text-[#211d18]">
                Rs.{" "}
                {cartTotal.toLocaleString()}
              </span>

            </div>

            <Link
              href="/cart"
              className="group mt-6 flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-500 transition hover:border-[#b9975b] hover:text-[#8c6d38]"
            >
              <span className="transition group-hover:-translate-x-1">
                ←
              </span>

              Back to Cart
            </Link>

            <div className="mt-5 rounded-xl bg-[#faf6ed] p-4">

              <p className="text-xs font-semibold text-[#795c2e]">
                Payment Review
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Your order will remain pending until the
                Bejeweled team verifies your payment reference.
              </p>

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}
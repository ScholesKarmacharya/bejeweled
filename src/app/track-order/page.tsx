"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

interface TrackingOrder {
  _id: string;
  status: OrderStatus;
  createdAt: string;
  total: number;
  paymentMethod: string;

  items: {
    name: string;
    image: string;
    quantity: number;
  }[];
}

const steps = [
  {
    label: "Received",
    title: "Order Received",
  },
  {
    label: "Confirmed",
    title: "Order Confirmed",
  },
  {
    label: "Preparing",
    title: "Preparing Your Jewelry",
  },
  {
    label: "Shipped",
    title: "On Its Way",
  },
  {
    label: "Delivered",
    title: "Delivered",
  },
];

function getCurrentStep(status: OrderStatus) {
  switch (status) {
    case "Pending":
      return 0;

    case "Confirmed":
      return 1;

    case "Processing":
      return 2;

    case "Shipped":
      return 3;

    case "Delivered":
      return 4;

    default:
      return 0;
  }
}

function getStatusDescription(status: OrderStatus) {
  switch (status) {
    case "Pending":
      return "Your order has been received and your Fonepay payment is awaiting review.";

    case "Confirmed":
      return "Your payment has been reviewed and your order is confirmed.";

    case "Processing":
      return "Your jewelry is being carefully prepared for dispatch.";

    case "Shipped":
      return "Your order has been dispatched and is on its way to you.";

    case "Delivered":
      return "Your order has been successfully delivered.";

    case "Cancelled":
      return "This order has been cancelled.";

    default:
      return "";
  }
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");

  const [order, setOrder] =
    useState<TrackingOrder | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    setError("");
    setOrder(null);

    const cleanedOrderId = orderId
      .trim()
      .replace(/^#/, "");

    if (!cleanedOrderId) {
      setError(
        "Please enter your Order ID."
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/track-order",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            orderId:
              cleanedOrderId,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "We couldn't find your order."
        );
      }

      setOrder(data.order);
    } catch (error) {
      console.error(
        "Tracking error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to track your order."
      );
    } finally {
      setLoading(false);
    }
  }

  const currentStep = order
    ? getCurrentStep(
        order.status
      )
    : 0;

  return (
    <main className="min-h-screen bg-[#f8f4ec] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

      <div className="mx-auto max-w-5xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mx-auto max-w-2xl text-center">

          <div className="flex items-center justify-center gap-3">

            <span className="h-px w-8 bg-[#b9975b]" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9a7a45]">
              Bejeweled Order Tracking
            </p>

            <span className="h-px w-8 bg-[#b9975b]" />

          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#211d18] sm:text-4xl lg:text-5xl">
            Track Your Order
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-gray-500 sm:text-base">
            Enter the Order ID you received after checkout to see the latest status of your Bejeweled order.
          </p>

        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-[#c9b07a]/25 bg-white p-5 shadow-sm sm:p-7">

          <form
            onSubmit={
              handleSubmit
            }
          >

            <label
              htmlFor="orderId"
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500"
            >
              Order ID
            </label>

            <input
              id="orderId"
              type="text"
              value={orderId}
              onChange={(e) => {
                setOrderId(
                  e.target.value
                );

                if (error) {
                  setError("");
                }
              }}
              placeholder="Enter your full Order ID"
              autoComplete="off"
              className="mt-3 w-full rounded-xl border border-gray-200 bg-[#fdfcf9] px-4 py-3.5 font-mono text-sm text-gray-900 outline-none transition placeholder:font-sans placeholder:text-gray-300 focus:border-[#b9975b] focus:bg-white focus:ring-2 focus:ring-[#b9975b]/10"
            />

            <p className="mt-2 text-xs leading-5 text-gray-400">
              You can paste the Order ID with or without the # symbol.
            </p>

            {error && (

              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                <div className="flex items-start gap-3">

                  <div className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                    !
                  </div>

                  <p className="text-sm leading-5 text-red-600">
                    {error}
                  </p>

                </div>

              </div>

            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#211d18] py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#9a7a45] disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-gray-400"
            >
              {loading ? (

                <div className="flex items-center gap-3">

                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  <span>
                    Finding your order...
                  </span>

                </div>

              ) : (

                "Track Order"

              )}
            </button>

          </form>

        </div>

        {/* =================================================
            RESULT
        ================================================= */}

        {order && (

          <div className="mt-10 overflow-hidden rounded-3xl border border-[#c9b07a]/25 bg-white shadow-sm">

            {/* ORDER HEADER */}

            <div className="flex flex-col gap-5 border-b border-[#c9b07a]/20 bg-[#fffaf1] px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a7a45]">
                  Bejeweled Order
                </p>

                <h2 className="mt-2 break-all font-mono text-lg font-semibold text-[#211d18] sm:text-xl">
                  #
                  {order._id
                    .slice(-8)
                    .toUpperCase()}
                </h2>

                <p className="mt-2 text-xs text-gray-400">
                  Placed{" "}
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>

              </div>

              <div className="sm:text-right">

                <p className="text-xs text-gray-400">
                  Current Status
                </p>

                <div className="mt-2 flex items-center gap-2 sm:justify-end">

                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      order.status ===
                      "Cancelled"
                        ? "bg-red-500"
                        : order.status ===
                          "Delivered"
                        ? "bg-green-500"
                        : order.status ===
                          "Pending"
                        ? "bg-amber-500"
                        : "bg-[#9a7a45]"
                    }`}
                  />

                  <p
                    className={`font-semibold ${
                      order.status ===
                      "Cancelled"
                        ? "text-red-600"
                        : order.status ===
                          "Delivered"
                        ? "text-green-700"
                        : order.status ===
                          "Pending"
                        ? "text-amber-700"
                        : "text-[#7d6032]"
                    }`}
                  >
                    {order.status}
                  </p>

                </div>

              </div>

            </div>

            {/* CANCELLED */}

            {order.status ===
            "Cancelled" ? (

              <div className="px-5 py-12 text-center sm:px-8">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl text-red-600">
                  ×
                </div>

                <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-red-500">
                  Order Update
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#211d18]">
                  Order Cancelled
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                  This order is no longer being processed. Please contact Bejeweled if you need more information about this order.
                </p>

                <Link
                  href="/contact"
                  className="mt-6 inline-flex rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Contact Bejeweled
                </Link>

              </div>

            ) : (

              /* ORDER JOURNEY */

              <div className="px-5 py-9 sm:px-8 sm:py-10">

                <div className="text-center">

                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9a7a45]">
                    From Bejeweled to You
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-[#211d18]">
                    Your Order Journey
                  </h2>

                </div>

                {/* DESKTOP */}

                <div className="relative mx-auto mt-12 hidden max-w-3xl sm:block">

                  <div className="absolute left-[10%] right-[10%] top-5 h-[2px] bg-[#e8e1d4]" />

                  <div
                    className="absolute left-[10%] top-5 h-[2px] bg-[#9a7a45] transition-all duration-700"
                    style={{
                      width:
                        currentStep === 0
                          ? "0%"
                          : `${
                              (currentStep /
                                4) *
                              80
                            }%`,
                    }}
                  />

                  <div className="relative grid grid-cols-5">

                    {steps.map(
                      (
                        step,
                        index
                      ) => {

                        const completed =
                          index <=
                          currentStep;

                        const current =
                          index ===
                          currentStep;

                        return (

                          <div
                            key={
                              step.label
                            }
                            className="text-center"
                          >

                            <div
                              className={`relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 ${
                                completed
                                  ? "border-[#9a7a45] bg-[#9a7a45] text-white"
                                  : "border-gray-300 bg-white text-gray-400"
                              } ${
                                current
                                  ? "ring-4 ring-[#9a7a45]/10"
                                  : ""
                              }`}
                            >
                              {index <
                              currentStep ? (
                                <span>
                                  ✓
                                </span>
                              ) : (
                                <span className="text-xs font-semibold">
                                  {index +
                                    1}
                                </span>
                              )}
                            </div>

                            <p
                              className={`mt-4 text-[9px] font-semibold uppercase tracking-[0.15em] ${
                                current
                                  ? "text-[#7d6032]"
                                  : completed
                                  ? "text-gray-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {step.label}
                            </p>

                          </div>

                        );
                      }
                    )}

                  </div>

                </div>

                {/* MOBILE */}

                <div className="mx-auto mt-10 max-w-md sm:hidden">

                  {steps.map(
                    (
                      step,
                      index
                    ) => {

                      const completed =
                        index <=
                        currentStep;

                      const current =
                        index ===
                        currentStep;

                      return (

                        <div
                          key={
                            step.label
                          }
                          className="flex gap-4"
                        >

                          <div className="flex flex-col items-center">

                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                                completed
                                  ? "border-[#9a7a45] bg-[#9a7a45] text-white"
                                  : "border-gray-300 bg-white text-gray-400"
                              } ${
                                current
                                  ? "ring-4 ring-[#9a7a45]/10"
                                  : ""
                              }`}
                            >
                              {index <
                              currentStep
                                ? "✓"
                                : index +
                                  1}
                            </div>

                            {index !==
                              steps.length -
                                1 && (

                              <div
                                className={`h-16 w-px ${
                                  index <
                                  currentStep
                                    ? "bg-[#9a7a45]"
                                    : "bg-gray-200"
                                }`}
                              />

                            )}

                          </div>

                          <div className="pb-7">

                            <p
                              className={`text-[9px] font-semibold uppercase tracking-[0.18em] ${
                                current
                                  ? "text-[#9a7a45]"
                                  : "text-gray-400"
                              }`}
                            >
                              {current
                                ? "Current Status"
                                : step.label}
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[#211d18]">
                              {
                                step.title
                              }
                            </p>

                          </div>

                        </div>

                      );
                    }
                  )}

                </div>

                {/* CURRENT STATUS */}

                <div className="mx-auto mt-9 max-w-xl rounded-2xl border border-[#c9b07a]/20 bg-[#faf6ed] p-5 text-center sm:p-6">

                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a7a45]">
                    Current Status
                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-[#211d18]">
                    {
                      steps[
                        currentStep
                      ].title
                    }
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                    {getStatusDescription(
                      order.status
                    )}
                  </p>

                </div>

              </div>

            )}

            {/* =================================================
                ITEMS
            ================================================= */}

            <div className="border-t border-[#c9b07a]/20 px-5 py-7 sm:px-8">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9a7a45]">
                    Order
                  </p>

                  <h3 className="mt-1 font-semibold text-[#211d18]">
                    Items
                  </h3>

                </div>

                <span className="text-base font-semibold text-[#211d18] sm:text-lg">
                  Rs.{" "}
                  {order.total.toLocaleString()}
                </span>

              </div>

              <div className="mt-5 space-y-3">

                {order.items.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      key={`${item.name}-${index}`}
                      className="flex items-center gap-4 rounded-2xl bg-[#faf8f4] p-3"
                    >

                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white">

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

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-[#211d18]">
                          {
                            item.name
                          }
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Quantity{" "}
                          {
                            item.quantity
                          }
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        )}

        {/* =================================================
            BOTTOM
        ================================================= */}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">

          <Link
            href="/products"
            className="text-sm font-medium text-gray-500 transition hover:text-[#9a7a45]"
          >
            ← Continue Shopping
          </Link>

          <span className="hidden text-gray-300 sm:inline">
            •
          </span>

          <Link
            href="/contact"
            className="text-sm font-medium text-gray-500 transition hover:text-[#9a7a45]"
          >
            Need Help?
          </Link>

        </div>

      </div>

    </main>
  );
}
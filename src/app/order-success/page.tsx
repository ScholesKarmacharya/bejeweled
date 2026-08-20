"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

/* =========================================================
   TYPES
========================================================= */

type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

interface Order {
  _id: string;

  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
  };

  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];

  total: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
}

/* =========================================================
   ORDER JOURNEY
========================================================= */

const orderSteps = [
  {
    title: "Order Received",
    label: "Received",
    description:
      "Your order and Fonepay payment details have been received.",
  },
  {
    title: "Order Confirmed",
    label: "Confirmed",
    description:
      "Your payment has been reviewed and your order is confirmed.",
  },
  {
    title: "Preparing Your Jewelry",
    label: "Preparing",
    description:
      "Your jewelry is being carefully prepared for dispatch.",
  },
  {
    title: "On Its Way",
    label: "Shipped",
    description:
      "Your order has been dispatched and is on its way to you.",
  },
  {
    title: "Delivered",
    label: "Delivered",
    description:
      "Your jewelry has reached its destination.",
  },
];

function getCurrentStep(
  status: OrderStatus
) {
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

/* =========================================================
   STATUS INFORMATION
========================================================= */

function getStatusInfo(
  status: OrderStatus
) {
  switch (status) {
    case "Pending":
      return {
        text: "Awaiting payment review",
        color: "text-amber-700",
        dot: "bg-amber-500",
        box: "border-amber-200 bg-amber-50",
      };

    case "Confirmed":
      return {
        text: "Payment verified",
        color: "text-blue-700",
        dot: "bg-blue-500",
        box: "border-blue-200 bg-blue-50",
      };

    case "Processing":
      return {
        text: "Your jewelry is being prepared",
        color: "text-purple-700",
        dot: "bg-purple-500",
        box: "border-purple-200 bg-purple-50",
      };

    case "Shipped":
      return {
        text: "Your order is on its way",
        color: "text-indigo-700",
        dot: "bg-indigo-500",
        box: "border-indigo-200 bg-indigo-50",
      };

    case "Delivered":
      return {
        text: "Order successfully delivered",
        color: "text-green-700",
        dot: "bg-green-500",
        box: "border-green-200 bg-green-50",
      };

    case "Cancelled":
      return {
        text: "This order has been cancelled",
        color: "text-red-700",
        dot: "bg-red-500",
        box: "border-red-200 bg-red-50",
      };

    default:
      return {
        text: "",
        color: "text-gray-600",
        dot: "bg-gray-500",
        box: "border-gray-200 bg-gray-50",
      };
  }
}

/* =========================================================
   ORDER SUCCESS CONTENT
========================================================= */

function OrderSuccessContent() {
  const searchParams =
    useSearchParams();

  const orderId =
    searchParams.get("id");

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     FETCH ORDER
  ======================================================= */

  useEffect(() => {
    if (!orderId) {
      setError(
        "Order ID was not provided."
      );

      setLoading(false);

      return;
    }

    async function fetchOrder() {
      try {
        const response =
          await fetch(
            `/api/orders/${orderId}`,
            {
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to retrieve order"
          );
        }

        setOrder(
          data.order
        );
      } catch (error) {
        console.error(
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to retrieve your order."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f4ec] px-4">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#e5d7ba] border-t-[#9a7a45]" />

          <p className="mt-5 text-sm text-gray-500">
            Preparing your order confirmation...
          </p>

        </div>

      </main>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (
    error ||
    !order
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f4ec] px-4">

        <div className="max-w-md text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl text-red-600">
            !
          </div>

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9a7a45]">
            Bejeweled
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-[#211d18]">
            Order Not Found
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {error ||
              "We couldn't find the requested order."}
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex rounded-xl bg-[#211d18] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#9a7a45]"
          >
            Continue Shopping
          </Link>

        </div>

      </main>
    );
  }

  const currentStep =
    getCurrentStep(
      order.status
    );

  const statusInfo =
    getStatusInfo(
      order.status
    );

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#f8f4ec] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">

      <div className="mx-auto max-w-5xl">

        <div className="overflow-hidden rounded-3xl border border-[#c9b07a]/25 bg-white shadow-sm">

          {/* =================================================
              SUCCESS HEADER
          ================================================= */}

          <div className="relative overflow-hidden px-6 py-12 text-center sm:px-12 sm:py-14">

            <div className="absolute inset-0 bg-gradient-to-br from-[#fffaf0] via-white to-[#f2e4c8]" />

            <div className="relative">

              <div
                className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
                  order.status ===
                  "Cancelled"
                    ? "bg-red-50"
                    : "bg-[#f4ead6]"
                }`}
              >

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full text-3xl text-white shadow-sm ${
                    order.status ===
                    "Cancelled"
                      ? "bg-red-600"
                      : "bg-[#9a7a45]"
                  }`}
                >
                  {order.status ===
                  "Cancelled"
                    ? "×"
                    : "✓"}
                </div>

              </div>

              <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9a7a45]">
                Bejeweled
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#211d18] sm:text-4xl">

                {order.status ===
                "Cancelled"
                  ? "Order Cancelled"
                  : order.status ===
                    "Delivered"
                  ? "Order Delivered"
                  : "Order Received"}

              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">

                {order.status ===
                "Cancelled" ? (

                  <>
                    Your order is no longer being processed. Please contact Bejeweled if you have any questions about this order.
                  </>

                ) : order.status ===
                  "Delivered" ? (

                  <>
                    Thank you,{" "}

                    <span className="font-semibold text-[#211d18]">
                      {
                        order.customer
                          .fullName
                      }
                    </span>

                    . Your order has been successfully delivered. We hope you enjoy your jewelry.
                  </>

                ) : (

                  <>
                    Thank you,{" "}

                    <span className="font-semibold text-[#211d18]">
                      {
                        order.customer
                          .fullName
                      }
                    </span>

                    . Your order has been received and is now waiting for payment review.
                  </>

                )}

              </p>

              <div className="mx-auto mt-6 inline-flex rounded-full border border-[#c9b07a]/25 bg-white/80 px-4 py-2 font-mono text-xs text-gray-600">

                #
                {order._id
                  .slice(-8)
                  .toUpperCase()}

              </div>

            </div>

          </div>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="grid gap-4 border-t border-[#c9b07a]/20 px-6 py-8 sm:grid-cols-3 sm:px-10">

            {/* STATUS */}

            <div
              className={`rounded-2xl border p-5 ${statusInfo.box}`}
            >

              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                Order Status
              </p>

              <div className="mt-3 flex items-center gap-2">

                <span
                  className={`h-2 w-2 rounded-full ${statusInfo.dot}`}
                />

                <p
                  className={`font-semibold ${statusInfo.color}`}
                >
                  {
                    order.status
                  }
                </p>

              </div>

              <p className="mt-2 text-xs leading-5 text-gray-500">
                {
                  statusInfo.text
                }
              </p>

            </div>

            {/* PAYMENT */}

            <div className="rounded-2xl border border-[#c9b07a]/20 bg-[#faf6ed] p-5">

              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                Payment
              </p>

              <p className="mt-3 font-semibold text-[#211d18]">
                {
                  order.paymentMethod
                }
              </p>

              <p
                className={`mt-2 text-xs ${
                  order.status ===
                  "Pending"
                    ? "text-amber-700"
                    : order.status ===
                      "Cancelled"
                    ? "text-red-600"
                    : "text-green-700"
                }`}
              >
                {order.status ===
                "Pending"
                  ? "Payment under review"
                  : order.status ===
                    "Cancelled"
                  ? "Order cancelled"
                  : "Payment reviewed"}
              </p>

            </div>

            {/* TOTAL */}

            <div className="rounded-2xl border border-[#c9b07a]/20 bg-[#faf6ed] p-5">

              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                Order Total
              </p>

              <p className="mt-3 text-xl font-bold text-[#211d18]">
                Rs.{" "}
                {order.total.toLocaleString()}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Free delivery
              </p>

            </div>

          </div>

          {/* =================================================
              PRODUCTS
          ================================================= */}

          <div className="border-t border-[#c9b07a]/20 px-6 py-8 sm:px-10">

            <div className="flex items-end justify-between gap-4">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a7a45]">
                  Order
                </p>

                <h2 className="mt-1 text-lg font-semibold text-[#211d18]">
                  Your Jewelry
                </h2>

              </div>

              <span className="text-sm text-gray-400">

                {
                  order.items.length
                }{" "}

                {order.items.length ===
                1
                  ? "product"
                  : "products"}

              </span>

            </div>

            <div className="mt-6 space-y-3">

              {order.items.map(
                (item) => (

                  <div
                    key={
                      item.productId
                    }
                    className="flex items-center gap-4 rounded-2xl bg-[#faf8f4] p-3 sm:p-4"
                  >

                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white">

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

                      <p className="line-clamp-2 font-semibold text-[#211d18]">
                        {
                          item.name
                        }
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Qty:{" "}
                        {
                          item.quantity
                        }
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Rs.{" "}
                        {item.price.toLocaleString()}{" "}
                        each
                      </p>

                    </div>

                    <p className="shrink-0 text-sm font-semibold text-[#211d18] sm:text-base">
                      Rs.{" "}
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString()}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>

          {/* =================================================
              DELIVERY
          ================================================= */}

          <div className="border-t border-[#c9b07a]/20 px-6 py-8 sm:px-10">

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a7a45]">
              Delivery
            </p>

            <h2 className="mt-1 text-lg font-semibold text-[#211d18]">
              Delivery Information
            </h2>

            <div className="mt-5 rounded-2xl border border-[#c9b07a]/20 bg-[#fffaf1] p-5">

              <p className="font-semibold text-[#211d18]">
                {
                  order.customer
                    .fullName
                }
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">

                {
                  order.customer
                    .address
                }

                <br />

                {
                  order.customer
                    .city
                }

                {order.customer
                  .postalCode
                  ? `, ${order.customer.postalCode}`
                  : ""}

              </p>

              <div className="mt-4 text-sm text-gray-500">

                <p>
                  {
                    order.customer
                      .phone
                  }
                </p>

                <p className="mt-1 break-all">
                  {
                    order.customer
                      .email
                  }
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              ORDER JOURNEY
          ================================================= */}

          <div className="border-t border-[#c9b07a]/20 bg-[#fcfaf5] px-6 py-10 sm:px-10">

            {order.status ===
            "Cancelled" ? (

              /* CANCELLED */

              <div className="mx-auto max-w-xl py-6 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-200 bg-red-50 text-xl text-red-600">
                  ×
                </div>

                <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-red-500">
                  Order Update
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#211d18]">
                  This Order Has Been Cancelled
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                  This order is no longer being processed.
                  If you have questions, contact Bejeweled and
                  provide your order ID.
                </p>

                <Link
                  href="/contact"
                  className="mt-6 inline-flex rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Contact Bejeweled
                </Link>

              </div>

            ) : (

              <>

                {/* JOURNEY HEADER */}

                <div className="text-center">

                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9a7a45]">
                    From Bejeweled to You
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-[#211d18]">
                    Your Order Journey
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                    Follow your order from payment review through
                    to delivery.
                  </p>

                </div>

                {/* DESKTOP JOURNEY */}

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

                    {orderSteps.map(
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
                              className={`relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full border transition ${
                                completed
                                  ? "border-[#9a7a45] bg-[#9a7a45] text-white"
                                  : "border-gray-300 bg-[#fcfaf5] text-gray-400"
                              } ${
                                current
                                  ? "ring-4 ring-[#9a7a45]/10"
                                  : ""
                              }`}
                            >

                              {completed &&
                              !current
                                ? "✓"
                                : index +
                                  1}

                            </div>

                            <p
                              className={`mt-4 text-[9px] font-semibold uppercase tracking-[0.16em] ${
                                current
                                  ? "text-[#7d6032]"
                                  : completed
                                  ? "text-gray-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {
                                step.label
                              }
                            </p>

                          </div>

                        );
                      }
                    )}

                  </div>

                </div>

                {/* MOBILE JOURNEY */}

                <div className="mx-auto mt-10 max-w-md sm:hidden">

                  {orderSteps.map(
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

                              {completed &&
                              !current
                                ? "✓"
                                : index +
                                  1}

                            </div>

                            {index !==
                              orderSteps.length -
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

                            <h3 className="mt-1 text-sm font-semibold text-[#211d18]">
                              {
                                step.title
                              }
                            </h3>

                            {current && (

                              <p className="mt-1 max-w-xs text-xs leading-5 text-gray-500">
                                {
                                  step.description
                                }
                              </p>

                            )}

                          </div>

                        </div>

                      );
                    }
                  )}

                </div>

                {/* CURRENT STATUS */}

                <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-[#c9b07a]/20 bg-white p-5">

                  <div className="flex items-start gap-4">

                    <div
                      className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${statusInfo.dot}`}
                    />

                    <div>

                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a7a45]">
                        Current Status
                      </p>

                      <h3 className="mt-1 font-semibold text-[#211d18]">
                        {
                          orderSteps[
                            currentStep
                          ].title
                        }
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {
                          orderSteps[
                            currentStep
                          ].description
                        }
                      </p>

                    </div>

                  </div>

                </div>

              </>

            )}

          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="border-t border-[#c9b07a]/20 px-6 py-8 text-center sm:px-10">

            {order.status !==
              "Cancelled" && (

              <>

                <p className="text-sm font-medium text-[#211d18]">
                  Thank you for choosing Bejeweled.
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  Keep your Order ID for tracking and future reference.
                </p>

              </>

            )}

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

              <Link
                href="/track-order"
                className="rounded-xl bg-[#211d18] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#9a7a45]"
              >
                Track Order
              </Link>

              <Link
                href="/products"
                className="rounded-xl border border-[#c9b07a]/30 px-8 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-[#9a7a45] hover:text-[#8c6d38]"
              >
                Continue Shopping
              </Link>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

/* =========================================================
   PAGE WITH SUSPENSE
========================================================= */

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f8f4ec] px-4">

          <div className="text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#e5d7ba] border-t-[#9a7a45]" />

            <p className="mt-5 text-sm text-gray-500">
              Preparing your order confirmation...
            </p>

          </div>

        </main>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
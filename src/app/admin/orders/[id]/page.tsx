"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

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

type PaymentStatus =
  | "Pending"
  | "Verified"
  | "Rejected";

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
  paymentReference?: string;
  paymentStatus: PaymentStatus;

  status: OrderStatus;

  createdAt: string;
  updatedAt: string;
}

/* =========================================================
   OPTIONS
========================================================= */

const orderStatuses: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const paymentStatuses: PaymentStatus[] = [
  "Pending",
  "Verified",
  "Rejected",
];

/* =========================================================
   PAGE
========================================================= */

export default function AdminOrderDetailsPage() {
  const params = useParams();

  const id = params.id as string;

  const [order, setOrder] =
    useState<Order | null>(null);

  const [
    selectedStatus,
    setSelectedStatus,
  ] =
    useState<OrderStatus>(
      "Pending"
    );

  const [
    selectedPaymentStatus,
    setSelectedPaymentStatus,
  ] =
    useState<PaymentStatus>(
      "Pending"
    );

  const [loading, setLoading] =
    useState(true);

  const [
    updatingStatus,
    setUpdatingStatus,
  ] =
    useState(false);

  const [
    updatingPayment,
    setUpdatingPayment,
  ] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] =
    useState("");

  const [
    copiedReference,
    setCopiedReference,
  ] =
    useState(false);

  /* =========================================================
     FETCH ORDER
  ========================================================= */

  useEffect(() => {
    if (!id) return;

    async function fetchOrder() {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `/api/orders/${id}`,
            {
              cache:
                "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to retrieve order."
          );
        }

        const fetchedOrder: Order =
          {
            ...data.order,

            paymentStatus:
              data.order
                .paymentStatus ||
              "Pending",
          };

        setOrder(
          fetchedOrder
        );

        setSelectedStatus(
          fetchedOrder.status
        );

        setSelectedPaymentStatus(
          fetchedOrder.paymentStatus
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to retrieve order."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  /* =========================================================
     SUCCESS MESSAGE
  ========================================================= */

  function showSuccess(
    message: string
  ) {
    setSuccessMessage(
      message
    );

    setTimeout(() => {
      setSuccessMessage("");
    }, 4000);
  }

  /* =========================================================
     COPY PAYMENT REFERENCE
  ========================================================= */

  async function copyPaymentReference() {
    if (
      !order?.paymentReference
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        order.paymentReference
      );

      setCopiedReference(
        true
      );

      setTimeout(() => {
        setCopiedReference(
          false
        );
      }, 2000);
    } catch {
      setError(
        "Unable to copy payment reference."
      );
    }
  }

  /* =========================================================
     UPDATE ORDER STATUS
  ========================================================= */

  async function updateOrderStatus() {
    if (!order) return;

    if (
      selectedStatus ===
      order.status
    ) {
      return;
    }

    try {
      setUpdatingStatus(
        true
      );

      setError("");
      setSuccessMessage("");

      const response =
        await fetch(
          `/api/orders/${id}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              {
                status:
                  selectedStatus,
              }
            ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to update order status."
        );

        return;
      }

      const updatedOrder: Order =
        {
          ...data.order,

          paymentStatus:
            data.order
              .paymentStatus ||
            "Pending",
        };

      setOrder(
        updatedOrder
      );

      setSelectedStatus(
        updatedOrder.status
      );

      setSelectedPaymentStatus(
        updatedOrder.paymentStatus
      );

      showSuccess(
        data.message ||
          `Order status changed to ${updatedOrder.status}.`
      );
    } catch {
      setError(
        "Unable to update order status."
      );
    } finally {
      setUpdatingStatus(
        false
      );
    }
  }

  /* =========================================================
     UPDATE PAYMENT STATUS
  ========================================================= */

  async function updatePaymentStatus(
    newStatus?: PaymentStatus
  ) {
    if (!order) return;

    const paymentStatus =
      newStatus ||
      selectedPaymentStatus;

    if (
      paymentStatus ===
      order.paymentStatus
    ) {
      return;
    }

    try {
      setUpdatingPayment(
        true
      );

      setError("");
      setSuccessMessage("");

      const response =
        await fetch(
          `/api/orders/${id}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              {
                paymentStatus,
              }
            ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to update payment status."
        );

        return;
      }

      const updatedOrder: Order =
        {
          ...data.order,

          paymentStatus:
            data.order
              .paymentStatus ||
            "Pending",
        };

      setOrder(
        updatedOrder
      );

      setSelectedStatus(
        updatedOrder.status
      );

      setSelectedPaymentStatus(
        updatedOrder.paymentStatus
      );

      showSuccess(
        data.message ||
          `Payment status changed to ${updatedOrder.paymentStatus}.`
      );
    } catch {
      setError(
        "Unable to update payment status."
      );
    } finally {
      setUpdatingPayment(
        false
      );
    }
  }

  /* =========================================================
     ORDER STATUS STYLE
  ========================================================= */

  function getStatusStyle(
    status: OrderStatus
  ) {
    switch (status) {
      case "Pending":
        return "border-amber-200 bg-amber-50 text-amber-700";

      case "Confirmed":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "Processing":
        return "border-purple-200 bg-purple-50 text-purple-700";

      case "Shipped":
        return "border-indigo-200 bg-indigo-50 text-indigo-700";

      case "Delivered":
        return "border-green-200 bg-green-50 text-green-700";

      case "Cancelled":
        return "border-red-200 bg-red-50 text-red-700";

      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  }

  /* =========================================================
     PAYMENT STATUS STYLE
  ========================================================= */

  function getPaymentStyle(
    status: PaymentStatus
  ) {
    switch (status) {
      case "Pending":
        return "border-amber-200 bg-amber-50 text-amber-700";

      case "Verified":
        return "border-green-200 bg-green-50 text-green-700";

      case "Rejected":
        return "border-red-200 bg-red-50 text-red-700";

      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5]">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

          <p className="mt-4 text-sm text-gray-500">
            Loading order...
          </p>

        </div>

      </main>
    );
  }

  /* =========================================================
     NOT FOUND
  ========================================================= */

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-6">

        <div className="text-center">

          <h1 className="text-2xl font-semibold text-gray-950">
            Order Not Found
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            {error ||
              "This order could not be found."}
          </p>

          <Link
            href="/admin/orders"
            className="mt-6 inline-block rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Back to Orders
          </Link>

        </div>

      </main>
    );
  }

  const paymentVerified =
    order.paymentStatus ===
    "Verified";

  const fulfilmentStatuses: OrderStatus[] =
    [
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
    ];

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-6xl">

        {/* BACK */}

        <Link
          href="/admin/orders"
          className="text-sm font-medium text-gray-500 transition hover:text-black"
        >
          ← Back to Orders
        </Link>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mt-8 flex flex-col gap-5 border-b border-gray-200 pb-8 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">
              Bejeweled Order
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">
              #
              {order._id
                .slice(-8)
                .toUpperCase()}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Placed{" "}
              {new Date(
                order.createdAt
              ).toLocaleString(
                "en-GB",
                {
                  day: "2-digit",
                  month:
                    "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute:
                    "2-digit",
                }
              )}
            </p>

          </div>

          <div className="flex flex-wrap gap-2">

            <span
              className={`rounded-full border px-4 py-2 text-xs font-semibold ${getPaymentStyle(
                order.paymentStatus
              )}`}
            >
              Payment:{" "}
              {
                order.paymentStatus
              }
            </span>

            <span
              className={`rounded-full border px-4 py-2 text-xs font-semibold ${getStatusStyle(
                order.status
              )}`}
            >
              Order:{" "}
              {
                order.status
              }
            </span>

          </div>

        </div>

        {/* SUCCESS */}

        {successMessage && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            ✓{" "}
            {successMessage}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="space-y-6 lg:col-span-2">

            {/* CUSTOMER */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400">
                Customer
              </p>

              <h2 className="mt-3 text-xl font-semibold text-gray-950">
                {
                  order.customer
                    .fullName
                }
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">

                <div>

                  <p className="text-xs text-gray-400">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-gray-800">
                    {
                      order.customer
                        .email
                    }
                  </p>

                </div>

                <div>

                  <p className="text-xs text-gray-400">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {
                      order.customer
                        .phone
                    }
                  </p>

                </div>

              </div>

            </section>

            {/* DELIVERY */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400">
                Delivery
              </p>

              <h2 className="mt-3 text-lg font-semibold text-gray-950">
                Delivery Address
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-600">

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

            </section>

            {/* PRODUCTS */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400">
                    Order Contents
                  </p>

                  <h2 className="mt-2 text-lg font-semibold text-gray-950">
                    Products
                  </h2>

                </div>

                <span className="text-sm text-gray-400">

                  {
                    order.items
                      .length
                  }{" "}

                  {order.items
                    .length === 1
                    ? "product"
                    : "products"}

                </span>

              </div>

              <div className="mt-6 divide-y divide-gray-100">

                {order.items.map(
                  (item) => (

                    <div
                      key={
                        item.productId
                      }
                      className="flex items-center gap-4 py-5 first:pt-0 last:pb-0"
                    >

                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-100">

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

                        <p className="font-semibold text-gray-950">
                          {
                            item.name
                          }
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity:{" "}
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

                      <p className="shrink-0 font-semibold text-gray-950">
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

            </section>

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="space-y-6">

            {/* =================================================
                PAYMENT
            ================================================= */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400">
                Payment
              </p>

              <div className="mt-5 flex items-center justify-between">

                <div>

                  <p className="text-xs text-gray-400">
                    Method
                  </p>

                  <p className="mt-1 font-semibold text-gray-950">
                    {
                      order.paymentMethod
                    }
                  </p>

                </div>

                <span
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${getPaymentStyle(
                    order.paymentStatus
                  )}`}
                >
                  {
                    order.paymentStatus
                  }
                </span>

              </div>

              {/* PAYMENT REFERENCE */}

              <div className="mt-5 rounded-xl border border-[#c9b07a]/30 bg-[#faf6ed] p-4">

                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a7a45]">
                  Fonepay Reference
                </p>

                {order.paymentReference ? (

                  <>

                    <p className="mt-2 break-all font-mono text-sm font-semibold text-[#211d18]">
                      {
                        order.paymentReference
                      }
                    </p>

                    <button
                      type="button"
                      onClick={
                        copyPaymentReference
                      }
                      className="mt-3 text-xs font-semibold text-[#8a6d3d] transition hover:text-[#211d18]"
                    >
                      {copiedReference
                        ? "Copied ✓"
                        : "Copy Reference"}
                    </button>

                  </>

                ) : (

                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    No payment reference was stored for this
                    order. This may be an older order created
                    before payment references were introduced.
                  </p>

                )}

              </div>

              <div className="my-5 border-t border-gray-100" />

              <h3 className="text-sm font-semibold text-gray-950">
                Payment Verification
              </h3>

              <p className="mt-2 text-xs leading-5 text-gray-500">
                Check the Fonepay payment reference against your
                payment records before verifying the payment.
              </p>

              {/* QUICK ACTIONS */}

              <div className="mt-5 grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() =>
                    updatePaymentStatus(
                      "Verified"
                    )
                  }
                  disabled={
                    updatingPayment ||
                    order.paymentStatus ===
                      "Verified"
                  }
                  className="rounded-xl bg-green-600 px-3 py-3 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                >
                  {updatingPayment
                    ? "Updating..."
                    : "Verify Payment"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updatePaymentStatus(
                      "Rejected"
                    )
                  }
                  disabled={
                    updatingPayment ||
                    order.paymentStatus ===
                      "Rejected"
                  }
                  className="rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Reject Payment
                </button>

              </div>

              {/* PAYMENT SELECT */}

              <label className="mt-6 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Payment Status
              </label>

              <select
                value={
                  selectedPaymentStatus
                }
                onChange={(event) =>
                  setSelectedPaymentStatus(
                    event.target
                      .value as PaymentStatus
                  )
                }
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition focus:border-gray-500"
              >

                {paymentStatuses.map(
                  (status) => (

                    <option
                      key={
                        status
                      }
                      value={
                        status
                      }
                    >
                      {
                        status
                      }
                    </option>

                  )
                )}

              </select>

              <button
                type="button"
                onClick={() =>
                  updatePaymentStatus()
                }
                disabled={
                  updatingPayment ||
                  selectedPaymentStatus ===
                    order.paymentStatus
                }
                className="mt-3 w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 hover:text-black disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
              >
                {updatingPayment
                  ? "Updating..."
                  : "Update Payment Status"}
              </button>

              {order.paymentStatus ===
                "Verified" && (

                <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">

                  <p className="text-xs font-semibold text-blue-800">
                    Payment corrections are allowed
                  </p>

                  <p className="mt-1 text-xs leading-5 text-blue-700">
                    If payment is changed back to Pending or
                    Rejected after fulfilment started, the order
                    will automatically return to Pending.
                  </p>

                </div>

              )}

              <div className="my-6 border-t border-gray-100" />

              <div className="flex items-end justify-between">

                <span className="text-sm font-medium text-gray-600">
                  Order Total
                </span>

                <span className="text-2xl font-semibold text-gray-950">
                  Rs.{" "}
                  {order.total.toLocaleString()}
                </span>

              </div>

            </section>

            {/* =================================================
                FULFILMENT
            ================================================= */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400">
                Fulfilment
              </p>

              <h2 className="mt-2 text-lg font-semibold text-gray-950">
                Order Status
              </h2>

              <p className="mt-2 text-xs leading-5 text-gray-500">
                Manage preparation and delivery after payment
                verification.
              </p>

              {!paymentVerified && (

                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">

                  <div className="flex gap-3">

                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                      !
                    </div>

                    <div>

                      <p className="text-xs font-semibold text-amber-800">
                        Payment verification required
                      </p>

                      <p className="mt-1 text-xs leading-5 text-amber-700">
                        Confirmed, Processing, Shipped and Delivered
                        become available after payment is verified.
                      </p>

                    </div>

                  </div>

                </div>

              )}

              <label className="mt-6 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Order Status
              </label>

              <select
                value={
                  selectedStatus
                }
                onChange={(event) =>
                  setSelectedStatus(
                    event.target
                      .value as OrderStatus
                  )
                }
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition focus:border-gray-500"
              >

                {orderStatuses.map(
                  (status) => {

                    const requiresPayment =
                      fulfilmentStatuses.includes(
                        status
                      );

                    const disabled =
                      requiresPayment &&
                      !paymentVerified;

                    return (

                      <option
                        key={
                          status
                        }
                        value={
                          status
                        }
                        disabled={
                          disabled
                        }
                      >
                        {
                          status
                        }

                        {disabled
                          ? " - verify payment first"
                          : ""}
                      </option>

                    );
                  }
                )}

              </select>

              <button
                type="button"
                onClick={
                  updateOrderStatus
                }
                disabled={
                  updatingStatus ||
                  selectedStatus ===
                    order.status ||
                  (
                    !paymentVerified &&
                    fulfilmentStatuses.includes(
                      selectedStatus
                    )
                  )
                }
                className="mt-4 w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {updatingStatus
                  ? "Updating..."
                  : "Update Order Status"}
              </button>

            </section>

            {/* =================================================
                REFERENCE
            ================================================= */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400">
                Reference
              </p>

              <div className="mt-5">

                <p className="text-xs text-gray-400">
                  Full Order ID
                </p>

                <p className="mt-1 break-all font-mono text-xs text-gray-700">
                  {
                    order._id
                  }
                </p>

              </div>

              <div className="mt-5">

                <p className="text-xs text-gray-400">
                  Payment Reference
                </p>

                <p className="mt-1 break-all font-mono text-xs text-gray-700">
                  {order.paymentReference ||
                    "Not available"}
                </p>

              </div>

              <div className="mt-5">

                <p className="text-xs text-gray-400">
                  Last Updated
                </p>

                <p className="mt-1 text-sm text-gray-700">
                  {new Date(
                    order.updatedAt
                  ).toLocaleString()}
                </p>

              </div>

            </section>

          </div>

        </div>

      </div>

    </main>
  );
}
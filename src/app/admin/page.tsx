"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

type MessageStatus =
  | "New"
  | "Read"
  | "Replied";

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
  updatedAt: string;
}

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
  updatedAt?: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);

  const [messages, setMessages] =
    useState<ContactMessage[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [loggingOut, setLoggingOut] =
    useState(false);

  /* =========================================================
     FETCH DASHBOARD DATA
  ========================================================= */

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError("");

        const [
          ordersResponse,
          messagesResponse,
        ] = await Promise.all([
          fetch("/api/orders", {
            cache: "no-store",
          }),

          fetch("/api/admin/messages", {
            cache: "no-store",
          }),
        ]);

        const ordersData =
          await ordersResponse.json();

        const messagesData =
          await messagesResponse.json();

        if (!ordersResponse.ok) {
          throw new Error(
            ordersData.message ||
              "Unable to load orders."
          );
        }

        if (!messagesResponse.ok) {
          throw new Error(
            messagesData.message ||
              "Unable to load messages."
          );
        }

        setOrders(
          Array.isArray(ordersData.orders)
            ? ordersData.orders
            : []
        );

        setMessages(
          Array.isArray(messagesData.messages)
            ? messagesData.messages
            : []
        );
      } catch (error) {
        console.error(
          "Dashboard error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  /* =========================================================
     LOGOUT
  ========================================================= */


async function logout() {
  try {
    setLoggingOut(true);

    const response = await fetch(
      "/api/admin/logout",
      {
        method: "POST",
        cache: "no-store",
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to sign out."
      );
    }

    /*
     * Use replace so the dashboard
     * isn't kept in browser history.
     */
    router.replace(
      "/admin/login"
    );

    router.refresh();
  } catch (error) {
    console.error(
      "Logout error:",
      error
    );

    setLoggingOut(false);
  }
}

  
  /* =========================================================
     ORDER DASHBOARD DATA
  ========================================================= */

  const totalOrders =
    orders.length;

  const pendingOrders =
    orders.filter(
      (order) =>
        order.status === "Pending"
    ).length;

  const confirmedOrders =
    orders.filter(
      (order) =>
        order.status === "Confirmed"
    ).length;

  const processingOrders =
    orders.filter(
      (order) =>
        order.status === "Processing"
    ).length;

  const shippedOrders =
    orders.filter(
      (order) =>
        order.status === "Shipped"
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.status === "Delivered"
    ).length;

  const cancelledOrders =
    orders.filter(
      (order) =>
        order.status === "Cancelled"
    ).length;

  const totalOrderValue =
    orders
      .filter(
        (order) =>
          order.status !== "Cancelled"
      )
      .reduce(
        (total, order) =>
          total + order.total,
        0
      );

  const deliveredRevenue =
    orders
      .filter(
        (order) =>
          order.status === "Delivered"
      )
      .reduce(
        (total, order) =>
          total + order.total,
        0
      );

  const totalItems =
    orders.reduce(
      (total, order) =>
        total +
        order.items.reduce(
          (
            itemTotal,
            item
          ) =>
            itemTotal +
            item.quantity,
          0
        ),
      0
    );

  /* =========================================================
     MESSAGE DATA
  ========================================================= */

  const totalMessages =
    messages.length;

  const newMessages =
    messages.filter(
      (message) =>
        message.status === "New"
    ).length;

  const repliedMessages =
    messages.filter(
      (message) =>
        message.status === "Replied"
    ).length;

  /* =========================================================
     RECENT ORDERS
  ========================================================= */

  const recentOrders =
    useMemo(() => {
      return [...orders]
        .sort(
          (a, b) =>
            new Date(
              b.createdAt
            ).getTime() -
            new Date(
              a.createdAt
            ).getTime()
        )
        .slice(0, 5);
    }, [orders]);

  /* =========================================================
     RECENT MESSAGES
  ========================================================= */

  const recentMessages =
    useMemo(() => {
      return [...messages]
        .sort(
          (a, b) =>
            new Date(
              b.createdAt
            ).getTime() -
            new Date(
              a.createdAt
            ).getTime()
        )
        .slice(0, 3);
    }, [messages]);

  /* =========================================================
     STATUS STYLE
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

  return (
    <main className="min-h-screen bg-[#f7f7f5]">

     

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ===================================================
            TITLE
        ==================================================== */}
{/* ===================================================
          ADMIN NAVBAR
      =================================================== */}

      <header className="border-b border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">

          {/* BRAND */}

          <div>

            <Link
              href="/admin/orders"
              className="text-lg font-bold tracking-[0.12em] text-gray-900"
            >
              BEJEWELED
            </Link>

            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-gray-400">
              Administration
            </p>

          </div>

          {/* ACTIONS */}

          <div className="flex items-center gap-3">

            <Link
              href="/"
              target="_blank"
              className="hidden rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:border-gray-400 hover:text-black sm:block"
            >
              View Store
            </Link>

            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loggingOut
                ? "Signing Out..."
                : "Sign Out"}
            </button>

          </div>

        </div>

      </header>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400 mt-8">
              Overview
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage Bejeweled orders,
              products and customer
              enquiries.
            </p>

          </div>

          {/* ADMIN ACTIONS */}

          <div className="flex flex-wrap gap-3">

            <Link
              href="/admin/orders"
              className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Manage Orders
            </Link>

            <Link
              href="/admin/products"
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-400 hover:text-black"
            >
              Products
            </Link>

            <Link
              href="/admin/messages"
              className="relative rounded-xl border border-[#c6a45e]/40 bg-[#fffaf0] px-5 py-3 text-sm font-semibold text-[#7c602f] transition hover:border-[#b18d49] hover:bg-[#f6ead2]"
            >
              Messages

              {newMessages > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">
                  {newMessages >
                  99
                    ? "99+"
                    : newMessages}
                </span>
              )}
            </Link>



            <Link
              href="/"
           
              className="hidden rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:border-gray-400 hover:text-black sm:block"
            >
              View Store
            </Link>

          </div>

        </div>

        {/* ===================================================
            LOADING
        ==================================================== */}

        {loading && (

          <div className="mt-10 flex min-h-[300px] items-center justify-center rounded-3xl border border-gray-200 bg-white">

            <div className="text-center">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

              <p className="mt-4 text-sm text-gray-400">
                Preparing dashboard...
              </p>

            </div>

          </div>

        )}

        {/* ===================================================
            ERROR
        ==================================================== */}

        {!loading &&
          error && (

          <div className="mt-10 rounded-2xl border border-red-100 bg-red-50 p-6">

            <p className="font-semibold text-red-700">
              Unable to load dashboard
            </p>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

          </div>

        )}

        {!loading &&
          !error && (

          <>

            {/* ===============================================
                PRIMARY STATS
            ================================================ */}

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

              {/* TOTAL ORDERS */}

              <div className="rounded-2xl border border-gray-200 bg-white p-6">

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Total Orders
                </p>

                <p className="mt-4 text-3xl font-semibold text-gray-900">
                  {totalOrders}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  {totalItems} products ordered
                </p>

              </div>

              {/* PENDING */}

              <div className="rounded-2xl border border-gray-200 bg-white p-6">

                <div className="flex items-center justify-between">

                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Awaiting Review
                  </p>

                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />

                </div>

                <p className="mt-4 text-3xl font-semibold text-gray-900">
                  {pendingOrders}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Pending payment review
                </p>

              </div>

              {/* ACTIVE */}

              <div className="rounded-2xl border border-gray-200 bg-white p-6">

                <div className="flex items-center justify-between">

                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Active Orders
                  </p>

                  <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />

                </div>

                <p className="mt-4 text-3xl font-semibold text-gray-900">
                  {confirmedOrders +
                    processingOrders +
                    shippedOrders}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Confirmed through shipped
                </p>

              </div>

              {/* DELIVERED */}

              <div className="rounded-2xl border border-gray-200 bg-white p-6">

                <div className="flex items-center justify-between">

                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Delivered
                  </p>

                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                </div>

                <p className="mt-4 text-3xl font-semibold text-gray-900">
                  {deliveredOrders}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Completed orders
                </p>

              </div>

              {/* MESSAGES */}

              <Link
                href="/admin/messages"
                className="group rounded-2xl border border-[#d6bf91] bg-[#fffaf0] p-6 transition hover:-translate-y-0.5 hover:border-[#b9975b] hover:shadow-sm"
              >

                <div className="flex items-center justify-between">

                  <p className="text-xs font-semibold uppercase tracking-wider text-[#9a7a45]">
                    Messages
                  </p>

                  {newMessages >
                    0 && (
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  )}

                </div>

                <p className="mt-4 text-3xl font-semibold text-gray-900">
                  {totalMessages}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  {newMessages >
                  0
                    ? `${newMessages} new ${
                        newMessages ===
                        1
                          ? "message"
                          : "messages"
                      }`
                    : "No new messages"}
                </p>

              </Link>

            </div>

            {/* ===============================================
                FINANCIAL + STATUS
            ================================================ */}

            <div className="mt-6 grid gap-6 lg:grid-cols-3">

              {/* ORDER VALUE */}

              <section className="rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-1">

                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400">
                  Commerce
                </p>

                <h2 className="mt-2 text-lg font-semibold text-gray-900">
                  Order Value
                </h2>

                <div className="mt-7">

                  <p className="text-xs text-gray-400">
                    Total active order value
                  </p>

                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    Rs.{" "}
                    {totalOrderValue.toLocaleString()}
                  </p>

                </div>

                <div className="my-6 border-t border-gray-100" />

                <div>

                  <p className="text-xs text-gray-400">
                    Delivered value
                  </p>

                  <p className="mt-2 text-xl font-semibold text-green-700">
                    Rs.{" "}
                    {deliveredRevenue.toLocaleString()}
                  </p>

                </div>

              </section>

              {/* FULFILMENT */}

              <section className="rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-2">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400">
                      Fulfilment
                    </p>

                    <h2 className="mt-2 text-lg font-semibold text-gray-900">
                      Order Status
                    </h2>

                  </div>

                  <Link
                    href="/admin/orders"
                    className="text-sm font-semibold text-gray-400 transition hover:text-black"
                  >
                    View All →
                  </Link>

                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-3">

                  <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-xs text-gray-400">
                      Confirmed
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-blue-700">
                      {confirmedOrders}
                    </p>

                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-xs text-gray-400">
                      Processing
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-purple-700">
                      {processingOrders}
                    </p>

                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-xs text-gray-400">
                      Shipped
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-indigo-700">
                      {shippedOrders}
                    </p>

                  </div>

                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">

                  <div className="rounded-xl bg-green-50 p-4">

                    <p className="text-xs text-green-700">
                      Delivered
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-green-700">
                      {deliveredOrders}
                    </p>

                  </div>

                  <div className="rounded-xl bg-red-50 p-4">

                    <p className="text-xs text-red-700">
                      Cancelled
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-red-700">
                      {cancelledOrders}
                    </p>

                  </div>

                </div>

              </section>

            </div>

            {/* ===============================================
                RECENT ORDERS + MESSAGES
            ================================================ */}

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">

              {/* RECENT ORDERS */}

              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400">
                      Latest Activity
                    </p>

                    <h2 className="mt-1 text-lg font-semibold text-gray-900">
                      Recent Orders
                    </h2>

                  </div>

                  <Link
                    href="/admin/orders"
                    className="text-sm font-semibold text-gray-400 transition hover:text-black"
                  >
                    All Orders →
                  </Link>

                </div>

                {recentOrders.length ===
                0 ? (

                  <div className="px-6 py-14 text-center">

                    <p className="text-sm text-gray-400">
                      No orders have been placed yet.
                    </p>

                  </div>

                ) : (

                  <div className="divide-y divide-gray-100">

                    {recentOrders.map(
                      (order) => (

                      <Link
                        key={
                          order._id
                        }
                        href={`/admin/orders/${order._id}`}
                        className="flex flex-col gap-4 px-6 py-5 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
                      >

                        <div className="flex items-center gap-4">

                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold text-gray-600">
                            {order.customer.fullName
                              .charAt(
                                0
                              )
                              .toUpperCase()}
                          </div>

                          <div>

                            <p className="font-medium text-gray-900">
                              {
                                order
                                  .customer
                                  .fullName
                              }
                            </p>

                            <p className="mt-1 font-mono text-xs text-gray-400">
                              #
                              {order._id
                                .slice(
                                  -8
                                )
                                .toUpperCase()}
                            </p>

                          </div>

                        </div>

                        <div className="flex items-center justify-between gap-5 sm:justify-end">

                          <div className="text-left sm:text-right">

                            <p className="text-sm font-semibold text-gray-900">
                              Rs.{" "}
                              {order.total.toLocaleString()}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {new Date(
                                order.createdAt
                              ).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month:
                                    "short",
                                }
                              )}
                            </p>

                          </div>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {
                              order.status
                            }
                          </span>

                        </div>

                      </Link>

                    ))}

                  </div>

                )}

              </section>

              {/* RECENT MESSAGES */}

              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9a7a45]">
                      Customer Support
                    </p>

                    <h2 className="mt-1 text-lg font-semibold text-gray-900">
                      Messages
                    </h2>

                  </div>

                  <Link
                    href="/admin/messages"
                    className="text-sm font-semibold text-gray-400 transition hover:text-[#9a7a45]"
                  >
                    View All →
                  </Link>

                </div>

                {recentMessages.length ===
                0 ? (

                  <div className="px-6 py-14 text-center">

                    <p className="text-sm text-gray-400">
                      No customer messages yet.
                    </p>

                  </div>

                ) : (

                  <div className="divide-y divide-gray-100">

                    {recentMessages.map(
                      (message) => (

                      <Link
                        key={
                          message._id
                        }
                        href="/admin/messages"
                        className="block px-6 py-5 transition hover:bg-[#fffaf0]"
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div className="min-w-0">

                            <div className="flex items-center gap-2">

                              <p className="truncate text-sm font-semibold text-gray-900">
                                {
                                  message.name
                                }
                              </p>

                              {message.status ===
                                "New" && (
                                <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
                              )}

                            </div>

                            <p className="mt-1 truncate text-xs font-medium text-[#9a7a45]">
                              {
                                message.subject
                              }
                            </p>

                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">
                              {
                                message.message
                              }
                            </p>

                          </div>

                        </div>

                      </Link>

                    ))}

                  </div>

                )}

                <div className="border-t border-gray-100 px-6 py-4">

                  <div className="flex items-center justify-between text-xs">

                    <span className="text-gray-400">
                      {newMessages} new
                    </span>

                    <span className="text-gray-400">
                      {repliedMessages} replied
                    </span>

                  </div>

                </div>

              </section>

            </div>

          </>

        )}

      </div>

    </main>
  );
}
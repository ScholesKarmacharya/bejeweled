"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  updatedAt: string;
}

/* =========================================================
   STATUS STYLES
========================================================= */

function getStatusStyle(status: OrderStatus) {
  switch (status) {
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "Confirmed":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "Processing":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "Shipped":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";

    case "Delivered":
      return "bg-green-50 text-green-700 border-green-200";

    case "Cancelled":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function getStatusDot(status: OrderStatus) {
  switch (status) {
    case "Pending":
      return "bg-amber-500";

    case "Confirmed":
      return "bg-blue-500";

    case "Processing":
      return "bg-purple-500";

    case "Shipped":
      return "bg-indigo-500";

    case "Delivered":
      return "bg-green-500";

    case "Cancelled":
      return "bg-red-500";

    default:
      return "bg-gray-500";
  }
}

/* =========================================================
   PAGE
========================================================= */

export default function AdminOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [loggingOut, setLoggingOut] =
    useState(false);

  /* =======================================================
     FETCH ORDERS
  ======================================================= */

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/orders", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to retrieve orders."
          );
        }

        /*
         * Supports either:
         *
         * { orders: [...] }
         *
         * or:
         *
         * { success: true, orders: [...] }
         */

        setOrders(
          Array.isArray(data.orders)
            ? data.orders
            : []
        );
      } catch (error) {
        console.error(
          "Fetch orders error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to retrieve orders."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  /* =======================================================
     LOGOUT
  ======================================================= */

  async function logout() {
    try {
      setLoggingOut(true);

      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  /* =======================================================
     FILTER ORDERS
  ======================================================= */

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchValue =
        search.trim().toLowerCase();

      const shortOrderId = order._id
        .slice(-8)
        .toLowerCase();

      const matchesSearch =
        !searchValue ||
        order._id
          .toLowerCase()
          .includes(searchValue.replace("#", "")) ||
        shortOrderId.includes(
          searchValue.replace("#", "")
        ) ||
        order.customer.fullName
          .toLowerCase()
          .includes(searchValue) ||
        order.customer.email
          .toLowerCase()
          .includes(searchValue) ||
        order.customer.phone
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [orders, search, statusFilter]);

  /* =======================================================
     COUNTS
  ======================================================= */

  const pendingCount = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const processingCount = orders.filter(
    (order) =>
      order.status === "Confirmed" ||
      order.status === "Processing"
  ).length;

  const shippedCount = orders.filter(
    (order) => order.status === "Shipped"
  ).length;

  const deliveredCount = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#f7f7f5]">

      

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* PAGE HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gray-400">
              Order Management
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
              Orders
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Review customer orders and manage
              fulfilment.
            </p>

          </div>

          <div className="text-sm text-gray-400">

            {orders.length}{" "}
            {orders.length === 1
              ? "order"
              : "orders"}{" "}
            total

          </div>

        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* PENDING */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5">

            <div className="flex items-center justify-between">

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Pending
              </p>

              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />

            </div>

            <p className="mt-4 text-3xl font-semibold text-gray-900">
              {pendingCount}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Awaiting review
            </p>

          </div>

          {/* PROCESSING */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5">

            <div className="flex items-center justify-between">

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                In Progress
              </p>

              <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />

            </div>

            <p className="mt-4 text-3xl font-semibold text-gray-900">
              {processingCount}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Confirmed / processing
            </p>

          </div>

          {/* SHIPPED */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5">

            <div className="flex items-center justify-between">

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Shipped
              </p>

              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />

            </div>

            <p className="mt-4 text-3xl font-semibold text-gray-900">
              {shippedCount}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              On the way
            </p>

          </div>

          {/* DELIVERED */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5">

            <div className="flex items-center justify-between">

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Delivered
              </p>

              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

            </div>

            <p className="mt-4 text-3xl font-semibold text-gray-900">
              {deliveredCount}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Completed orders
            </p>

          </div>

        </div>

        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-4">

          <div className="flex flex-col gap-3 sm:flex-row">

            {/* SEARCH */}

            <div className="relative flex-1">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />

                <path d="m20 20-3.5-3.5" />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search order ID, customer, email or phone..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
              />

            </div>

            {/* STATUS FILTER */}

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-gray-400 focus:bg-white"
            >
              <option value="All">
                All Statuses
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Confirmed">
                Confirmed
              </option>

              <option value="Processing">
                Processing
              </option>

              <option value="Shipped">
                Shipped
              </option>

              <option value="Delivered">
                Delivered
              </option>

              <option value="Cancelled">
                Cancelled
              </option>

            </select>

          </div>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="mt-8 flex min-h-[300px] items-center justify-center rounded-2xl border border-gray-200 bg-white">

            <div className="text-center">

              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

              <p className="mt-4 text-sm text-gray-400">
                Loading orders...
              </p>

            </div>

          </div>

        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (

          <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-6 text-center">

            <p className="font-semibold text-red-700">
              Unable to load orders
            </p>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

          </div>

        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          filteredOrders.length === 0 && (

            <div className="mt-8 rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-5 w-5 text-gray-500"
                >
                  <path d="M4 7h16v13H4z" />

                  <path d="M8 7V5a4 4 0 0 1 8 0v2" />
                </svg>

              </div>

              <h2 className="mt-4 font-semibold text-gray-900">
                No orders found
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Try changing your search or status
                filter.
              </p>

            </div>

          )}

        {/* =================================================
            ORDERS TABLE
        ================================================= */}

        {!loading &&
          !error &&
          filteredOrders.length > 0 && (

            <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">

              {/* DESKTOP */}

              <div className="hidden overflow-x-auto md:block">

                <table className="w-full">

                  <thead className="border-b border-gray-100 bg-gray-50">

                    <tr>

                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Order
                      </th>

                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Date
                      </th>

                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Total
                      </th>

                      <th className="px-6 py-4" />

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-gray-100">

                    {filteredOrders.map(
                      (order) => (

                        <tr
                          key={order._id}
                          className="transition hover:bg-gray-50"
                        >

                          {/* ORDER */}

                          <td className="px-6 py-5">

                            <p className="font-mono text-sm font-semibold text-gray-900">
                              #
                              {order._id
                                .slice(-8)
                                .toUpperCase()}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {
                                order.items
                                  .length
                              }{" "}
                              {order.items
                                .length === 1
                                ? "item"
                                : "items"}
                            </p>

                          </td>

                          {/* CUSTOMER */}

                          <td className="px-6 py-5">

                            <p className="text-sm font-medium text-gray-900">
                              {
                                order
                                  .customer
                                  .fullName
                              }
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {
                                order
                                  .customer
                                  .phone
                              }
                            </p>

                          </td>

                          {/* DATE */}

                          <td className="px-6 py-5 text-sm text-gray-500">

                            {new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}

                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                                order.status
                              )}`}
                            >

                              <span
                                className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                                  order.status
                                )}`}
                              />

                              {order.status}

                            </span>

                          </td>

                          {/* TOTAL */}

                          <td className="px-6 py-5 text-right">

                            <p className="text-sm font-semibold text-gray-900">
                              Rs.{" "}
                              {order.total.toLocaleString()}
                            </p>

                          </td>

                          {/* OPEN */}

                          <td className="px-6 py-5 text-right">

                            <Link
                              href={`/admin/orders/${order._id}`}
                              className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 transition hover:text-black"
                            >
                              View

                              <span>
                                →
                              </span>
                            </Link>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

              {/* =============================================
                  MOBILE
              ============================================= */}

              <div className="divide-y divide-gray-100 md:hidden">

                {filteredOrders.map(
                  (order) => (

                    <Link
                      key={order._id}
                      href={`/admin/orders/${order._id}`}
                      className="block p-5 transition hover:bg-gray-50"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <p className="font-mono text-sm font-semibold text-gray-900">
                            #
                            {order._id
                              .slice(-8)
                              .toUpperCase()}
                          </p>

                          <p className="mt-2 text-sm font-medium text-gray-800">
                            {
                              order.customer
                                .fullName
                            }
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>

                        </div>

                        <p className="text-sm font-semibold text-gray-900">
                          Rs.{" "}
                          {order.total.toLocaleString()}
                        </p>

                      </div>

                      <div className="mt-4 flex items-center justify-between">

                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                            order.status
                          )}`}
                        >

                          <span
                            className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                              order.status
                            )}`}
                          />

                          {order.status}

                        </span>

                        <span className="text-sm text-gray-400">
                          View →
                        </span>

                      </div>

                    </Link>

                  )
                )}

              </div>

            </div>

          )}

      </div>

    </main>
  );
}
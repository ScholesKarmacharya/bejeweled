"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type OrderData = {
  orderId: string;
  total: number;
  paymentMethod: string;
  customerName: string;
};

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const savedOrder = sessionStorage.getItem(
      "bejeweled-last-order"
    );

    if (savedOrder) {
      try {
        setOrder(JSON.parse(savedOrder));
      } catch (error) {
        console.error("Failed to read order:", error);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#fafafa] px-4 py-12 sm:px-6 lg:px-8">

      <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">

        <div className="w-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">

          {/* Top Accent */}
          <div className="h-1.5 w-full bg-black" />

          <div className="px-6 py-10 text-center sm:px-10 sm:py-14">

            {/* Success Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-3xl text-white shadow-lg">
                ✓
              </div>
            </div>

            {/* Heading */}
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
              Bejeweled
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Order Confirmed
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
              Thank you for choosing Bejeweled. Your order has
              been successfully received and is being prepared
              with care.
            </p>

            {/* Order ID */}
            {order?.orderId && (
              <div className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full bg-gray-50 px-5 py-2.5 text-sm">
                <span className="text-gray-400">
                  Order ID
                </span>

                <span className="font-semibold text-gray-900">
                  #{order.orderId}
                </span>
              </div>
            )}

            {/* Order Details */}
            <div className="mt-10 rounded-2xl border border-gray-100 bg-[#fafafa] p-5 text-left sm:p-6">

              <h2 className="text-lg font-semibold text-gray-900">
                Order Details
              </h2>

              <div className="mt-5 space-y-4">

                {/* Customer */}
                {order?.customerName && (
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-gray-500">
                      Customer
                    </span>

                    <span className="font-medium text-gray-900">
                      {order.customerName}
                    </span>
                  </div>
                )}

                {/* Payment */}
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-gray-500">
                    Payment Method
                  </span>

                  <span className="rounded-full bg-green-50 px-3 py-1 font-medium text-green-700">
                    {order?.paymentMethod || "Fonepay"}
                  </span>
                </div>

                {/* Total */}
                {order?.total && (
                  <div className="border-t border-gray-200 pt-4">

                    <div className="flex items-center justify-between">

                      <span className="font-semibold text-gray-900">
                        Total Paid
                      </span>

                      <span className="text-xl font-bold text-gray-900">
                        Rs.{" "}
                        {order.total.toLocaleString()}
                      </span>

                    </div>

                  </div>
                )}

              </div>
            </div>

            {/* Delivery Message */}
            <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 text-left">

              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl">
                  📦
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    What happens next?
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Our team will verify your order and payment,
                    then prepare your jewelry for delivery. We
                    will contact you if we need any additional
                    information.
                  </p>
                </div>

              </div>

            </div>

            {/* Buttons */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">

              <Link
                href="/products"
                className="flex items-center justify-center rounded-xl bg-black px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Continue Shopping
              </Link>

              <Link
                href="/"
                className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:text-black"
              >
                Back to Home
              </Link>

            </div>

            {/* Footer Note */}
            <p className="mt-8 text-xs leading-5 text-gray-400">
              Thank you for shopping with Bejeweled. ✨
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type MessageStatus =
  | "New"
  | "Read"
  | "Replied";

type ContactMessage = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] =
    useState<ContactMessage[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =====================================================
     LOAD MESSAGES
  ====================================================== */

  useEffect(() => {
    async function loadMessages() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/admin/messages",
          {
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load messages."
          );
        }

        setMessages(
          Array.isArray(data.messages)
            ? data.messages
            : []
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load messages."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, []);

  /* =====================================================
     COUNTS
  ====================================================== */

  const newMessages = useMemo(
    () =>
      messages.filter(
        (message) =>
          message.status === "New"
      ).length,
    [messages]
  );

  const readMessages = useMemo(
    () =>
      messages.filter(
        (message) =>
          message.status === "Read"
      ).length,
    [messages]
  );

  const repliedMessages = useMemo(
    () =>
      messages.filter(
        (message) =>
          message.status === "Replied"
      ).length,
    [messages]
  );

  function getStatusStyle(
    status: MessageStatus
  ) {
    switch (status) {
      case "New":
        return "border-amber-200 bg-amber-50 text-amber-700";

      case "Read":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "Replied":
        return "border-green-200 bg-green-50 text-green-700";

      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  }

  /* =====================================================
     LOADING
  ====================================================== */

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f7f7f5]">
        <div className="text-center">

          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

          <p className="mt-4 text-sm text-gray-500">
            Loading messages...
          </p>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9a7a45]">
              Customer Support
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Messages
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Review customer questions and support requests.
            </p>

          </div>

          <Link
            href="/admin"
            className="w-fit rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-gray-400 hover:text-black"
          >
            Back to Dashboard
          </Link>

        </div>

        {/* STATS */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Total
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {messages.length}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              New
            </p>

            <p className="mt-3 text-3xl font-semibold text-amber-700">
              {newMessages}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              Read
            </p>

            <p className="mt-3 text-3xl font-semibold text-blue-700">
              {readMessages}
            </p>
          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-green-700">
              Replied
            </p>

            <p className="mt-3 text-3xl font-semibold text-green-700">
              {repliedMessages}
            </p>
          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* EMPTY */}

        {messages.length === 0 ? (

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">

            <h2 className="text-lg font-semibold">
              No messages yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Customer messages will appear here.
            </p>

          </div>

        ) : (

          /* MESSAGE LIST */

          <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">

            <div className="border-b border-gray-100 px-6 py-5">

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400">
                Inbox
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Customer Messages
              </h2>

            </div>

            <div className="divide-y divide-gray-100">

              {messages.map(
                (message) => (

                  <Link
                    key={message._id}
                    href={`/admin/messages/${message._id}`}
                    className={`group block px-6 py-5 transition ${
                      message.status === "New"
                        ? "bg-[#fffaf0] hover:bg-[#f8efd9]"
                        : "hover:bg-gray-50"
                    }`}
                  >

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex min-w-0 items-start gap-4">

                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
                            message.status === "New"
                              ? "bg-[#d5b36a] text-[#241b12]"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {message.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <p
                              className={`truncate text-sm ${
                                message.status === "New"
                                  ? "font-semibold text-gray-950"
                                  : "font-medium text-gray-900"
                              }`}
                            >
                              {message.name}
                            </p>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(
                                message.status
                              )}`}
                            >
                              {message.status}
                            </span>

                          </div>

                          <p className="mt-1 truncate text-sm font-medium text-[#8e6d39]">
                            {message.subject}
                          </p>

                          <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-gray-500">
                            {message.message}
                          </p>

                        </div>

                      </div>

                      <div className="flex shrink-0 items-center gap-4">

                        <div className="text-right">

                          <p className="text-xs text-gray-400">
                            {new Date(
                              message.createdAt
                            ).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>

                          <p className="mt-1 text-[11px] text-gray-400">
                            {new Date(
                              message.createdAt
                            ).toLocaleTimeString(
                              "en-GB",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>

                        </div>

                        <span className="text-lg text-gray-300 transition duration-300 group-hover:translate-x-1 group-hover:text-[#9a7a45]">
                          →
                        </span>

                      </div>

                    </div>

                  </Link>

                )
              )}

            </div>

          </section>

        )}

      </div>

    </main>
  );
}
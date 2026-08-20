"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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
  updatedAt?: string;
};

const statuses: MessageStatus[] = [
  "New",
  "Read",
  "Replied",
];

export default function AdminMessageDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id =
    typeof params.id === "string"
      ? params.id
      : "";

  const [message, setMessage] =
    useState<ContactMessage | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updating, setUpdating] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  useEffect(() => {
    async function loadMessage() {
      if (!id) {
        setError("Message ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/admin/messages/${id}`,
          {
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load message."
          );
        }

        setMessage(data.message);

        if (
          data.message?.status === "New"
        ) {
          const readResponse =
            await fetch(
              `/api/admin/messages/${id}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  status: "Read",
                }),
              }
            );

          const readData =
            await readResponse.json();

          if (
            readResponse.ok &&
            readData.message
          ) {
            setMessage(
              readData.message
            );
          }
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load message."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMessage();
  }, [id]);

  async function updateStatus(
    status: MessageStatus
  ) {
    if (!message) return;

    try {
      setUpdating(true);
      setError("");

      const response = await fetch(
        `/api/admin/messages/${message._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update status."
        );
      }

      setMessage(data.message);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update status."
      );
    } finally {
      setUpdating(false);
    }
  }

  async function deleteMessage() {
    if (!message) return;

    const confirmed =
      window.confirm(
        "Delete this customer message? This cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `/api/admin/messages/${message._id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete message."
        );
      }

      router.push(
        "/admin/messages"
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete message."
      );

      setDeleting(false);
    }
  }

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

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f7f7f5]">
        <div className="text-center">

          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

          <p className="mt-4 text-sm text-gray-500">
            Loading message...
          </p>

        </div>
      </main>
    );
  }

  if (error || !message) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] px-4 py-10 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-3xl">

          <Link
            href="/admin/messages"
            className="text-sm font-medium text-gray-500 transition hover:text-black"
          >
            ← Back to Messages
          </Link>

          <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-6">

            <h1 className="font-semibold text-red-700">
              Unable to load message
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error ||
                "Message not found."}
            </p>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        {/* TOP */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

          <div>

            <Link
              href="/admin/messages"
              className="text-sm font-medium text-gray-500 transition hover:text-black"
            >
              ← Back to Messages
            </Link>

            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9a7a45]">
              Customer Message
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
              {message.subject}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Received{" "}
              {new Date(
                message.createdAt
              ).toLocaleString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </p>

          </div>

          <span
            className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
              message.status
            )}`}
          >
            {message.status}
          </span>

        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* MAIN GRID */}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">

          {/* MESSAGE */}

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
              Message
            </p>

            <p className="mt-5 whitespace-pre-wrap text-[15px] leading-8 text-gray-700">
              {message.message}
            </p>

          </section>

          {/* CUSTOMER */}

          <aside className="space-y-6">

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                Customer
              </p>

              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                {message.name}
              </h2>

              <div className="mt-5 space-y-4">

                <div>

                  <p className="text-xs text-gray-400">
                    Email
                  </p>

                  <a
                    href={`mailto:${message.email}`}
                    className="mt-1 block break-all text-sm font-medium text-gray-800 transition hover:text-[#9a7a45]"
                  >
                    {message.email}
                  </a>

                </div>

                {message.phone && (
                  <div>

                    <p className="text-xs text-gray-400">
                      Phone
                    </p>

                    <a
                      href={`tel:${message.phone}`}
                      className="mt-1 block text-sm font-medium text-gray-800 transition hover:text-[#9a7a45]"
                    >
                      {message.phone}
                    </a>

                  </div>
                )}

              </div>

            </section>

            {/* STATUS */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                Message Status
              </p>

              <div className="mt-4 grid gap-2">

                {statuses.map(
                  (status) => (

                  <button
                    key={status}
                    type="button"
                    disabled={updating}
                    onClick={() =>
                      updateStatus(
                        status
                      )
                    }
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      message.status ===
                      status
                        ? getStatusStyle(
                            status
                          )
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-black"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {status}
                  </button>

                ))}

              </div>

            </section>

            {/* QUICK ACTIONS */}

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                Quick Actions
              </p>

              <div className="mt-4 grid gap-3">

                <a
                  href={`mailto:${message.email}?subject=${encodeURIComponent(
                    `Re: ${message.subject}`
                  )}`}
                  className="rounded-xl bg-black px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Reply by Email
                </a>

                {message.phone && (
                  <a
                    href={`tel:${message.phone}`}
                    className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:text-black"
                  >
                    Call Customer
                  </a>
                )}

              </div>

            </section>

            {/* DELETE */}

            <button
              type="button"
              onClick={deleteMessage}
              disabled={deleting}
              className="w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting
                ? "Deleting..."
                : "Delete Message"}
            </button>

          </aside>

        </div>

      </div>

    </main>
  );
}
"use client";

import {
  FormEvent,
  useState,
} from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(
        "/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.message ||
            "Unable to send your message."
        );

        return;
      }

      setSuccessMessage(
        data.message ||
          "Your message has been sent successfully."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch {
      setErrorMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-[#f7f1e6] text-[#241b12]">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#ead6ae] px-6 py-20 sm:py-24 lg:px-8">

        <div className="absolute inset-0 bg-gradient-to-r from-[#f1dfbd] via-[#e3c78f] to-[#c49a53]" />

        <div className="relative mx-auto max-w-7xl">

          <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">

            <div className="max-w-3xl">

              <div className="flex items-center gap-3">

                <span className="h-px w-10 bg-[#7c5b2a]/60" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#6e5127]">
                  Contact
                </p>

              </div>

              <h1 className="mt-5 text-4xl font-medium leading-[1.08] tracking-[-0.03em] text-[#241b12] sm:text-5xl lg:text-6xl">
                Have a question?

                <span className="block text-[#fffaf0]">
                  We’d be happy to help.
                </span>

              </h1>

            </div>

            <div className="max-w-xl lg:justify-self-end">

              <p className="text-sm leading-7 text-[#4e3a21] sm:text-base sm:leading-8">
                Whether you are choosing a piece, checking on an order,
                or need a little more information before you decide,
                you can reach out to us directly.
              </p>

              <p className="mt-4 text-sm leading-7 text-[#4e3a21]/85 sm:text-base sm:leading-8">
                We aim to keep every conversation clear, personal, and
                helpful from the first question through to delivery.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CONTACT
      ====================================================== */}

      <section className="px-6 py-20 lg:px-8">

        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">

          {/* LEFT */}

          <div className="rounded-[28px] bg-[#20160f] p-8 text-white sm:p-10">

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d3b36c]">
              Get in Touch
            </p>

            <h2 className="mt-4 text-3xl font-medium leading-tight">
              A more personal way to shop.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/60">
              If you need help choosing jewelry, checking an order,
              or understanding a product, reach out and we’ll be happy
              to assist.
            </p>

            <div className="mt-10 space-y-6">

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c9a85f]">
                  Email
                </p>

                <p className="mt-2 text-sm text-white/80">
                  contact@bejeweled.com
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c9a85f]">
                  Phone
                </p>

                <p className="mt-2 text-sm text-white/80">
                  +977 9749397472
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c9a85f]">
                  Location
                </p>

                <p className="mt-2 text-sm text-white/80">
                  Butwal, Nepal
                </p>
              </div>

            </div>

          </div>

          {/* FORM */}

          <div className="rounded-[28px] border border-[#c9a15c]/25 bg-white p-8 shadow-[0_16px_40px_rgba(82,57,24,0.06)] sm:p-10">

            <div className="mb-8">

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9a7841]">
                Send a Message
              </p>

              <h2 className="mt-3 text-2xl font-medium sm:text-3xl">
                How can we help?
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Fill in the form below and we’ll get back to you as soon as possible.
              </p>

            </div>

            {successMessage && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                ✓ {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {errorMessage}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 sm:grid-cols-2"
            >

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Name
                </label>

                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                  placeholder="Your name"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#b9975b]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Email
                </label>

                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      email: event.target.value,
                    })
                  }
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#b9975b]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Phone
                </label>

                <input
                  value={form.phone}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      phone: event.target.value,
                    })
                  }
                  placeholder="98XXXXXXXX"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#b9975b]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Subject
                </label>

                <select
                  required
                  value={form.subject}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      subject: event.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#b9975b]"
                >
                  <option value="">
                    Select a subject
                  </option>

                  <option value="Product Inquiry">
                    Product Inquiry
                  </option>

                  <option value="Order Support">
                    Order Support
                  </option>

                  <option value="Delivery Question">
                    Delivery Question
                  </option>

                  <option value="General Inquiry">
                    General Inquiry
                  </option>
                </select>
              </div>

              <div className="sm:col-span-2">

                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Message
                </label>

                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      message: event.target.value,
                    })
                  }
                  placeholder="Tell us how we can help..."
                  className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#b9975b]"
                />

              </div>

              <div className="sm:col-span-2">

                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#21160f] px-6 py-3.5 text-sm font-semibold text-white transition duration-300 hover:bg-[#a47c3f] disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-auto"
                >
                  {submitting
                    ? "Sending..."
                    : "Send Message"}

                  {!submitting && (
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>

      </section>

    </main>
  );
}
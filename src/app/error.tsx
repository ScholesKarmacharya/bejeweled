"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f4ec] px-4">
      <div className="max-w-lg text-center">

        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9a7a45]">
          Bejeweled
        </p>

        <h1 className="mt-4 text-3xl font-semibold text-[#211d18]">
          Something went wrong
        </h1>

        <p className="mt-4 text-sm leading-7 text-gray-500">
          We could not load this page correctly. Please try again.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-[#211d18] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#9a7a45]"
          >
            Try Again
          </button>

          <a
            href="/"
            className="rounded-full border border-[#c9b07a]/40 bg-white px-7 py-3 text-sm font-semibold text-[#6f5a35] transition hover:border-[#9a7a45] hover:text-[#9a7a45]"
          >
            Back to Home
          </a>

        </div>

      </div>
    </main>
  );
}
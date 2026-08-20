import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f4ec] px-4">

      <div className="max-w-xl text-center">

        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9a7a45]">
          Bejeweled
        </p>

        <h1 className="mt-5 text-7xl font-semibold text-[#211d18] sm:text-8xl">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold text-[#211d18]">
          Page not found
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-500">
          The page you are looking for may have been moved,
          removed, or does not exist.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

          <Link
            href="/"
            className="rounded-full bg-[#211d18] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#9a7a45]"
          >
            Back to Home
          </Link>

          <Link
            href="/products"
            className="rounded-full border border-[#c9b07a]/40 bg-white px-7 py-3.5 text-sm font-semibold text-[#6f5a35] transition hover:border-[#9a7a45] hover:text-[#9a7a45]"
          >
            Browse Collection
          </Link>

        </div>

      </div>

    </main>
  );
}
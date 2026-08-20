import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="bg-[#f5eddf] text-[#241b12]">

     {/* =====================================================
    ABOUT HERO
====================================================== */}

<section className="relative overflow-hidden bg-[#d8b56c] px-6 py-24 sm:py-28 lg:px-8">

  {/* Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#f4dfb4] via-[#d8b56c] to-[#b78a43]" />

  {/* Subtle Decorative Glow */}
  <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />

  <div className="relative mx-auto max-w-7xl">

    <div className="max-w-4xl">

      <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#65491f]">
        About Bejeweled
      </p>

      <h1 className="mt-5 max-w-3xl text-4xl font-medium leading-[1.08] tracking-[-0.03em] text-[#241b12] sm:text-5xl lg:text-6xl">
        Jewelry that celebrates
        <span className="block text-[#fff8eb]">
          tradition, beauty & you.
        </span>
      </h1>

      <div className="mt-7 h-px w-16 bg-[#725323]/50" />

      <p className="mt-7 max-w-2xl text-[15px] leading-7 text-[#49351d] sm:text-base sm:leading-8">
        At Bejeweled, we believe jewelry carries more than beauty.
        It becomes part of the moments we celebrate, the traditions
        we carry forward, and the memories we create along the way.
        Our collection of original brass and gold plated jewelry is
        thoughtfully selected to bring together timeless character,
        intricate detail, and an elegance that feels distinctly yours.
      </p>

      <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#49351d]/90 sm:text-base sm:leading-8">
        From pieces made for meaningful occasions to jewelry that
        adds something special to everyday moments, Bejeweled is
        about finding designs you will reach for, remember, and make
        part of your own story.
      </p>

    </div>

  </div>

</section>





{/* =====================================================
    BRAND STORY / OUR APPROACH
====================================================== */}

<section className="bg-[#f8f3e9] px-6 py-20 sm:py-24 lg:px-8">
  <div className="mx-auto max-w-7xl">

    {/* Section Heading */}
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#9b7840]">
        Our Approach
      </p>

      <h2 className="mt-4 text-3xl font-medium leading-tight tracking-[-0.02em] text-[#241b12] sm:text-4xl lg:text-5xl">
        Jewelry made to feel special,
        <br className="hidden sm:block" />
        every time you wear it.
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#6f6253] sm:text-base">
        At Bejeweled, we believe beautiful jewelry is more than
        something you wear. It becomes part of celebrations,
        traditions, memories, and the everyday moments that stay
        with you.
      </p>
    </div>


    {/* First Story */}
    <div className="mt-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

      {/* Image 1 */}
      <div className="overflow-hidden rounded-[28px] bg-[#21120d]">
        <img
          src="/edit.png"
          alt="Bejeweled traditional gold plated jewelry collection"
          className="block h-auto w-full transition duration-700 hover:scale-[1.02]"
        />
      </div>


      {/* Text 1 */}
      <div className="lg:pr-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a27d42]">
          Elegance in Every Detail
        </p>

        <h3 className="mt-4 text-2xl font-medium leading-tight text-[#241b12] sm:text-3xl">
          Designed with tradition,
          <br />
          styled for today.
        </h3>

        <p className="mt-5 text-sm leading-7 text-[#6f6253] sm:text-base">
          Our collection brings together the richness of traditional
          jewelry with an elegant finish made for modern wardrobes.
          From statement necklaces and detailed bangles to earrings
          that complete the look, every piece is selected to create a
          beautiful balance between heritage and contemporary style.
        </p>

        <p className="mt-4 text-sm leading-7 text-[#6f6253] sm:text-base">
          We focus on designs that feel luxurious without becoming
          difficult to wear. Whether you are dressing for a wedding,
          celebration, festival, or simply adding something special
          to your outfit, Bejeweled offers pieces made to stand out
          naturally.
        </p>
      </div>

    </div>


    {/* Second Story */}
    <div className="mt-20 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

      {/* Text 2 */}
      <div className="order-2 lg:order-1 lg:pl-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a27d42]">
          The Bejeweled Collection
        </p>

        <h3 className="mt-4 text-2xl font-medium leading-tight text-[#241b12] sm:text-3xl">
          Pieces chosen to become
          <br />
          part of your moments.
        </h3>

        <p className="mt-5 text-sm leading-7 text-[#6f6253] sm:text-base">
          The smallest details can completely change how jewelry
          looks and feels. That is why we pay attention to proportion,
          texture, finishing, and the way each design comes together
          as a complete piece.
        </p>

        <p className="mt-4 text-sm leading-7 text-[#6f6253] sm:text-base">
          Our brass and gold plated jewelry is selected with both
          beauty and versatility in mind. Some pieces are designed to
          become the centre of an occasion, while others bring a
          subtle touch of elegance to your everyday style.
        </p>

        <p className="mt-4 text-sm leading-7 text-[#6f6253] sm:text-base">
          Whatever the occasion, our goal is simple: to help you find
          jewelry that feels personal, memorable, and unmistakably
          yours.
        </p>

        <Link
          href="/products"
          className="group mt-7 inline-flex items-center gap-3 text-sm font-semibold text-[#6f5228] transition hover:text-[#b18442]"
        >
          Explore the Collection

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>


      {/* Image 2 */}
      <div className="order-1 overflow-hidden rounded-[28px] bg-[#21120d] lg:order-2">
        <img
          src="/banner.png"
          alt="Bejeweled jewelry craftsmanship and collection"
          className="block h-auto w-full transition duration-700 hover:scale-[1.02]"
        />
      </div>

    </div>


    {/* Bottom Brand Statement */}
    <div className="mx-auto mt-20 max-w-3xl border-t border-[#c9b58f]/50 pt-12 text-center">
      <p className="text-xl font-medium leading-8 text-[#34271b] sm:text-2xl sm:leading-9">
        “Jewelry is not only about completing an outfit.
        It is about making the moment feel complete.”
      </p>

      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9b7840]">
        Bejeweled
      </p>
    </div>

  </div>
</section>



      {/* =====================================================
          VALUES
      ====================================================== */}

      <section className="border-y border-[#c9a15c]/25 bg-[#ead7b3] px-6 py-20 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="mb-10 max-w-xl">

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8f6b35]">
              What We Value
            </p>

            <h2 className="mt-3 text-3xl font-medium tracking-[-0.02em] text-[#241b12]">
              Simple standards behind every piece.
            </h2>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl border border-[#b98f49]/25 bg-[#fff9ef]/75 p-6 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_14px_30px_rgba(111,79,32,0.08)]">

              <p className="text-xs font-semibold text-[#9a7339]">
                01
              </p>

              <h3 className="mt-4 text-lg font-medium text-[#241b12]">
                Refined Selection
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#66533a]">
                Pieces chosen with attention to proportion, finish, and
                long-term visual appeal.
              </p>

            </div>

            <div className="rounded-2xl border border-[#b98f49]/25 bg-[#fff9ef]/75 p-6 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_14px_30px_rgba(111,79,32,0.08)]">

              <p className="text-xs font-semibold text-[#9a7339]">
                02
              </p>

              <h3 className="mt-4 text-lg font-medium text-[#241b12]">
                Everyday Elegance
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#66533a]">
                Jewelry that feels special enough for occasions and easy
                enough to become part of daily life.
              </p>

            </div>

            <div className="rounded-2xl border border-[#b98f49]/25 bg-[#fff9ef]/75 p-6 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_14px_30px_rgba(111,79,32,0.08)]">

              <p className="text-xs font-semibold text-[#9a7339]">
                03
              </p>

              <h3 className="mt-4 text-lg font-medium text-[#241b12]">
                Personal Care
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#66533a]">
                Every order is reviewed carefully before it moves into
                preparation and delivery.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          BRAND STATEMENT
      ====================================================== */}

      <section className="px-6 py-24 lg:px-8">

        <div className="mx-auto max-w-5xl rounded-[30px] border border-[#c9a15c]/25 bg-[#2a1c10] px-8 py-14 text-center shadow-[0_18px_45px_rgba(61,40,15,0.12)] sm:px-12">

          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#d5b46d]">
            The Bejeweled Standard
          </p>

          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-medium leading-tight tracking-[-0.025em] text-white sm:text-4xl lg:text-5xl">
            Jewelry that becomes part of your story.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
            From subtle everyday pieces to designs chosen for meaningful
            occasions, Bejeweled is about jewelry that feels considered,
            personal, and lasting.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-[#d7b66e] px-7 py-3.5 text-sm font-semibold text-[#241b12] transition duration-300 hover:-translate-y-0.5 hover:bg-[#edd39b]"
            >
              Explore Collection
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-[#d7b66e]/45 px-7 py-3.5 text-sm font-semibold text-[#e8cc91] transition duration-300 hover:border-[#d7b66e] hover:bg-[#d7b66e] hover:text-[#241b12]"
            >
              Contact Us
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}
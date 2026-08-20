"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  featured: boolean;
};

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${id}`);

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        setProduct(data.product);
      } catch (error) {
        console.error(error);
        setError("Unable to load product.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Product not found</h1>

          <p className="mt-2 text-gray-500">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
        
        {/* Product Image */}
        <div className="overflow-hidden rounded-3xl bg-white">
          <img
            src={product.image}
            alt={product.name}
            className="h-full max-h-[600px] w-full object-cover"
          />
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-center">
          <p className="text-sm uppercase tracking-widest text-gray-500">
            {product.category}
          </p>

          <h1 className="mt-3 text-4xl font-bold text-gray-900">
            {product.name}
          </h1>

          <p className="mt-6 text-2xl font-semibold">
            Rs. {product.price.toLocaleString()}
          </p>

          <p className="mt-6 leading-7 text-gray-600">
            {product.description}
          </p>

          <div className="mt-6">
            {product.stock > 0 ? (
              <p className="text-sm text-green-600">
                {product.stock} available in stock
              </p>
            ) : (
              <p className="text-sm text-red-500">
                Out of stock
              </p>
            )}
          </div>

          <button
            disabled={product.stock === 0}
            className="mt-8 w-full rounded-xl bg-black px-6 py-4 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </main>
  );
}
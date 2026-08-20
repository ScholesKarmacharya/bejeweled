"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  featured: boolean;
  createdAt?: string;
};

type ProductForm = {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  stock: string;
  featured: boolean;
};

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  stock: "",
  featured: false,
};

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [form, setForm] =
    useState<ProductForm>(emptyForm);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* =========================================================
     LOAD PRODUCTS
  ========================================================= */

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/products", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load products."
        );
      }

      setProducts(
        Array.isArray(data.products)
          ? data.products
          : []
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  /* =========================================================
     CATEGORIES
  ========================================================= */

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(
          products
            .map((product) => product.category)
            .filter(Boolean)
        )
      ),
    ];
  }, [products]);

  /* =========================================================
     FILTER PRODUCTS
  ========================================================= */

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const value = search.trim().toLowerCase();

      const matchesSearch =
        !value ||
        product.name.toLowerCase().includes(value) ||
        product.category.toLowerCase().includes(value);

      const matchesCategory =
        categoryFilter === "All" ||
        product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  /* =========================================================
     ADD / EDIT
  ========================================================= */

  function openAddProduct() {
    setEditingProduct(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
    setShowForm(true);
  }

  function openEditProduct(product: Product) {
    setEditingProduct(product);

    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      stock: product.stock.toString(),
      featured: product.featured,
    });

    setError("");
    setMessage("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingProduct(null);
    setForm(emptyForm);
  }

  /* =========================================================
     IMAGE PICKER
  ========================================================= */

  function handleImageFile(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setForm((current) => ({
          ...current,
          image: reader.result as string,
        }));
      }
    };

    reader.readAsDataURL(file);
  }

  /* =========================================================
     SAVE PRODUCT
  ========================================================= */

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");
    setMessage("");

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.category.trim() ||
      !form.image.trim()
    ) {
      setError("Please complete all product fields.");
      return;
    }

    if (Number.isNaN(price) || price < 0) {
      setError("Please enter a valid product price.");
      return;
    }

    if (Number.isNaN(stock) || stock < 0) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    try {
      setSaving(true);

      const url = editingProduct
        ? `/api/products/${editingProduct._id}`
        : "/api/products";

      const method = editingProduct
        ? "PATCH"
        : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          price,
          category: form.category.trim(),
          image: form.image.trim(),
          stock,
          featured: form.featured,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save product."
        );
      }

      setMessage(
        editingProduct
          ? "Product updated successfully."
          : "Product created successfully."
      );

      closeForm();
      await loadProducts();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     DELETE
  ========================================================= */

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `/api/products/${product._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete product."
        );
      }

      setMessage("Product deleted successfully.");

      setProducts((current) =>
        current.filter(
          (item) => item._id !== product._id
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete product."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f6f4] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gray-400">
              Catalog Management
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
              Products
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Manage your Bejeweled product catalog,
              pricing, stock, and featured items.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddProduct}
            className="inline-flex items-center justify-center rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-md"
          >
            + Add Product
          </button>
        </div>

        {/* MESSAGE */}

        {message && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* STATS */}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Products
            </p>

            <p className="mt-3 text-3xl font-semibold text-gray-950">
              {products.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Featured
            </p>

            <p className="mt-3 text-3xl font-semibold text-gray-950">
              {
                products.filter(
                  (product) => product.featured
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Low Stock
            </p>

            <p className="mt-3 text-3xl font-semibold text-amber-600">
              {
                products.filter(
                  (product) => product.stock <= 5
                ).length
              }
            </p>
          </div>
        </div>

        {/* SEARCH */}

        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row">
          <div className="flex-1">
            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by product name or category..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-gray-400 focus:bg-white"
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="mt-8 flex min-h-[320px] items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

              <p className="mt-4 text-sm text-gray-500">
                Loading products...
              </p>
            </div>
          </div>
        )}

        {/* PRODUCTS */}

        {!loading &&
          filteredProducts.length > 0 && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

              {/* DESKTOP */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead className="border-b border-gray-200 bg-[#fafafa]">
                    <tr>
                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Product
                      </th>

                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Category
                      </th>

                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Price
                      </th>

                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Stock
                      </th>

                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Featured
                      </th>

                      <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => (
                      <tr
                        key={product._id}
                        className="group transition duration-200 hover:bg-gray-50"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-sm">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold text-gray-950">
                                {product.name}
                              </p>

                              <p className="mt-1 max-w-xs truncate text-xs leading-5 text-gray-500">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                            {product.category}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm font-semibold text-gray-950">
                          Rs.{" "}
                          {product.price.toLocaleString()}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`text-sm font-semibold ${
                              product.stock <= 5
                                ? "text-amber-600"
                                : "text-gray-700"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          {product.featured ? (
                            <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                              Featured
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-gray-400">
                              Standard
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openEditProduct(product)
                              }
                              className="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 hover:text-black"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deleteProduct(product)
                              }
                              className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}

              <div className="divide-y divide-gray-100 md:hidden">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="p-5 transition hover:bg-gray-50"
                  >
                    <div className="flex gap-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-950">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {product.category}
                        </p>

                        <p className="mt-2 text-sm font-semibold text-gray-950">
                          Rs.{" "}
                          {product.price.toLocaleString()}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Stock: {product.stock}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                      <span
                        className={
                          product.featured
                            ? "text-xs font-semibold text-green-700"
                            : "text-xs text-gray-400"
                        }
                      >
                        {product.featured
                          ? "Featured"
                          : "Standard"}
                      </span>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditProduct(product)
                          }
                          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteProduct(product)
                          }
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        {/* EMPTY */}

        {!loading &&
          filteredProducts.length === 0 && (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-500">
                +
              </div>

              <h2 className="mt-4 font-semibold text-gray-950">
                No products found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Add a new product or change your search filters.
              </p>

              <button
                type="button"
                onClick={openAddProduct}
                className="mt-6 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Add Product
              </button>
            </div>
          )}
      </div>

      {/* =====================================================
          MODAL
      ====================================================== */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gray-200 bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400">
                  Product Management
                </p>

                <h2 className="mt-1 text-xl font-semibold text-gray-950">
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-lg text-gray-500 transition hover:bg-gray-100 hover:text-black"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">

                {/* NAME */}

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Product Name
                  </label>

                  <input
                    value={form.name}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        name: event.target.value,
                      })
                    }
                    placeholder="Elegant Diamond Ring"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                  />
                </div>

                {/* CATEGORY */}

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Category
                  </label>

                  <input
                    value={form.category}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        category: event.target.value,
                      })
                    }
                    placeholder="Ring"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                  />
                </div>

                {/* PRICE */}

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        price: event.target.value,
                      })
                    }
                    placeholder="25000"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                  />
                </div>

                {/* STOCK */}

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        stock: event.target.value,
                      })
                    }
                    placeholder="10"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                  />
                </div>

                {/* FEATURED */}

                <div className="flex items-end">
                  <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          featured: event.target.checked,
                        })
                      }
                      className="h-4 w-4 accent-black"
                    />

                    Featured Product
                  </label>
                </div>

                {/* IMAGE */}

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Product Image
                  </label>

                  <div className="mt-2 grid gap-4 sm:grid-cols-[150px_1fr]">
                    <div className="flex h-36 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gray-50">
                      {form.image ? (
                        <img
                          src={form.image}
                          alt="Product preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="px-4 text-center">
                          <p className="text-xs font-medium text-gray-500">
                            No image selected
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageFile}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 hover:text-black"
                      >
                        Choose Image
                      </button>

                      <p className="mt-2 text-xs leading-5 text-gray-400">
                        You can select an image from your device.
                      </p>

                      <div className="my-3 flex items-center gap-3">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-[10px] uppercase tracking-wider text-gray-400">
                          or
                        </span>
                        <div className="h-px flex-1 bg-gray-200" />
                      </div>

                      <input
                        value={form.image}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            image: event.target.value,
                          })
                        }
                        placeholder="/products/ring.jpg or image URL"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION */}

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Description
                  </label>

                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        description: event.target.value,
                      })
                    }
                    placeholder="Describe the product..."
                    className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                  />
                </div>
              </div>

              {/* ACTIONS */}

              <div className="mt-7 flex justify-end gap-3 border-t border-gray-100 pt-6">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 hover:text-black"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-gray-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                    ? "Save Changes"
                    : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
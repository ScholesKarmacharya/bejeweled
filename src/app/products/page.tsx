import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

import ProductsClient from "./ProductsClient";

export const revalidate = 60;

export type ProductItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  featured: boolean;
};

async function getProducts(): Promise<
  ProductItem[]
> {
  try {
    await connectDB();

    const products =
      await Product.find()
        .select(
          "_id name description price category image stock featured"
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    return products.map(
      (product) => ({
        _id: String(
          product._id
        ),

        name:
          product.name ?? "",

        description:
          product.description ??
          "",

        price:
          Number(
            product.price ?? 0
          ),

        category:
          product.category ??
          "",

        image:
          product.image ?? "",

        stock:
          Number(
            product.stock ?? 0
          ),

        featured:
          Boolean(
            product.featured
          ),
      })
    );
  } catch (error) {
    console.error(
      "Products page database error:",
      error
    );

    return [];
  }
}

export default async function ProductsPage() {
  const products =
    await getProducts();

  return (
    <ProductsClient
      initialProducts={
        products
      }
    />
  );
}
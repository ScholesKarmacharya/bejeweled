import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function PATCH() {
  try {
    await connectDB();

    // Update product names
    const updates = [
      {
        oldName: "Elegant Gold Necklace",
        newName: "Elegant Necklace",
        newDescription:
          "A timeless necklace designed to add elegance to every occasion.",
      },
      
      {
        oldName: "Traditional Gold Bangles",
        newName: "Traditional Bangles",
        newDescription:
          "Beautiful traditional bangles with an elegant modern finish.",
      },
    ];

    const updatedProducts = [];

    for (const item of updates) {
      const product = await Product.findOneAndUpdate(
        { name: item.oldName },
        {
          name: item.newName,
          description: item.newDescription,
        },
        { new: true }
      );

      updatedProducts.push({
        oldName: item.oldName,
        newName: item.newName,
        updated: !!product,
      });
    }

    // Remove duplicate Diamond Necklace products
    const diamondNecklaces = await Product.find({
      name: "Diamond Necklace",
    }).sort({ createdAt: 1 });

    // Keep the oldest Diamond Necklace
    if (diamondNecklaces.length > 1) {
      const duplicateIds = diamondNecklaces
        .slice(1)
        .map((product) => product._id);

      await Product.deleteMany({
        _id: { $in: duplicateIds },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Products cleaned and updated successfully",
      updatedProducts,
      duplicateDiamondNecklacesRemoved:
        Math.max(diamondNecklaces.length - 1, 0),
    });
  } catch (error) {
    console.error("Product cleanup error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to clean products",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
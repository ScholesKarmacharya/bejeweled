import mongoose, {
  Schema,
  Document,
  Model,
} from "mongoose";

/* =========================================================
   TYPES
========================================================= */

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type PaymentStatus =
  | "Pending"
  | "Verified"
  | "Rejected";

/* =========================================================
   ORDER INTERFACE
========================================================= */

export interface IOrder
  extends Document {
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
  };

  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];

  total: number;

  paymentMethod: "Fonepay";

  /*
   * Reference / transaction ID
   * entered by customer after
   * completing Fonepay payment.
   */
  paymentReference: string;

  paymentStatus: PaymentStatus;

  status: OrderStatus;

  createdAt: Date;
  updatedAt: Date;
}

/* =========================================================
   ORDER ITEM SCHEMA
========================================================= */

const OrderItemSchema =
  new Schema(
    {
      productId: {
        type: String,
        required: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      price: {
        type: Number,
        required: true,
        min: 0,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },

      image: {
        type: String,
        required: true,
      },
    },
    {
      _id: false,
    }
  );

/* =========================================================
   ORDER SCHEMA
========================================================= */

const OrderSchema =
  new Schema<IOrder>(
    {
      /* ===================================================
         CUSTOMER
      =================================================== */

      customer: {
        fullName: {
          type: String,
          required: true,
          trim: true,
        },

        email: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },

        phone: {
          type: String,
          required: true,
          trim: true,
        },

        address: {
          type: String,
          required: true,
          trim: true,
        },

        city: {
          type: String,
          required: true,
          trim: true,
        },

        postalCode: {
          type: String,
          trim: true,
        },
      },

      /* ===================================================
         ITEMS
      =================================================== */

      items: {
        type: [OrderItemSchema],
        required: true,

        validate: {
          validator: (
            items: unknown[]
          ) =>
            Array.isArray(
              items
            ) &&
            items.length > 0,

          message:
            "Order must contain at least one product",
        },
      },

      /* ===================================================
         TOTAL
      =================================================== */

      total: {
        type: Number,
        required: true,
        min: 0,
      },

      /* ===================================================
         PAYMENT METHOD
      =================================================== */

      paymentMethod: {
        type: String,

        required: true,

        enum: [
          "Fonepay",
        ],

        default:
          "Fonepay",
      },

      /* ===================================================
         PAYMENT REFERENCE
      =================================================== */

      paymentReference: {
        type: String,

        required: true,

        trim: true,

        minlength: [
          3,
          "Payment reference is too short",
        ],

        maxlength: [
          100,
          "Payment reference is too long",
        ],
      },

      /* ===================================================
         PAYMENT STATUS
      =================================================== */

      paymentStatus: {
        type: String,

        required: true,

        enum: [
          "Pending",
          "Verified",
          "Rejected",
        ],

        default:
          "Pending",
      },

      /* ===================================================
         ORDER STATUS
      =================================================== */

      status: {
        type: String,

        required: true,

        enum: [
          "Pending",
          "Confirmed",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
        ],

        default:
          "Pending",
      },
    },
    {
      timestamps: true,
    }
  );

/* =========================================================
   INDEXES
========================================================= */

/*
 * Helps admin/search operations
 * involving payment references.
 */
OrderSchema.index({
  paymentReference: 1,
});

/* =========================================================
   MODEL
========================================================= */

const Order: Model<IOrder> =
  mongoose.models.Order ||
  mongoose.model<IOrder>(
    "Order",
    OrderSchema
  );

export default Order;
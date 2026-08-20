import mongoose, {
  Schema,
  model,
  models,
} from "mongoose";

const ContactMessageSchema =
  new Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 150,
      },

      phone: {
        type: String,
        trim: true,
        maxlength: 30,
        default: "",
      },

      subject: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120,
      },

      message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
      },

      status: {
        type: String,
        enum: [
          "New",
          "Read",
          "Replied",
        ],
        default: "New",
      },
    },
    {
      timestamps: true,
    }
  );

const ContactMessage =
  models.ContactMessage ||
  model(
    "ContactMessage",
    ContactMessageSchema
  );

export default ContactMessage;
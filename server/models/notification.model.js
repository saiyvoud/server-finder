import mongoose from "mongoose";

const notifSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    shop: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Shop",
    },
    image: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    body: {
      type: String,
      required: true,
      maxlength: 500,
    },
    for: {
      type: String,
      enum: ["admin", "user", "shop", "all"],
      default: "all",
      maxlength: 10,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const notifModel = mongoose.model("Notification", notifSchema);

export default notifModel;

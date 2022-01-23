import mongoose from "mongoose";

const reportSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    shop: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Shop",
      required: true,
    },
    order: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Order",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const reportModel = mongoose.model("Report", reportSchema);

export default reportModel;

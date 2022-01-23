import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
  {
    order: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Order",
      required: true,
    },
    payBy: {
      type: String,
      enum: ['cash', 'transfer'],
      require: true,
    },
    totalCost: {
      type: Number,
      required: true,
      min: 1000,
    },
    status: {
      type: String,
      enum:['paid', 'cancel'],
      default: "paid",
      maxlength: 20,
    },
  },
  { timestamps: true }
);

const invoiceSchema = mongoose.Schema(
  {
    order: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Order",
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
      min: 1000,
    },
    description:{
      type: String,
      default: "",
      maxlength: 200,
    },
    status: {
      type: String,
      enum:['payment','transferred', 'cash'],
      default: "payment",
      maxlength: 20,
    },
  },
  { timestamps: true }
);

const PaymentModel = mongoose.model("Payment", paymentSchema);
const InvoiceModel = mongoose.model("Invoice", invoiceSchema);

export { PaymentModel, InvoiceModel };

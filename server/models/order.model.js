import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    car: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Car",
    },
    shop: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Shop",
      required: true,
    },
    address: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Address",
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
      min: 1000
    },
    description: {
      type: String,
      default: "",
      maxlength: 500,
    },
    status: {
      type: String,
      enum:['order', 'going', 'paid', 'cancel'],
      default: "order",
      maxlength: 20,
    },
  },
  { timestamps: true }
);

// const orderSchema = mongoose.Schema(
//   {
//     user: {
//       type: mongoose.SchemaTypes.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     car: {
//       type: mongoose.SchemaTypes.ObjectId,
//       ref: "Car",
//       required: true,
//     },
//     shop: {
//       type: mongoose.SchemaTypes.ObjectId,
//       ref: "Shop",
//       required: true,
//     },
//     address: {
//       type: mongoose.SchemaTypes.ObjectId,
//       ref: "Address",
//       required: true,
//     },
//     service: {
//       type: mongoose.SchemaTypes.ObjectId,
//       ref: "Service",
//       required: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//       min: 1000
//     },
//     description: {
//       type: String,
//       default: "",
//       maxlength: 500,
//     },
//     status: {
//       type: String,
//       enum:['order', 'going', 'paid', 'cancel'],
//       default: "order",
//       maxlength: 20,
//     },
//   },
//   { timestamps: true }
// );

const orderDetailSchema = mongoose.Schema(
  {
    order: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Order",
      required: true,
    },
    service: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Service",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1000,
    },
    description: {
      type: String,
      default: "",
      maxlength: 20,
    },
    status: {
      type: String,
      enum:['order', 'goging','paid', 'cancel'],
      default: "order",
      maxlength: 20,
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Order", orderSchema);
const OrderDetailModel = mongoose.model("OrderDetail", orderDetailSchema);

export { OrderModel, OrderDetailModel };

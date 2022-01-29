import mongoose from "mongoose";
const Schema = mongoose.Schema;

const shopSchema = mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: 1,
    },
    bankAccount: {
      type: Schema.Types.ObjectId,
      ref: "BankAccount",
      required: true,
      unique: 1,
    },
    name: {
      type: String,
      required: true,
      maxlength: 200,
    },
    image: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      required: true,
      maxlength: 20,
    },
    address: {
      village: {
        type: String,
        maxlength: 200,
        required: true,
      },
      district: {
        type: String,
        maxlength: 200,
        required: true,
      },
      province: {
        type: String,
        maxlength: 200,
        required: true,
      },
      lat: Number,
      lng: Number,
    },
    openTime: {
      type: String,
      maxlength: 15,
    },
    closeTime: {
      type: String,
      maxlength: 15,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;

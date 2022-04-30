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
    },
    name: {
      type: String,
      required: true,
      maxlength: 200,
    },
    category: {
      type: String,
      enum: ["ລົດຈັກ", "ລົດໃຫຍ່", "car", "motorcycle", "motorbike"],
      maxlength: 20,
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
    locations: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: [Number],
      // required:true
    },
    openTime: {
      type: String,
      maxlength: 15,
      required: true,
    },
    closeTime: {
      type: String,
      maxlength: 15,
      required: true,
    },
    openDay: {
      type: String,
      maxlength: 30,
      required: true,
    },
    closeDay: {
      type: String,
      maxlength: 30,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

shopSchema.index({ locations: "2dsphere" })

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;

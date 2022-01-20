import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  village: {
    type: String,
    required: true,
    maxlength: 255,
  },
  district: {
    type: String,
    required: true,
    maxlength: 255,
  },
  province: {
    type: String,
    required: true,
    maxlength: 255,
  },
  lat: Number,
  lng: Number,
  isActive: {
    type: Boolean,
    default: 1,
  },
});

const Address = mongoose.model("Address", addressSchema);

export default Address;

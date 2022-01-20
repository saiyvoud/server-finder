import mongoose from "mongoose";

const carSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    type: {
      type: String,
      required: true,
      enum: ["ລົດຈັກ", "ລົດໃຫຍ່"],
      maxlength: 20,
    },
    brand: {
      type: String,
      required: true,
      maxlength: 50,
    },
    carNO: {
      type: String,
      required: true,
      maxlength: 10,
    },
    isDelete: { type: Boolean, default: 0 },
  },
  { timestamps: true }
);

const CarModel = mongoose.model("Car", carSchema);

export default CarModel;

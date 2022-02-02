import mongoose from "mongoose";

const bankSchema = mongoose.Schema(
  {
    bankName: {
      type: String,
      required: true,
      maxlength: 100,
    },
    accountId: {
      type: String,
      required: true,
      maxlength: 30,
      unique: 1,
    },
    accountName: {
      type: String,
      required: true,
      maxlength: 100,
    },
  },
  { timestamps: true }
);

const bankModel = mongoose.model("BankAccount", bankSchema);

export default bankModel;

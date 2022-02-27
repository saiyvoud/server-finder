import mongoose from "mongoose";

const updateSchema = mongoose.Schema({
  android_key: {
    type: String,
    default: "",
  },
  ios_key: {
    type: String,
    default: "",
  },
  version: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: 1,
  },
});

const updateModel = mongoose.model("Update", updateSchema);

export default updateModel;

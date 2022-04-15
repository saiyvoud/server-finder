import mongoose from "mongoose";

const menuSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["ລົດຈັກ", "ລົດໃຫຍ່", "car", "motorcycle", "motorbike"],
    maxlength: 20,
  },
 
  image:{
    type: String,
    default: ''
  },
  isDelete: {
    type: Boolean,
    default: 0,
  },
});

const menuModel = mongoose.model("Menu", menuSchema);

export default menuModel;

import mongoose from "mongoose";

const serviceSchema = mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  image: {
    type:String,
    default:''
  },
  name: {
    type: String,
    required: true,
    maxlength: 255,
  },
  category:{
    type:String,
    enum:['ລົດຈັກ', 'ລົດໃຫຍ່'],
    maxlength:20
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    default: "",
    maxlength: 300
  },
  isDelete:{
    type: Boolean,
    default: 0
  }
});

const Service = mongoose.model("Serivce", serviceSchema);

export default Service 

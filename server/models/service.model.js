import mongoose from "mongoose";

const serviceSchema = mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  tag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag",
    required: true,
  },
  // image: {
  //   type:String,
  //   default:''
  // },
  // name: {
  //   type: String,
  //   required: true,
  //   maxlength: 255,
  // },
  // category:{
  //   type:String,
  //   enum:['ລົດຈັກ', 'ລົດໃຫຍ່', 'car', 'motorcycle', 'motorbike'],
  //   maxlength:20
  // },
  price: {
    type: Number,
    required: true,
    min: 1000
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

const Service = mongoose.model("Service", serviceSchema);

export default Service 

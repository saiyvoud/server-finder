import mongoose from "mongoose";

const tagSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["ລົດຈັກ", "ລົດໃຫຍ່", "car", "motorcycle", "motorbike"],
    maxlength: 20,
  },
  tag_type:{
    type:String,
    enum:['ພາຍໃນ', 'ພາຍນອກ', 'inside', 'outside'],
    maxlength:20
  },
  image:{
    type: String,
    default: ''
  },
  icon:{
    type: String,
    default: ''
  },
  isDelete: {
    type: Boolean,
    default: 0,
  },
});

const tagModel = mongoose.model("Tag", tagSchema);

export default tagModel;

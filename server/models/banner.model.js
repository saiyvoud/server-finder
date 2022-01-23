import mongoose from "mongoose";

const bannerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
    image:{
        type: String,
        default: ''
    },
    isDelete: {
      type:Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const bannerModel = mongoose.model("Banner", bannerSchema);

export default bannerModel;

import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    shop: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Shop",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    star: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

const ReviewModel = mongoose.model("Review", reviewSchema);

export { ReviewModel };

import mongoose from "mongoose";
import { ReviewModel } from "../models/review.model.js";
export default class Review {
  static async getShopReview(req, res) {
    try {
      const shop_id = req.params._id;

      if (!mongoose.isValidObjectId(shop_id))
        res.status(400).json({ msg: "Something wrong" });

      const review = await ReviewModel.find({ shop: shop_id }).populate(
        "user",
        "firstname lastname"
      );
      res.status(200).json({ msg: "Get Shop Review", review });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async getUserReview(req, res) {
    try {
      const user_id = req.user._id;

      const review = await ReviewModel.find({
        user: user_id,
      }).populate("shop", "name title star");
      res.status(200).json({ msg: "Get User Review", review });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async addReview(req, res) {
    try {
      let { shop_id, star, title } = req.body;

      if (!title) {
        return res.status(400).json({ msg: "please input title." });
      }
      if (!star || star < 0) {
        return res.status(400).json({ msg: "please input star or less then 0." });
      }

      if (!mongoose.isValidObjectId(shop_id) || !shop_id) {
        return res.status(404).json({ msg: "Invalid shop ID" });
      }

      const data = { shop: shop_id, user: req.user._id, star, title };

      const review = await ReviewModel.create(data);

      res.status(201).json({ msg: "Add New Review", review });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  // static async updateReview(req, res) {
  //   try {
  //     const { review_id, title } = req.body;
  //     const user_id = req.user._id;

  //     if (!mongoose.isValidObjectId(review_id))
  //       res.status(400).json({ msg:'Something wrong' });

  //     const review = await ReviewModel.findOneAndUpdate(
  //       { _id: review_id, user: user_id },
  //       { title },
  //       { new: true }
  //     );
  //     res.status(201).json({ msg: "Update Review", review });
  //   } catch (err) {
  //     res.status(404).json({ msg: "Something wrong", err });
  //   }
  // }
}

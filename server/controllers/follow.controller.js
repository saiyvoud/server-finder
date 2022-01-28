import mongoose from "mongoose";

import FollowModel from "../models/follow.model.js";

export default class Follow {
  static async getFollowShop(req, res) {
    try {
      const shop_id = req.params._id;
      if (!shop_id) {
        return res.status(404).json({ msg: "shop_id can not be null." });
      }
      if (!mongoose.isValidObjectId(shop_id) || !shop_id) {
        return res.status(404).json({ msg: "Invalid ID" });
      }

      const follow = await FollowModel.find({ shop: shop_id }).populate(
        "user",
        "firstname lastname"
      );
      res.status(201).json({ msg: "all are following you shop now.", follow });
    } catch (err) {
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }
  static async getFollowUser(req, res) {
    try {
      if (!req.user) {
        return res.status(400).json({ msg: "Please Login!!!" });
      }

      const follow = await FollowModel.find({ user: req.user._id }).populate(
        "shop",
        "name address phone"
      );
      res.status(201).json({ msg: "all shop that you are following.", follow });
    } catch (err) {
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }

  static async followShop(req, res) {
    try {
      if (!req.user) {
        return res.status(400).json({ msg: "Please Login!!!" });
      }
      if (!req.params._id) {
        return res.status(404).json({ msg: "shop_id can not be null." });
      }
      const data = { user: req.user._id, shop: req.params._id };

      if (!mongoose.isValidObjectId(req.params._id) || !req.params._id)
        return res.status(400).json({ msg: `Invalid id: ${req.params._id}` });

      await FollowModel.create(data);
      res.status(200).json({ msg: `Followed the shop complete.` });
    } catch (err) {
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }
  static async unFollow(req, res) {
    try {
      if (!req.user) {
        return res.status(400).json({ msg: "Please Login!!!" });
      }

      await FollowModel.findOneAndDelete({ user: req.user._id });
      res.status(201).json({ msg: "unfollowed the shop." });
    } catch (err) {
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }
}

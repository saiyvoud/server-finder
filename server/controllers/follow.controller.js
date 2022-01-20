import mongoose from "mongoose";

import FollowModel from "../models/follow.model.js";

export default class Follow {
  static async getFollow(req, res) {
    try {
      if (!req.user) {
        return res.status(400).json({ msg: "Please Login!!!" });
      }

      const follow = await FollowModel.find({ user: req.user._id }).populate('shop','name address phone');
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

      const data = { user: req.user._id, shop: req.params._id };

      if (!mongoose.isValidObjectId(req.params._id))
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

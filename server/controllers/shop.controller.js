import mongoose from "mongoose";

import ShopModel from "../models/shop.model.js";
import BankModel from "../models/bankAccount.model.js";
import UploadImage from "../utils/uploadImage.js";
import { User } from "../models/user.model.js";

export default class Shop {
  static async AllShop(req, res) {
    try {
      const shop = await ShopModel.find({})
        .sort({ _id: -1 })
        .populate([
          { path: "user", select: "firstname lastname phone" },
          { path: "bankAccount" },
        ]);
      res.status(200).json({ msg: "Success", shop });
    } catch (err) {
      res.status(500).json({ msg: "Something went wrong", err });
    }
  }

  static async OwnShop(req, res) {
    try {
      const user_id = req.user._id;

      if (!mongoose.isValidObjectId(user_id))
        return res.status(400).json({ msg: `Invalid id: ${user_id}` });

      const shop = await ShopModel.findOne({ user: user_id }).populate(
        "bankAccount"
      );
      res.status(200).json({ msg: "Success", shop });
    } catch (err) {
      res.status(500).json({ msg: "Something went wrong", err });
    }
  }

  static async createShop(req, res) {
    try {
      let data = req.body;
      let user_id = req.user._id;
      const bank_data = data.bank;

      const imgUrl = await UploadImage(data.image);

      const bank = await BankModel.create(bank_data);

      if (req.user.auth === "admin") {
        if (!mongoose.isValidObjectId(data.user_id))
          return res.status(400).json({ msg: `Invalid id: ${data.user_id}` });
        user_id = data.user_id;
      }

      data = { ...data, user: user_id, bankAccount: bank._id, image: imgUrl };

      const shop = await ShopModel.create(data);

      await User.findByIdAndUpdate(
        user_id,
        { auth: "shopkeeper" },
        { new: true }
      );

      res.status(201).json({ msg: "Create new shop complete.", shop });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Something went wrong", err });
    }
  }

  static async updateShop(req, res) {
    try {
      const data = req.body;

      if (!mongoose.isValidObjectId(data.shop_id))
        return res.status(400).json({ msg: `Invalid id: ${data.shop_id}` });

      const shop = await ShopModel.findOneAndUpdate(
        { _id: data.shop_id },
        { $set: data },
        { new: true }
      );
      res.status(201).json({ msg: "Update complete.", shop });
    } catch (err) {
      res.status(500).json({ msg: "Something went wrong", err });
    }
  }
  static async deleteShop(req, res) {
    try {
      const shop_id = req.params.shop_id;

      if (!mongoose.isValidObjectId(shop_id))
        return res.status(400).json({ msg: `Invalid id: ${shop_id}` });

      const shop = await ShopModel.findOneAndUpdate(
        { _id: shop_id },
        { isDelete: true },
        { new: true }
      );
      res.status(201).json({ msg: "Delete complete." });
    } catch (err) {
      res.status(500).json({ msg: "Something went wrong", err });
    }
  }
}

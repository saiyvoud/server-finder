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
      let user_id = req.user._id;
      let { name, imgFile, phone, bank, address, openTime, closeTime } =
        req.body;

      if (!name) {
        return res.status(400).json({ msg: "name field is required." });
      }
      if (!phone) {
        return res.status(400).json({ msg: "phone field is required." });
      }
      if (!bank) {
        return res.status(400).json({ msg: "bank field is required." });
      }
      if (!address) {
        return res.status(400).json({ msg: "address field is required." });
      }
      if (!openTime) {
        return res.status(400).json({ msg: "openTime field is required." });
      }
      if (!closeTime) {
        return res.status(400).json({ msg: "closeTime field is required." });
      }

      if (!bank.bankName) {
        return res
          .status(400)
          .json({ msg: "bank( bankName field is required.)" });
      }
      if (!bank.accountId) {
        return res
          .status(400)
          .json({ msg: "bank( accountId field is required.)" });
      }
      if (!bank.accountName) {
        return res
          .status(400)
          .json({ msg: "bank( accountName field is required.)" });
      }

      if (!address.village) {
        return res.status(400).json({ msg: "village field is required." });
      }
      if (!address.district) {
        return res.status(400).json({ msg: "district field is required." });
      }
      if (!address.province) {
        return res.status(400).json({ msg: "province field is required." });
      }
      if (!address.lat) {
        return res.status(400).json({ msg: "lat field is required." });
      }
      if (!address.lng) {
        return res.status(400).json({ msg: "lng field is required." });
      }

      const imgUrl = await UploadImage(imgFile);

      const banks = await BankModel.create(bank);

      if (req.user.auth === "admin") {
        if (!mongoose.isValidObjectId(data.user_id))
          return res.status(400).json({ msg: `Invalid id: ${data.user_id}` });
        user_id = data.user_id;
      }

      const data = {
        user: user_id,
        name,
        phone,
        openTime,
        closeTime,
        address,
        bankAccount: banks._id,
        image: imgUrl,
      };

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
      let {shop_id, name, imgFile, phone, bank, address, openTime, closeTime } =
        req.body;

      if (!name) {
        return res.status(400).json({ msg: "name field is required." });
      }
      if (!phone) {
        return res.status(400).json({ msg: "phone field is required." });
      }
      if (!bank) {
        return res.status(400).json({ msg: "bank field is required." });
      }
      if (!address) {
        return res.status(400).json({ msg: "address field is required." });
      }
      if (!openTime) {
        return res.status(400).json({ msg: "openTime field is required." });
      }
      if (!closeTime) {
        return res.status(400).json({ msg: "closeTime field is required." });
      }

      if (!bank.bankName) {
        return res
          .status(400)
          .json({ msg: "bank( bankName field is required.)" });
      }
      if (!bank.accountId) {
        return res
          .status(400)
          .json({ msg: "bank( accountId field is required.)" });
      }
      if (!bank.accountName) {
        return res
          .status(400)
          .json({ msg: "bank( accountName field is required.)" });
      }

      if (!address.village) {
        return res.status(400).json({ msg: "village field is required." });
      }
      if (!address.district) {
        return res.status(400).json({ msg: "district field is required." });
      }
      if (!address.province) {
        return res.status(400).json({ msg: "province field is required." });
      }
      if (!address.lat) {
        return res.status(400).json({ msg: "lat field is required." });
      }
      if (!address.lng) {
        return res.status(400).json({ msg: "lng field is required." });
      }

      if(imgFile){
        var imgUrl = await UploadImage(imgFile);
      }     

      if (!mongoose.isValidObjectId(shop_id) || shop_id === '')
        return res.status(400).json({ msg: `Invalid id: ${shop_id}` });
      const data = {
        user: user_id,
        name,
        phone,
        openTime,
        closeTime,
        address,
        bankAccount: banks._id,
        image: imgUrl,
      };

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

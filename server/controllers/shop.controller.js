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
      let {
        name,
        category,
        imgFile,
        coverImg,
        phone,
        // bank,
        // address,
        bankName,
        accountId,
        accountName,
        village,
        district,
        province,
        lat,
        lng,
        openTime,
        closeTime,
        openDay,
        closeDay,
      } = req.body;

      if (!name) {
        return res.status(400).json({ msg: "please input name" });
      }
      if (!phone) {
        return res.status(400).json({ msg: "please input phone" });
      }

      if (!category) {
        return res.status(400).json({ msg: "please input category" });
      }
      if (!openTime) {
        return res.status(400).json({ msg: "please input openTime" });
      }
      if (!closeTime) {
        return res.status(400).json({ msg: "please input closeTime" });
      }

      if (!openDay) {
        return res.status(400).json({ msg: "please input openDay" });
      }
      if (!closeDay) {
        return res.status(400).json({ msg: "please input closeDay" });
      }

      if (!village) {
        return res.status(400).json({ msg: "please input village" });
      }
      if (!district) {
        return res.status(400).json({ msg: "please input district" });
      }
      if (!province) {
        return res.status(400).json({ msg: "please input province" });
      }
      if (!lat) {
        return res.status(400).json({ msg: "please input lat" });
      }
      if (!lng) {
        return res.status(400).json({ msg: "please input lng" });
      }

      const chkExist = await ShopModel.findOne({ user: user_id });
      if (chkExist)
        return res.status(400).json({ msg: "you are already have shop." });

      if (imgFile) {
        var imgUrl = await UploadImage(imgFile);
      }
      
      if (coverImg) {
        var coverImgUrl = await UploadImage(coverImg);
      }

      if (bankName) {
        const chkBankExist = await BankModel.findOne({
          accountId
        });
        if (chkBankExist)
          return res
            .status(400)
            .json({ msg: "your bank account is already exist." });

        var banks = await BankModel.create({bankName, accountId, accountName});
        var bank_id = banks._id;
      }

      if (req.user.auth === "admin") {
        if (!mongoose.isValidObjectId(data.user_id))
          return res.status(400).json({ msg: `Invalid id: ${data.user_id}` });
        user_id = data.user_id;
      }

      const data = {
        user: user_id,
        name,
        category,
        phone,
        openTime,
        closeTime,
        openDay,
        closeDay,
        address:{
          village,
          district,
          province,
          lat,
          lng
        },
        bankAccount: bank_id,
        image: imgUrl,
        coverImage: coverImgUrl,
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
      let { shop_id, name, phone, village, district, province, lat, lng, openTime, closeTime } =
        req.body;

      if (!name) {
        return res.status(400).json({ msg: "please input name" });
      }
      if (!phone) {
        return res.status(400).json({ msg: "please input phone" });
      }
      // if (!address) {
      //   return res.status(400).json({ msg: "please input address" });
      // }
      if (!openTime) {
        return res.status(400).json({ msg: "please input openTime" });
      }
      if (!closeTime) {
        return res.status(400).json({ msg: "please input closeTime" });
      }

      if (!village) {
        return res.status(400).json({ msg: "please input village" });
      }
      if (!district) {
        return res.status(400).json({ msg: "please input district" });
      }
      if (!province) {
        return res.status(400).json({ msg: "please input province" });
      }
      if (!lat) {
        return res.status(400).json({ msg: "please input lat" });
      }
      if (!lng) {
        return res.status(400).json({ msg: "please input lng" });
      }

      if (!mongoose.isValidObjectId(shop_id) || shop_id === "")
        return res.status(400).json({ msg: `Invalid id: ${shop_id}` });

      const data = {
        name,
        phone,
        openTime,
        closeTime,
        address:{
          village, district, province, lat, lng
        }
      };

      const shop = await ShopModel.findOneAndUpdate(
        { _id: shop_id },
        { $set: data },
        { new: true }
      );
      res.status(201).json({ msg: "Update complete.", shop });
    } catch (err) {
      console.log(err);
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
      console.log(err);
      res.status(400).json({ msg: "Something went wrong", err });
    }
  }

  static async createBank(req, res) {
    try {
      const { shop_id, bankName, accountId, accountName } = req.body;
      if (!shop_id) {
        return res.status(400).json({ msg: "please input shop_id." });
      }
      if (!bankName) {
        return res.status(400).json({ msg: "please input bankName." });
      }
      if (!accountId) {
        return res.status(400).json({ msg: "please input accountId." });
      }
      if (!accountName) {
        return res.status(400).json({ msg: "please input accountName." });
      }

      if (!mongoose.isValidObjectId(shop_id))
        return res.status(400).json({ msg: `Invalid id: ${shop_id}` });

      const chkBankExist = await BankModel.findOne({ accountId });

      if (chkBankExist)
        return res
          .status(400)
          .json({ msg: "this bank accountId is already exist." });

      const bank = await BankModel.create({ bankName, accountId, accountName });
      const shop = await ShopModel.findByIdAndUpdate(
        shop_id,
        { bankAccount: bank._id },
        { new: true }
      );
      res.status(201).json({ msg: "Add bank account success.", bank });
    } catch (err) {
      res.status(400).json({ msg: "Something went wrong", err });
    }
  }

  static async updateBank(req, res) {
    try {
      const { bank_id, bankName, accountId, accountName } = req.body;
      if (!bank_id) {
        return res.status(400).json({ msg: "please input bank_id." });
      }
      if (!bankName) {
        return res.status(400).json({ msg: "please input bankName." });
      }
      if (!accountId) {
        return res.status(400).json({ msg: "please input accountId." });
      }
      if (!accountName) {
        return res.status(400).json({ msg: "please input accountName." });
      }

      if (!mongoose.isValidObjectId(bank_id))
        return res.status(400).json({ msg: `Invalid id: ${bank_id}` });

      const chkBankExist = await BankModel.findOne({
        _id: { $ne: bank_id },
        accountId,
      });

      if (chkBankExist)
        return res
          .status(400)
          .json({ msg: "this bank accountId is already exist." });
      const data = { bankName, accountId, accountName };
      const bank = await BankModel.findByIdAndUpdate(
        bank_id,
        { $set: data },
        { new: true }
      );

      res.status(201).json({ msg: "Update bank account success.", bank });
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: "Something went wrong", err });
    }
  }

  static async deleteBank(req, res) {
    try {
      const bank_id = req.params._id;
      if (!bank_id) {
        return res.status(400).json({ msg: "please input bank_id." });
      }

      if (!mongoose.isValidObjectId(bank_id))
        return res.status(400).json({ msg: `Invalid id: ${bank_id}` });

      const bank = await BankModel.findByIdAndDelete(bank_id);

      res.status(201).json({ msg: "Delete bank account success.", bank });
    } catch (err) {
      res.status(400).json({ msg: "Something went wrong", err });
    }
  }
}

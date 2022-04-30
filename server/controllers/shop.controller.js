import mongoose from "mongoose";

import ShopModel from "../models/shop.model.js";
import BankModel from "../models/bankAccount.model.js";
import UploadImage from "../utils/uploadImage.js";
import { User } from "../models/user.model.js";
import Notification from "./notification.controller.js";

export default class Shop {
  static async locTest(req, res) {
    const Schema = mongoose.Schema;
    try {
      var infoSchema = new Schema({
        description: String,
      });

      var shapeSchema = new Schema({
        amenity: String,
        shape: {
          type: { type: String },
          coordinates: [],
        },
        info: { type: Schema.Types.ObjectId, ref: "Info" },
      });
      shapeSchema.index({ shape: "2dsphere" });

      var Shape = mongoose.model("Shape", shapeSchema);
      var Info = mongoose.model("Info", infoSchema);

      // Shape.create({
      //   "amenity": "String",
      //   "shape": {
      //     "type": "Point",
      //     "coordinates": [4,6]
      //   },
      // })

      const s = await Shape.find({
        shape: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [6, 10],
            },
          },
        },
      });
      res.json({ s });
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  }

  static async AllShop(req, res) {
    try {
      // const shops = await ShopModel.aggregate([
      //    {
      //     $geoNear: {
      //       near: {
      //         type: "Point",
      //         coordinates: [2, 4],
      //       },
      //       spherical: true,
      //       distanceField: "dis",
      //     },
      //   },
      //   { $skip: 0 },
      //   { $limit: 2 },
      // ]);
      const shop = await ShopModel.find({
        locations: {
          // $geoNear: {
          //   near: {
          //     type: "Point",
          //     coordinates: [2, 4],
          //   },
          //   spherical: true,
          //   distanceField: "dis",
          // },
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [req.body.lat, req.body.lng],
            },
          },
          // spherical: true,
          // distanceField: "dis",
        },
        // location: {
        //   $geoNear: {
        //     near: {
        //       type: "Point",
        //       coordinates: [req.body.lat, req.body.lng],
        //     },
        //     spherical: true,
        //     distanceField: "dis",
        //   },
        // },
      });
      // .sort({ _id: -1 })
      // .populate([
      //   { path: "user", select: "firstname lastname phone" },
      //   { path: "bankAccount" },
      // ]);
      // .skip(3).limit(2);

      res.status(200).json({ msg: "Success", shop });
    } catch (err) {
      console.log("err", err);
      res.status(500).json({ msg: "Something went wrong", err });
    }
  }

  static async NonActiveShop(req, res) {
    try {
      const shop = await ShopModel.find({ isActive: false })
        .sort({ _id: -1 })
        .populate([
          { path: "user", select: "firstname lastname phone" },
          { path: "bankAccount" },
        ]);
      res.status(200).json({ msg: "Get All Non Acitve Shop Success", shop });
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

      if (shop && !shop.isActive) {
        return res.status(400).json({
          msg: `Your shop is waiting for active.`,
          shop: { _id: shop._id, isActive: false },
        });
      }

      res.status(200).json({ msg: "Success", shop: shop });
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

      if (req.user.auth === "admin") {
        if (!mongoose.isValidObjectId(req.body.user_id))
          return res
            .status(400)
            .json({ msg: `Invalid id: ${req.body.user_id}` });
        if (!req.body.user_id) {
          return res.status(400).json({ msg: "please input user_id" });
        }
        user_id = req.body.user_id;
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
          accountId,
        });
        if (chkBankExist)
          return res
            .status(400)
            .json({ msg: "your bank account is already exist." });

        var banks = await BankModel.create({
          bankName,
          accountId,
          accountName,
        });
        var bank_id = banks._id;
      }

      const data = await {
        user: user_id,
        name,
        category,
        phone,
        openTime,
        closeTime,
        openDay,
        closeDay,
        address: {
          village,
          district,
          province,
          lat,
          lng,
        },
        bankAccount: bank_id,
        image: imgUrl,
        coverImage: coverImgUrl,
        locations: {
          coordinates: [lat, lng],
        },
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
      let {
        shop_id,
        name,
        phone,
        village,
        district,
        province,
        lat,
        lng,
        openTime,
        closeTime,
        closeDay,
        openDay,
      } = req.body;

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

      if (!mongoose.isValidObjectId(shop_id) || shop_id === "")
        return res.status(400).json({ msg: `Invalid id: ${shop_id}` });

      const data = {
        name,
        phone,
        openTime,
        closeTime,
        closeDay,
        openDay,
        address: {
          village,
          district,
          province,
          lat,
          lng,
        },
      };

      const shop = await ShopModel.findOneAndUpdate(
        { _id: shop_id },
        { $set: data },
        { new: true }
      );
      res.status(200).json({ msg: "Update complete.", shop });
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
      res.status(200).json({ msg: "Delete complete." });
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: "Something went wrong", err });
    }
  }

  static async activeShop(req, res) {
    try {
      const shop_id = req.params.shop_id;

      if (!mongoose.isValidObjectId(shop_id))
        return res.status(400).json({ msg: `Invalid id: ${shop_id}` });

      const shop = await ShopModel.findOneAndUpdate(
        { _id: shop_id, isActive: false },
        { isActive: true },
        { new: true }
      );

      if (!shop) {
        return res
          .status(400)
          .json({ success: false, msg: "Not found shop.", shop });
      }

      res
        .status(200)
        .json({ success: true, msg: "Active shop complete.", shop });
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

      res.status(200).json({ msg: "Update bank account success.", bank });
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

      res.status(200).json({ msg: "Delete bank account success.", bank });
    } catch (err) {
      res.status(400).json({ msg: "Something went wrong", err });
    }
  }
}

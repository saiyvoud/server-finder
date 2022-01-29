import mongoose from "mongoose";

import cloudinary from "../config/cloudinary.js";
import Service from "../models/service.model.js";
import Shop from "../models/shop.model.js";
import { User } from "../models/user.model.js";
import UploadImage from "../utils/uploadImage.js";

export default class uploadImage {
  static async uploadUserImage(req, res) {
    try {
      const { imgFile, oldImgUrl } = req.body;
      const user_id = req.user._id;
      if (!imgFile) {
        return res.status(400).json({ msg: "please input imgFile." });
      }
      const imgUrl = await UploadImage(imgFile, oldImgUrl);

      console.log(imgUrl);
      if (!imgUrl) {
        return res.status(400).json({ msg: "image file not support. " });
      }

      await User.findByIdAndUpdate(user_id, { image: imgUrl }, { new: true });

      res.status(200).json({ msg: "upload user image complete", imgUrl });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: "Something went wrong" });
    }
  }

  static async uploadShopImage(req, res) {
    try {
      const { shop_id, imgFile, oldImgUrl } = req.body;
      if (!imgFile) {
        return res.status(400).json({ msg: "please input imgFile." });
      }
      if (!mongoose.isValidObjectId(shop_id))
        return res.status(400).json({ msg: `Invalid id: ${shop_id}` });

      const imgUrl = await UploadImage(imgFile, oldImgUrl);
      console.log(imgUrl);
      if (!imgUrl) {
        return res.status(400).json({ msg: "image file not support. " });
      }
      await Shop.findByIdAndUpdate(shop_id, { image: imgUrl }, { new: true });

      res.status(200).json({ msg: "upload shop image complete", imgUrl });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: "Something went wrong" });
    }
  }

  static async uploadShopCoverImage(req, res) {
    try {
      const { shop_id, imgFile, oldImgUrl } = req.body;
      if (!imgFile) {
        return res.status(400).json({ msg: "please input imgFile." });
      }
      if (!mongoose.isValidObjectId(shop_id))
        return res.status(400).json({ msg: `Invalid id: ${shop_id}` });

      const imgUrl = await UploadImage(imgFile, oldImgUrl);

      console.log(imgUrl);
      if (!imgUrl) {
        return res.status(400).json({ msg: "image file not support. " });
      }

      await Shop.findByIdAndUpdate(
        shop_id,
        { coverImage: imgUrl },
        { new: true }
      );

      res.status(200).json({ msg: "upload shop cover image complete", imgUrl });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: "Something went wrong" });
    }
  }

  static async uploadServiceImage(req, res) {
    try {
      const { service_id, imgFile, oldImgUrl } = req.body;
      if (!imgFile) {
        return res.status(400).json({ msg: "please input imgFile." });
      }
      if (!mongoose.isValidObjectId(service_id))
        return res.status(400).json({ msg: `Invalid id: ${service_id}` });

      const imgUrl = await UploadImage(imgFile, oldImgUrl);

      console.log(imgUrl);
      if (!imgUrl) {
        return res.status(400).json({ msg: "image file not support. " });
      }

      await Service.findByIdAndUpdate(
        service_id,
        { image: imgUrl },
        { new: true }
      );

      res.status(200).json({ msg: "upload service image complete", imgUrl });
    } catch (err) {
      res.status(500).json({ err: "Something went wrong" });
    }
  }
}

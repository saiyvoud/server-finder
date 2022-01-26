import mongoose from "mongoose";

import cloudinary from "../config/cloudinary.js";
import Service from "../models/service.model.js";
import Shop from "../models/shop.model.js";
import { User } from "../models/user.model.js";
import UploadImage from "../utils/uploadImage.js";

export default class uploadImage {
  static async uploadUserImage(req, res) {
    try {
      const imgFile = req.body.imgFile;
      const user_id = req.user._id;
      const imgUrl = await UploadImage(imgFile);
      await User.findByIdAndUpdate(
        user_id,
        { image: imgUrl },
        { new: true }
      );

      res.status(200).json({ msg: "upload complete", imgUrl  });
    } catch (err) {
      console.log(err)
      res.status(500).json({ err: "Something went wrong" });
    }
  }

  static async uploadShopImage(req, res) {
    try {
      const { shop_id, imgFile } = req.body;

      if (!mongoose.isValidObjectId(shop_id))
        return res.status(400).json({ msg: `Invalid id: ${shop_id}` });

      const imgUrl = await UploadImage(imgFile);
      // const res_upload = await cloudinary.uploader.upload(fileStr, null, {
      //   public_id: `${Date.now()}`,
      //   resource_type: "auto",
      // });

      await Shop.findByIdAndUpdate(
        shop_id,
        { image: imgUrl },
        { new: true }
      );

      res.status(200).json({ msg: "upload complete", imgUrl  });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: "Something went wrong" });
    }
  }

  static async uploadServiceImage(req, res) {
    try {
      const { service_id, imgFile } = req.body;

      const imgUrl = await UploadImage(imgFile);

      await Service.findByIdAndUpdate(
        service_id,
        { image: imgUrl },
        { new: true }
      );

      res.status(200).json({ msg: "upload complete", imgUrl });
    } catch (err) {
      res.status(500).json({ err: "Something went wrong" });
    }
  }
}

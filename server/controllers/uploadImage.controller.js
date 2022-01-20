import mongoose from 'mongoose'

import cloudinary from "../config/cloudinary.js";
import Service from "../models/service.model.js";
import Shop from "../models/shop.model.js";
import { User } from "../models/user.model.js";

export default class uploadImage {

  static async uploadUserImage(req, res) {
    try {
      const fileStr = req.files.imgFile.path;
      const user_id = req.user._id
      const res_upload = await cloudinary.uploader.upload(fileStr,null, {
        public_id: `${Date.now()}`,
        resource_type: "auto",
      });

      await User.findByIdAndUpdate(user_id, {image:res_upload.url}, {new:true})

      res.json({ msg: "upload complete" });
    } catch (err) {
      res.status(500).json({ err: "Something went wrong" });
    }
  }

  static async uploadShopImage(req, res) {
    try {
      const fileStr = req.files.imgFile.path;
      const shop_id = req.params._id

      if (!mongoose.isValidObjectId(shop_id))
        return res.status(400).json({ msg: `Invalid id: ${shop_id}` });

      const res_upload = await cloudinary.uploader.upload(fileStr,null, {
        public_id: `${Date.now()}`,
        resource_type: "auto",
      });

      await Shop.findByIdAndUpdate(shop_id, {image:res_upload.url}, {new:true})

      res.json({ msg: "upload complete" });
    } catch (err) {
        console.log(err);
      res.status(500).json({ err: "Something went wrong" });
    }
  }
  static async uploadServiceImage(req, res) {
    try {
      const fileStr = req.files.imgFile.path;
      const service_id = req.params._id
      const res_upload = await cloudinary.uploader.upload(fileStr,null, {
        public_id: `${Date.now()}`,
        resource_type: "auto",
      });

      await Service.findByIdAndUpdate(service_id, {image:res_upload.url}, {new:true})

      res.json({ msg: "upload complete" });
    } catch (err) {
      res.status(500).json({ err: "Something went wrong" });
    }
  }
}

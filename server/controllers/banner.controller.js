import mongoose from "mongoose";
import BannerModel from "../models/banner.model.js";
import UploadImage from "../utils/uploadImage.js";
export default class Review {
  static async getAllBanner(req, res) {
    try {
      const banner = await BannerModel.find({})
      res.status(200).json({ msg: "Get banner", banner });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async createBanner(req, res) {
    try {
      let data = req.body;

      const imgURL = await UploadImage(data.imgFile)
      
      data = {...data, image: imgURL}

      const banner = await BannerModel.create(data);

      res.status(201).json({ msg: "Create new banner.", banner });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async updateBanner(req, res) {
    try {
      const { banner_id, name, detail } = req.body;

      if (!mongoose.isValidObjectId(banner_id) || banner_id==='')
        res.status(400).json({ msg: "Something wrong" });
      const banner = await BannerModel.findByIdAndUpdate(
        banner_id,
        { name, detail },
        { new: true }
      );
      res.status(201).json({ msg: "Update banner", banner });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async deleteBanner(req, res) {
    try {
      const banner_id = req.params._id;

      if (!mongoose.isValidObjectId(banner_id) || banner_id==='')
        res.status(400).json({ msg: "Something wrong" });

      await BannerModel.findByIdAndUpdate(banner_id, {isDelete:true}, {new:true});
      res.status(201).json({ msg: "Delete complete" });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }
}

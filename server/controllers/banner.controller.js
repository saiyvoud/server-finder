import mongoose from "mongoose";
import BannerModel from "../models/banner.model.js";
import UploadImage from "../utils/uploadImage.js";
export default class Review {
  static async getAllBanner(req, res) {
    try {
      const banner = await BannerModel.find({});
      res.status(200).json({ msg: "Get banner", banner });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async createBanner(req, res) {
    try {
      const { name, detail, imgFile } = req.body;
      if (!name) {
        return res.status(400).json({ msg: "name field is required." });
      }
      if (!detail) {
        return res.status(400).json({ msg: "detail field is required." });
      }
      if (!imgFile) {
        return res.status(400).json({ msg: "imgFile field is required." });
      }

      const imgURL = await UploadImage(imgFile);

      const data = { name, detail, image: imgURL };

      const banner = await BannerModel.create(data);

      res.status(201).json({ msg: "Create new banner.", banner });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async updateBanner(req, res) {
    try {
      const { banner_id, name, detail, imgFile } = req.body;
      if (!name) {
        return res.status(400).json({ msg: "name field is required." });
      }
      if (!detail) {
        return res.status(400).json({ msg: "detail field is required." });
      }
      if (!mongoose.isValidObjectId(banner_id) || banner_id === "")
        return res.status(400).json({ msg: "Invalid ID" + banner_id });

      if (imgFile) {
        var imgURL = await UploadImage(imgFile);
      }

      const data = { name, detail, image: imgURL };

      const banner = await BannerModel.findByIdAndUpdate(
        banner_id,
        { $set: data },
        { new: true }
      );
      res.status(201).json({ msg: "Update banner", banner });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async deleteBanner(req, res) {
    try {
      const banner_id = req.params._id;

      if (!mongoose.isValidObjectId(banner_id) || banner_id === "")
        res.status(400).json({ msg: "Something wrong" });

      await BannerModel.findByIdAndUpdate(
        banner_id,
        { isDelete: true },
        { new: true }
      );
      res.status(201).json({ msg: "Delete complete" });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }
}

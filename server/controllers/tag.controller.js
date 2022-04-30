import mongoose from "mongoose";
import TagModel from "../models/tag.model.js";
import UploadImage from "../utils/uploadImage.js";
export default class Tag {
  static async getAllTag(req, res) {
    try {
      const tag = await TagModel.find({ isDelete: false });
      res.status(200).json({ msg: "Get all tag", tag });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async getShopTag(req, res) {
    try {
      const { category } = req.params;
      const tag = await TagModel.find({ category, isDelete: false });
      res.status(200).json({ msg: "Get shop tag", tag });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async addTag(req, res) {
    try {
      const { name, category, tag_type, imgFile, iconFile } = req.body;
      if (!name) {
        return res.status(400).json({ msg: "please input name." });
      }
      if (!category) {
        return res.status(400).json({ msg: "please input category." });
      }
      if (!tag_type) {
        return res.status(400).json({ msg: "please input tag_type." });
      }
      if (!imgFile) {
        return res.status(400).json({ msg: "please input imgFile." });
      }

      if (!iconFile) {
        return res.status(400).json({ msg: "please input iconFile." });
      }

      const imgUrl = await UploadImage(imgFile);
      const iconUrl = await UploadImage(iconFile);

      const tag = await TagModel.create({
        name,
        category,
        tag_type,
        image: imgUrl,
        icon: iconUrl,
      });

      res.status(201).json({ msg: "Create new tag.", tag });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async updateTag(req, res) {
    try {
      const { tag_id, name, tag_type, imgFile, oldImg, iconFile, oldIcon } =
        req.body;

      if (!tag_id) {
        return res.status(400).json({ msg: "tag_id can not be null" });
      }
      if (!name) {
        return res.status(400).json({ msg: "please input name." });
      }
      if (!tag_type) {
        return res.status(400).json({ msg: "please input tag_type." });
      }
      if ((imgFile && !oldImg) || (!imgFile && oldImg)) {
        return res.status(400).json({ msg: "please input imgFile or oldImg." });
      }
      
      if ((!iconFile && oldIcon)||(iconFile && !oldIcon)) {
        return res
          .status(400)
          .json({ msg: "please input iconFile or oldIcon." });
      }

      if (!mongoose.isValidObjectId(tag_id))
        return res.status(400).json({ msg: "Invalid ID " + tag_id });

      if (imgFile) {
        var imgUrl = await UploadImage(imgFile, oldImg);
      }

      if (iconFile) {
        var iconUrl = await UploadImage(iconFile, oldIcon);
      }

      const tag = await TagModel.findByIdAndUpdate(
        tag_id,
        { name, tag_type, image: imgUrl, icon: iconUrl },
        { new: true }
      );
      res.status(201).json({ msg: "Update tag complete", tag });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async deleteTag(req, res) {
    try {
      const tag_id = req.params._id;
      if (!tag_id) {
        return res.status(400).json({ msg: "tag_id can not be null." });
      }
      if (!mongoose.isValidObjectId(tag_id) || tag_id === "")
        res.status(400).json({ msg: "Something wrong" });

      await TagModel.findByIdAndUpdate(
        tag_id,
        { isDelete: true },
        { new: true }
      );
      res.status(201).json({ msg: "Delete complete" });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }
}

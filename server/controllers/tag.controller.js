import mongoose from "mongoose";
import TagModel from "../models/tag.model.js";
import UploadImage from "../utils/uploadImage.js";
export default class Review {
  static async getAllTag(req, res) {
    try {
      const tag = await TagModel.find({});
      res.status(200).json({ msg: "Get all tag", tag });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async addTag(req, res) {
    try {
      const { name, category, imgFile } = req.body;
      if (!name) {
        return res.status(400).json({ msg: "please input name." });
      }
      if (!category) {
        return res.status(400).json({ msg: "please input category." });
      }
      if (!imgFile) {
        return res.status(400).json({ msg: "please input imgFile." });
      }

      const imgUrl = await UploadImage(imgFile);

      const tag = await TagModel.create({name, category, image: imgUrl});

      res.status(201).json({ msg: "Create new tag.", tag });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async updateTag(req, res) {
    try {
      const { tag_id, name, imgFile } = req.body;
      
      if (!tag_id) {
        return res.status(400).json({ msg: "tag_id can not be null" });
      }
      if (!name) {
        return res.status(400).json({ msg: "please input name." });
      }
      if (!imgFile) {
        return res.status(400).json({ msg: "please input imgFile." });
      }
      
      if (!mongoose.isValidObjectId(tag_id))
        return res.status(400).json({ msg: "Invalid ID " + tag_id });

      const imgUrl = await UploadImage(imgFile);

      const tag = await TagModel.findByIdAndUpdate(
        tag_id,
        { name, image: imgUrl },
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

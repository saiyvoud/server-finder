import mongoose from "mongoose";
import MenuModel from "../models/menu.model.js";
import UploadImage from "../utils/uploadImage.js";
export default class  Menu {
  static async getAllMenu(req, res) {
    try {
      const menu = await MenuModel.find({ isDelete: false });
      res.status(200).json({ msg: "Get all Menu", menu });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async addMenu(req, res) {
    try {
      const { name, category,  imgFile } = req.body;
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

      const menu = await MenuModel.create({ name, category,  image: imgUrl });

      res.status(201).json({ msg: "Create new menu.", menu });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async updateMenu(req, res) {
    try {
      const { menu_id, name,  imgFile, oldImg } = req.body;

      if (!menu_id) {
        return res.status(400).json({ msg: "menu_id can not be null" });
      }
      if (!name) {
        return res.status(400).json({ msg: "please input name." });
      }
     
      if (!imgFile) {
        return res.status(400).json({ msg: "please input imgFile." });
      }

      if (!mongoose.isValidObjectId(menu_id))
        return res.status(400).json({ msg: "Invalid ID " + menu_id });

        if(imgFile){
          var imgUrl = await UploadImage(imgFile, oldImg);
        }

       await MenuModel.findByIdAndUpdate(
        menu_id ,
        { name,  image: imgUrl },
        { new: true }
      );
      res.status(201).json({ msg: "Update menu complete", menu });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async deleteMenu(req, res) {
    try {
      const menu_id = req.params._id;
      if (!menu_id) {
        return res.status(400).json({ msg: "menu_id can not be null." });
      }
      if (!mongoose.isValidObjectId(menu_id) || menu_id === "")
        res.status(400).json({ msg: "Something wrong" });

      await MenuModel.findByIdAndUpdate(
        menu_id,
        { isDelete: true },
        { new: true }
      );
      res.status(201).json({ msg: "Delete complete" });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }
}

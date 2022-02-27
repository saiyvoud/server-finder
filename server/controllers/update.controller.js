import mongoose from "mongoose";
import UpdateModel from "../models/update.model.js";

export default class UpdateController {
  static async AllUpdate(req, res) {
    try {
      const update = await UpdateModel.find({}).sort({_id:-1});
      res.status(200).json({ success: true,  msg: "Get all update version of application.", update });
    } catch (err) {
      res.status(404).json({  success: false, msg: "Something wrong", err });
    }
  }

  static async LastUpdate(req, res) {
    try {
      const update = await UpdateModel.findOne({ isActive: true });
      res.status(200).json({success: true,  msg: "Get last update version of application.", update });
    } catch (err) {
      res.status(404).json({success: false,  msg: "Something wrong", err });
    }
  }

  static async NewUpdate(req, res) {
    try {
      const { android_key, ios_key, title, description, version } = req.body;
      if (!android_key && !ios_key) {
        return res.status(400).json({ msg: "please input adroid_key or ios_key." });
      }
      if (!title) {
        return res.status(400).json({ msg: "please input title." });
      }
      if (!description) {
        return res.status(400).json({ msg: "please input description." });
      }
      if (!version) {
        return res.status(400).json({ msg: "please input version." });
      }

      await UpdateModel.updateMany({isActive: true}, {isActive:false}, {new: true})

      const update = await UpdateModel.create({ android_key, ios_key, version, title, description});

      res.status(201).json({success: true,  msg: "Create new update version complete.", update });
    } catch (err) {
      console.log(err);
      res.status(404).json({success: false,  msg: "Something wrong", err });
    }
  }

  static async RemoveUpdate(req, res) {
    try {
      const { update_id } = req.params;
      
      if (!update_id) {
        return res.status(400).json({ msg: "update_id can not be null." });
      }

      if (!mongoose.isValidObjectId(update_id)) {
        return res.status(400).json({ msg: "Invalid upate_id: "+update_id });
      }


      const update = await UpdateModel.findByIdAndDelete(update_id);

      res.status(200).json({success: true,  msg: "Remove update version complete.", update });
    } catch (err) {
      console.log(err);
      res.status(404).json({success: false,  msg: "Something wrong", err });
    }
  }
}
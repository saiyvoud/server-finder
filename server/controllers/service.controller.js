import mongoose from "mongoose";
import ServiceController from "../models/service.model.js";
import UploadImage from "../utils/uploadImage.js";

export default class Service {
  static async getServiceAll(req, res) {
    try {
      const service = await ServiceController.find({})
        .populate({
          path: "shop",
          select: "name phone address location openTime closeTime",
          model: "Shop",
        })
        .sort({ _id: -1 });
      res.status(200).json({ service });
    } catch (err) {
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }

  static async getServiceShop(req, res) {
    try {
      const _id = req.params.shop_id;
      if (!mongoose.isValidObjectId(_id))
        return res.status(400).json({ msg: `Invalid id: ${_id}` });

      const service = await ServiceController.find({ shop: _id }).sort({
        _id: -1,
      });
      res.status(200).json({ service });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }

  static async getServiceById(req, res) {
    try {
      const _id = req.params._id;
      if (!mongoose.isValidObjectId(_id))
        return res.status(400).json({ msg: `Invalid id: ${_id}` });

      const service = await ServiceController.findOne({ _id }).populate({
        path: "shop",
        select: "name phone address location openTime closeTime",
        model: "Shop",
      });
      res.status(200).json({ service });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }

  static async postService(req, res) {
    try {
      let data = req.body;
      if (!mongoose.isValidObjectId(data.shop_id))
        return res.status(400).json({ msg: `Invalid id: ${data.shop_id}` });

      const imgUrl = await UploadImage(data.image)

      data = { ...data, shop: data.shop_id, image: imgUrl };
      const service = await ServiceController.create(data);
      res.status(201).json({ service });
    } catch (err) {
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }

  static async updateService(req, res) {
    try {
      let data = req.body;

      if (!mongoose.isValidObjectId(data.service_id))
        res.json({ msg: `Invalid id: ${data.service_id}` });

        data.image = undefined

      const service = await ServiceController.findByIdAndUpdate(
        { _id: data.service_id },
        { $set: data },
        { new: true }
      );
      res.status(200).json({ msg: "Update complete.", service });
    } catch (err) {
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }

  static async deleteService(req, res) {
    try {
      const _id = req.params._id;

      if (!mongoose.isValidObjectId(_id))
        return res.status(400).json({ msg: `Invalid id: ${_id}` });

      await ServiceController.findOneAndUpdate(
        { _id },
        { isDelete: true },
        { new: true }
      );
      res.status(200).json({ msg: "Delete complete." });
    } catch (err) {
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }
}

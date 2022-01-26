import mongoose from "mongoose";

import AddressModel from "../models/address.model.js";

export default class Address {
  static async getAddressAll(req, res) {
    try {
      const address = await AddressModel.find({});
      res.status(200).json({ address });
    } catch (err) {
      return res.status(400).json({ msg: "Something wrong. ", err });
    }
  }

  static async getAddressOne(req, res) {
    try {
      const _id = req.params._id;
      if (!mongoose.isValidObjectId(_id))
        return res.status(400).json({ msg: `Invalid id: ${_id}` });

      const address = await AddressModel.findOne({ _id });
      res.status(200).json({ address });
    } catch (err) {
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }

  static async createAddress(req, res) {
    try {
      // let data = req.body;
      const { village, district, province, lat, lng } = req.body;

      if (!village) {
        return res.status(400).json({ msg: "village field is required." });
      }
      if (!district) {
        return res.status(400).json({ msg: "district field is required." });
      }
      if (!province) {
        return res.status(400).json({ msg: "province field is required." });
      }
      if (!lat) {
        return res.status(400).json({ msg: "lat field is required." });
      }
      if (!lng) {
        return res.status(400).json({ msg: "lng field is required." });
      }

      const data = { user: req.user._id, village, district, province, lat, lng };
      await AddressModel.updateMany(
        { user: req.user._id, isActive: true },
        { isActive: false },
        { new: true }
      );
      const address = await AddressModel.create(data);
      res.status(200).json({ msg: "Insert new address", address });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }
}

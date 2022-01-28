import mongoose from "mongoose";

import CarModel from "../models/car.model.js";

export default class Car {
  static async userCar(req, res) {
    try {
      const user_id = req.user._id;
      const car = await CarModel.find({ user: user_id, isDelete: false });
      res.status(200).json({ msg: `Get all user's car`, car });
    } catch (err) {
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }
  static async createCar(req, res) {
    try {
      const user_id = req.user._id;
      const { name, type, brand, carNo } = req.body;
      if (!name) {
        return res.status(400).json({ msg: "please input name." });
      }
      if (!type) {
        return res.status(400).json({ msg: "please input type." });
      }
      if (!brand) {
        return res.status(400).json({ msg: "please input brand." });
      }
      if (!carNo) {
        return res.status(400).json({ msg: "please input carNo." });
      }
      const data = { user: user_id, name, type, brand, carNo };
      const car = await CarModel.create(data);
      res.status(201).json({ msg: "create new car.", car });
    } catch (err) {
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }
  static async updateCar(req, res) {
    try {
      const _id = req.body.car_id;
      const { name, type, brand, carNo } = req.body;
      if (!_id) {
        return res.status(400).json({ msg: "please input car_id." });
      }
      if (!name) {
        return res.status(400).json({ msg: "please input name." });
      }
      if (!type) {
        return res.status(400).json({ msg: "please input type." });
      }
      if (!brand) {
        return res.status(400).json({ msg: "please input brand." });
      }
      if (!carNo) {
        return res.status(400).json({ msg: "please input carNo." });
      }

      if (!mongoose.isValidObjectId(_id))
        return res.status(400).json({ msg: `Invalid id: ${_id}` });

      const car = await CarModel.findByIdAndUpdate(
        _id,
        { $set: data },
        { new: true }
      );
      res.status(201).json({ msg: `update car's info complete.`, car });
    } catch (err) {
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }
  static async deleteCar(req, res) {
    try {
      const _id = req.params._id;
      if (!car_id) {
        return res.status(400).json({ msg: "please input car_id." });
      }
      if (!mongoose.isValidObjectId(_id))
        return res.status(400).json({ msg: `Invalid id: ${_id}` });

      const car = await CarModel.findByIdAndUpdate(
        _id,
        { isDelete: true },
        { new: true }
      );
      res.status(201).json({ msg: `delete car complete.` });
    } catch (err) {
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }
}

import mongoose from "mongoose";

import CarModel from "../models/car.model.js";

export default class Car {
  static async userCar(req, res) {
    try {
        const user_id = req.user._id;
        const car = await CarModel.find({user: user_id, isDelete: false});
        res.status(200).json({msg:`Get all user's car`, car})
    } catch (err) {
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }
  static async createCar(req, res) {
    try {
        const user_id = req.user._id;
        const data = {...req.body, user: user_id}
        const car = await CarModel.create(data)
        res.status(201).json({msg:'create new car.', car})
    } catch (err) {
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }
  static async updateCar(req, res) {
    try {
        const data =  req.body
        const _id = data.car_id

        if (!mongoose.isValidObjectId(_id))
        return res.status(400).json({ msg: `Invalid id: ${_id}` });

        const car = await CarModel.findByIdAndUpdate(_id, {$set:data}, {new: true})
        res.status(201).json({msg:`update car's info complete.`, car})
    } catch (err) {
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }
  static async deleteCar(req, res) {
    try {
        const _id = req.params._id

        if (!mongoose.isValidObjectId(_id))
        return res.status(400).json({ msg: `Invalid id: ${_id}` });

        const car = await CarModel.findByIdAndUpdate(_id, {isDelete:true}, {new: true})
        res.status(201).json({msg:`delete car complete.` })
    } catch (err) {
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }
}

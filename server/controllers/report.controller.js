import mongoose from "mongoose";
import ReportModel from "../models/report.model.js";
export default class Report {
  static async getAllReport(req, res) {
    try {
      const report = await ReportModel.find({}).populate([
        {
          path: "order",
          model: "Order",
          select: "่description tatolCost createdAt",
        },
        { path: "user", model: "User", select: "firstname lastname" },
        { path: "shop", model: "Shop", select: "name phone" },
      ]);
      res.status(200).json({ msg: "Get All Report", report });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }
  static async getShopReport(req, res) {
    try {
      const shop_id = req.params._id;

      if (!mongoose.isValidObjectId(shop_id) || shop_id === "")
        res.status(400).json({ msg: "Something wrong" });

      const report = await ReportModel.find({ shop: shop_id }).populate([
        {
          path: "order",
          model: "Order",
          select: "description totalCost",
        },
        { path: "user", model: "User", select: "firstname lastname" },
      ]);
      res.status(200).json({ msg: "Get Shop Report", report });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async getUserReport(req, res) {
    try {
      const user_id = req.user._id;

      const report = await ReportModel.find({
        user: user_id,
      }).populate([
        {
          path: "order",
          model: "Order",
          select: 'description totalCost'
        },
        { path: "shop", model: "Shop", select: "name tel" },
      ]);
      res.status(200).json({ msg: "Get User Report", report });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async addReport(req, res) {
    try {
      let data = req.body;

      data = {
        ...data,
        shop: data.shop_id,
        order: data.order_id,
        user: req.user._id,
      };

      const report = await ReportModel.create(data);

      res.status(201).json({ msg: "Add New Report", report });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async updateReport(req, res) {
    try {
      const { report_id, title, body } = req.body;
      const user_id = req.user._id;

      if (!mongoose.isValidObjectId(report_id) || report_id === "")
        res.status(400).json({ msg: "Something wrong" });
      const report = await ReportModel.findOneAndUpdate(
        { _id: report_id, user: user_id },
        { title, body },
        { new: true }
      );
      res.status(201).json({ msg: "Update Report", report });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async unReport(req, res) {
    try {
      const report_id = req.params._id;

      if (!mongoose.isValidObjectId(report_id) || report_id === "")
        res.status(400).json({ msg: "Something wrong" });

      await ReportModel.findOneAndDelete({ _id: report_id });
      res.status(201).json({ msg: "Unreport complete" });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }
}

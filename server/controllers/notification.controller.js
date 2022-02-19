import mongoose from "mongoose";
import NotifModel from "../models/notification.model.js";
import UploadImage from "../utils/uploadImage.js";
export default class Notification {
  static async NotifAll(req, res) {
    try {
      const notification = await NotifModel.find({}).sort({ _id: -1 });
      res.status(200).json({ msg: "Get All Notification", notification });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }
  static async NotifAdmin(req, res) {
    try {
      const notification = await NotifModel.find({ for: "admin" }).sort({
        _id: -1,
      });
      res.status(200).json({ msg: "Get Admin Notification", notification });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async NotifShop(req, res) {
    try {
      const shop_id = req.params._id;
      const notification = await NotifModel.find({
        $or: [{ shop: shop_id, for: { $in: ["shop", "all"] } }],
      }).sort({
        _id: -1,
      });
      res.status(200).json({ msg: "Get Shop Notification", notification });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async NotifUser(req, res) {
    try {
      const notification = await NotifModel.find({
        user: req.user._id,
        for: { $in: ["user", "all"] },
      }).sort({
        _id: -1,
      });
      res.status(200).json({ msg: "Get User Notification", notification });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async postNotif(req, res) {
    try {
      let data = req.body;

      if (!data.image) {
        return res.status(404).json({ msg: "please input image." });
      }
      if (!data.title) {
        return res.status(404).json({ msg: "please input title." });
      }
      if (!data.body) {
        return res.status(404).json({ msg: "please input body." });
      }
      if (!data.for) {
        return res.status(404).json({ msg: "please input for." });
      }

      const imgUrl = await UploadImage(data.image);

      data = { ...data, image: imgUrl };

      const notification = await NotifModel.create(data);

      res.status(201).json({ msg: "Post New Notification", notification });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async postNotifToShop(shop_id, user_id, title, body) {
    try {
      // const title = 'new order'
      // const body = 'new order is waiting. please check...'
      
      const data = {shop:shop_id, user: user_id, title, body, for:'shop'}
      const notif = await NotifModel.create(data);
      console.log('notif ',notif);
      return true
    } catch (err) {
      return false
    }
  }
  static async postNotifToUser(user_id, shop_id, title, body) {
    try {      
      const data = {shop:shop_id, user: user_id, title, body, for:'user'}
      const notif = await NotifModel.create(data);
      console.log('notif ',notif);
      return true
    } catch (err) {
      return false
    }
  }

  static async updateNotif(req, res) {
    try {
      const { notif_id, title, body } = req.body;
      if (!notif_id) {
        return res.status(404).json({ msg: "please input notif_id." });
      }
      if (!title) {
        return res.status(404).json({ msg: "please input title." });
      }
      if (!body) {
        return res.status(404).json({ msg: "please input body." });
      }

      if (!mongoose.isValidObjectId(notif_id))
        res.status(400).json({ msg: "Something wrong" });

      const Notification = await NotifModel.findOneAndUpdate(
        { _id: notif_id },
        { title, body },
        { new: true }
      );
      res.status(201).json({ msg: "Update Notification", Notification });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async removeNotif(req, res) {
    try {
      const notif_id = req.params._id;
      if (!notif_id) {
        return res.status(404).json({ msg: "please input notif_id." });
      }
      if (!mongoose.isValidObjectId(notif_id))
        res.status(400).json({ msg: "Invalid ID: " + notif_id });

      const notification = await NotifModel.findOneAndUpdate(
        { _id: notif_id },
        { isDelete: true },
        { new: true }
      );
      res
        .status(201)
        .json({ msg: "Remove notification complete.", notification });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }
}

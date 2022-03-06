import mongoose from "mongoose";
import NotifModel from "../models/notification.model.js";
import UploadImage from "../utils/uploadImage.js";

import firebaseAdmin from "../config/firebase-admin.js";
import { User } from "../models/user.model.js";
import Shop from "../models/shop.model.js";

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

      if (!mongoose.isValidObjectId(shop_id))
        return res.status(400).json({ msg: `Invalid id: ${shop_id}` });

      const shop = await Shop.findById(shop_id);

      if (!shop)
        return res
          .status(200)
          .json({ msg: "Get Shop Notification", notification: [] });
      const notification = await NotifModel.find({
        $or: [{ shop: shop_id }, { for: "all" }],
        for: { $in: ["shop", "all"] },
        createdAt: { $gt: shop.createdAt },
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
      const user = await User.findById(req.user._id);

      if (!user)
        return res
          .status(200)
          .json({ msg: "Get User Notification", notification: [] });
      const notification = await NotifModel.find({
        $or: [{ user: req.user._id }, { for: "all" }],
        for: { $in: ["user", "all"] },
        createdAt: { $gt: user.createdAt },
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

      // const notification = await NotifModel.create(data);

      // res.status(201).json({ msg: "Post New Notification", notification });

      const token1 =
        "eGh6sibFQ_irHx9-lAeBZl:APA91bEQM2SrzTDn__jXJsIGh-yJJXkidsO4x8AKpzUs235rokDOZVnJ2FBIHHmFWWe72JpK6YoWQ8t1HUkDLRZFAILvX0_zNA_vUMOnjX2V_dBL9iF83ECE8ByitibwRFGQySjQ7YVD";
      const token2 =
        "fQI53ePXRUWgsUGhnCcsCX:APA91bGndEgMN3VmWpJLcZYVETsnb2yv-NxQi7Ue1UxJvTS6EIZVOij3HOQaYEhV_ittteuIb7Miy2MU9mdStdZaQ_hfMvzGVHu7-cJQjzM4xf4_cbbMuJdqvk4WCCo4hOGuXw5WVhjW";
      // const msgSend = await firebaseAdmin.messaging().sendToDevice(
      //   [token1, token2],{

      //     notification: {
      //       title: "Test Message 6",
      //       body: "test finder message 6.",
      //       imageUrl:
      //         "http://res.cloudinary.com/dz2uzdfdy/image/upload/v1645248143/1645248141486.jpg",
      //     },
      //   },
      //   {
      //     // Required for background/quit data-only messages on iOS
      //     contentAvailable: true,
      //     // Required for background/quit data-only messages on Android
      //     priority: "high",
      //   }
      // );
      const t = "";
      const msgSend = await firebaseAdmin.messaging().sendMulticast({
        tokens: [token2, t],
        notification: {
          title: "Test Message",
          body: "test finder message.",
          imageUrl:
            "http://res.cloudinary.com/dz2uzdfdy/image/upload/v1645248143/1645248141486.jpg",
        },
      });

      res
        .status(201)
        .json({ msg: "Post New Notification", notification: "", msgSend });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async postNotifToShop(req, res) {
    try {
      const user_id = req.user.auth === "admin" ? undefined : req.user._id;

      const { shop_user_id, title, body, imgUrl } = req.body;

      if (!title) {
        return res.status(400).json({ msg: "please input title" });
      }
      if (!body) {
        return res.status(400).json({ msg: "please input body" });
      }

      if (!mongoose.isValidObjectId(shop_user_id) || shop_user_id == "")
        return res.status(400).json({ msg: `Invalid id: ${shop_user_id}` });

      const shop = await Shop.findOne({ user: shop_user_id });

      const data = {
        shop: shop._id,
        user: user_id,
        title,
        body,
        image: imgUrl,
        for: "shop",
      };
      const notif = await NotifModel.create(data);
      console.log("notif ", notif);

      let user = await User.findById(shop_user_id);
      console.log("mobile token", user);
      const mobile_token = user.mobile_token;
      const msgSend = await firebaseAdmin.messaging().sendMulticast({
        tokens: [mobile_token],
        notification: {
          title: title,
          body: body,
          imageUrl: imgUrl,
        },
      });
      res.status(200).json({
        success: true,
        msg: "sent notification to shop success.",
        notification: notif,
        msgSend,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "Something wrong.", err });
    }
  }

  static async postNotifToAddmin(req, res) {
    try {
      const user_id = req.user.auth === "genernal" ? req.user._id : undefined;

      const { shop_id, title, body, imgUrl } = req.body;

      if (!title) {
        return res.status(400).json({ msg: "please input title" });
      }
      if (!body) {
        return res.status(400).json({ msg: "please input body" });
      }

      const data = {
        shop: shop_id,
        user: user_id,
        title,
        body,
        image: imgUrl,
        for: "admin",
      };
      const notif = await NotifModel.create(data);
      console.log("notif ", notif);

      let mobile_token = await User.find({ auth: "admin" });
      mobile_token = await mobile_token.map((val) => val.mobile_token);
      const msgSend = await firebaseAdmin.messaging().sendMulticast({
        tokens: mobile_token,
        notification: {
          title: title,
          body: body,
          imageUrl: imgUrl,
        },
      });

      res.status(200).json({
        success: true,
        msg: "sent notification to admin success.",
        notification: notif,
        msgSend,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "Something wrong.", err });
    }
  }

  static async postNotifToUser(req, res) {
    try {
      const { user_id, shop_id, title, body, imgUrl } = req.body;

      if (!title) {
        return res.status(400).json({ msg: "please input title" });
      }
      if (!body) {
        return res.status(400).json({ msg: "please input body" });
      }

      const data = {
        user: user_id,
        shop: shop_id,
        title,
        body,
        image: imgUrl,
        for: "user",
      };
      const notif = await NotifModel.create(data);
      console.log("notif ", notif);

      let user = await User.findById(user_id);
      console.log("mobile token ", user.mobile_token);
      const msgSend = await firebaseAdmin.messaging().sendMulticast({
        tokens: [user.mobile_token],
        notification: {
          title: title,
          body: body,
          imageUrl: imgUrl,
        },
      });

      res.status(200).json({
        success: true,
        msg: "sent notification to user success.",
        notification: notif,
        msgSend,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "Something wrong.", err });
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

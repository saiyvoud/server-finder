import mongoose from "mongoose";

import { OrderModel, OrderDetailModel } from "../models/order.model.js";
import ServiceModel from "../models/service.model.js";
import NotifController from "./notification.controller.js";

export default class Model {
  // ========= Order =============
  static async getOrderAll(req, res) {
    try {
      const {status} = req.params
      const order = await OrderModel.find({status}).populate([
        {
          path: "user",
          select: "firstname lastname phone",
        },
        {
          path: "shop",
          select: "name phone address",
        },
        {
          path: "car",
          select: "name type brand cardNO",
        },
        {
          path: "address",
          select: "village district provice lat lng",
        },
      ]);
      res.status(200).json({ msg: "All Order", order });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }
  
  static async getOrderShop(req, res) {
    try {
      const {shop_id, status} = req.params;

      if (!shop_id)
        return res.status(404).json({ msg: "shop_id can not be null." });

      const order = await OrderModel.find({ shop: shop_id, status }).populate([
        {
          path: "user",
          select: "firstname lastname phone",
        },
        {
          path: "car",
          select: "name type brand cardNO",
        },
        {
          path: "address",
          select: "village district provice lat lng",
        },
        // {
        //   path: "service",
        //   select: "name image price category",
        // },
      ]);
      res.status(200).json({ msg: "Shop Order", order });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async getOrderUser(req, res) {
    try {
      const { status} = req.params;
      const user_id = req.user._id;
      const order = await OrderModel.find({ user: user_id, status }).populate([
        {
          path: "shop",
          select: "name phone address",
        },
        {
          path: "car",
          select: "name type brand cardNO",
        },
        {
          path: "address",
          select: "village district provice lat lng",
        },
        // {
        //   path: "service",
        //   select: "name image price category",
        // },
      ]);
      res.status(200).json({ msg: "User Order", order });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  // static async addOrder(req, res) {
  //   try {

  //     const user_id = req.user._id;

  //     let { shop_id, address_id, car_id, service_id, price, description } = req.body;

  //     if (!shop_id) {
  //       return res.status(400).json({ msg: "please input shop_id." });
  //     }
  //     if (!address_id) {
  //       return res.status(400).json({ msg: "please input address_id." });
  //     }
  //     if (!car_id) {
  //       return res.status(400).json({ msg: "please input car_id." });
  //     }
  //     if (!service_id) {
  //       return res.status(400).json({ msg: "please input service_id." });
  //     }
  //     if (!price) {
  //       return res.status(400).json({ msg: "please input price." });
  //     }
  //     if (price <= 0) {
  //       return res.status(400).json({ msg: "price must be more than 0." });
  //     }

  //     if (
  //       !mongoose.isValidObjectId(car_id) ||
  //       !mongoose.isValidObjectId(shop_id) ||
  //       !mongoose.isValidObjectId(address_id) ||
  //       !mongoose.isValidObjectId(service_id)
  //     ) {
  //       return res.status(404).json({ msg: "Invalid ID" });
  //     }

  //     const service = await ServiceModel.findOne({_id: service_id});
  //     if(!service){
  //       return res.status(404).json({ msg: "This service is not exist." });
  //     }
  //     if(service.price != price){
  //       return res.status(404).json({ msg: "Price is not match." });
  //     }

  //     const order_data = {
  //       user: user_id,
  //       shop: shop_id,
  //       car: car_id,
  //       address: address_id,
  //       service: service_id,
  //       price,
  //       description
  //     };

  //     const order = await OrderModel.create(order_data);

  //     res.status(200).json({ msg: "Add order success.", order});
  //   } catch (err) {
  //     console.log(err);
  //     res.status(404).json({ msg: "Something wrong", err });
  //   }
  // }

  static async addOrder(req, res) {
    try {
      let total = 0,
        desc = "";
      const user_id = req.user._id;
      const order_id = new mongoose.Types.ObjectId();

      let { shop_id, address_id, car_id, totalCost, orderService } = req.body;

      if (!shop_id) {
        return res.status(400).json({ msg: "please input shop_id." });
      }
      if (!address_id) {
        return res.status(400).json({ msg: "please input address_id." });
      }
      // if (!car_id) {
      //   return res.status(400).json({ msg: "please input car_id." });
      // }
      if (!totalCost) {
        return res.status(400).json({ msg: "please input totalCost." });
      }
      if (!orderService || orderService.length <= 0) {
        return res.status(400).json({ msg: "orderService do not has data." });
      }

      if (
        !mongoose.isValidObjectId(car_id) ||
        !mongoose.isValidObjectId(shop_id) ||
        !mongoose.isValidObjectId(address_id)
      ) {
        return res.status(404).json({ msg: "Invalid ID" });
      }

      await orderService.map((val, idx) => {
        if (!mongoose.isValidObjectId(val.service_id)) {
          return (total = -1);
        }
        if (val.price <= 0) {
          return (total = 0);
        }
        total += val.price;
        orderService[idx].order = order_id;
        orderService[idx].service = val.service_id;
        desc += val.description + ", ";
      });

      if (total === 0 || total !== totalCost) {
        return res.status(404).json({ msgg: "Price is not valid." });
      } else if (total <= 0) {
        return res.status(404).json({ msg: "Invalid ID" });
      }

      const order_data = {
        _id: order_id,
        user: user_id,
        shop: shop_id,
        car: car_id,
        address: address_id,
        totalCost: totalCost,
        description: desc,
      };

      const order = await OrderModel.create(order_data);
      const orderDetail = await OrderDetailModel.create(orderService);

      const title = "new order";
      const body = "new order is waiting. please check...";

      const chk = await NotifController.postNotifToShop(
        shop_id,
        user_id,
        title,
        body
      );
      console.log("check Notif", chk);

      res.status(200).json({ msg: "Add order success.", order, orderDetail });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async confirmOrder(req, res) {
    try {
      const order_id = req.params._id;

      if (!order_id) {
        return res.status(400).json({ msg: "order_id can not be null." });
      }
      if (!mongoose.isValidObjectId(order_id)) {
        return res.status(404).json({ msg: "Invalid order ID" });
      }

      const order = await OrderModel.findOneAndUpdate(
        { _id: order_id, status: "order" },
        { status: "going" },
        { new: true }
      );

      await OrderDetailModel.findOneAndUpdate(
        { _id: order_id, status: "order" },
        { status: "going" },
        { new: true }
      );
      if (!order) {
        return res.status(404).json({ msg: "this order is not found." });
      }

      const title = 'order has confirm'
      const body = 'your order has confirm. shop is goging please wait.'

      const chk = await NotifController.postNotifToUser(order.user_id, order.shop_id, title, body)
      console.log('chk ', chk);

      res.status(200).json({ msg: "Confirm Order Complete.", order });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async cancelOrder(req, res) {
    try {
      const { order_id, description } = req.body;

      if (!order_id) {
        return res.status(400).json({ msg: "please input order_id." });
      }
      if (!description) {
        return res.status(400).json({ msg: "please input description." });
      }

      if (!mongoose.isValidObjectId(order_id) || !order_id) {
        return res.status(404).json({ msg: "Invalid ID" });
      }

      const order = await OrderModel.findOneAndUpdate(
        { _id: order_id, status: "order" },
        { description, status: "cancel" },
        { new: true }
      );

      await OrderDetailModel.findOneAndUpdate(
        { _id: order_id, status: "order" },
        { status: "cancel" },
        { new: true }
      );
      if (!order) {
        return res.status(404).json({ msg: "this order not found." });
      }
      res.status(200).json({ msg: "Cancel Order Complete.", order });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  // ============ Order Detail =============
  static async getOrderDetail(req, res) {
    try {
      const order_id = req.params._id;
      if (!order_id) {
        return res.status(400).json({ msg: "order_id can not be null." });
      }
      if (!mongoose.isValidObjectId(order_id)) {
        return res.status(404).json({ msg: "Invalid ID" });
      }

      const orderDetail = await OrderDetailModel.find({
        order: order_id,
      }).populate([
        {
          path: "service",
          select: "tag price description",
          populate: {
            path: 'tag',
            select: 'name category tag_type image'
          }
        },
      ]);
      res.status(200).json({ msg: "Order Detail", orderDetail });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }
}

import mongoose from "mongoose";

import { OrderModel, OrderDetailModel } from "../models/order.model.js";

export default class Model {
  // ========= Order =============
  static async getOrderAll(req, res) {
    try {
      const order = await OrderModel.find({}).populate([
        {
          path: "user",
          select: "firstname lastname tel",
        },
        {
          path: "shop",
          select: "name tel address",
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
      const shop_id = req.params._id;
      const order = await OrderModel.find({ shop: shop_id }).populate([
        {
          path: "user",
          select: "firstname lastname tel",
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
      res.status(200).json({ msg: "Shop Order", order });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async getOrderUser(req, res) {
    try {
      const user_id = req.user._id;
      const order = await OrderModel.find({ user: user_id }).populate([
        {
          path: "shop",
          select: "name tel address",
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
      res.status(200).json({ msg: "User Order", order });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }
  static async addOrder(req, res) {
    try {
      let total = 0,
        desc = "";
      const user_id = req.user._id;
      const order_id = new mongoose.Types.ObjectId();

      let { shop_id, address_id, car_id, totalCost, orderService } = req.body;

      if (!totalCost) {
        return res.status(400).json({ msg: "totalCost field is required." });
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

      res.status(200).json({ msg: "Add order success.", order, orderDetail });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async cancelOrder(req, res) {
    try {
      const { order_id, description } = req.body;

      if (!description) {
        return res.status(400).json({ msg: "description field is required." });
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
      if(!order){
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

      if (!mongoose.isValidObjectId(order_id)) {
        return res.status(404).json({ msg: "Invalid ID" });
      }

      const orderDetail = await OrderDetailModel.find({
        order: order_id,
      }).populate([
        {
          path: "service",
          select: "name category price description",
        },
      ]);
      res.status(200).json({ msg: "User Order", orderDetail });
    } catch (err) {
      res.status(404).json({ msg: "Something wrong", err });
    }
  }
}

import { PaymentModel, InvoiceModel } from "../models/payment.model.js";
import { OrderDetailModel, OrderModel } from "../models/order.model.js";
import mongoose from "mongoose";
import NotifController from "./notification.controller.js";

export default class Payment {
  static async getAllPayment(req, res) {
    try {
      const payment = await PaymentModel.find({})
        .populate({
          path: "order",
          model: "Order",
          select: "shop user ",
          populate: [
            {
              path: "shop",
              model: "Shop",
              select: "shop name phone",
            },
            {
              path: "user",
              model: "User",
              select: "firstname lastname",
            },
          ],
        })
        .sort({ _id: -1 });
      res.status(200).json({ msg: "Get All Payment", payment });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async getShopPayment(req, res) {
    try {
      let shop_id = req.params._id;
if(!shop_id){
  return res.status(404).json({ msg: "shop_id can not be null." });
}
      if (!mongoose.isValidObjectId(shop_id))
        return res.status(404).json({ msg: "Invalid ID" });

      const payment = await PaymentModel.find({})
        .populate({
          path: "order",
          model: "Order",
          match: {
            shop: shop_id,
          },
          select: "user",
          populate: {
            path: "user",
            model: "User",
            select: "firstname lastname",
          },
        })
        .sort({ _id: -1 });
      res.status(200).json({
        msg: "Get Shop Payment",
        payment: payment.filter((val) => val.order !== null),
      });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async confirmPayment(req, res) {
    try {
      const { order_id, payBy, totalCost } = await req.body;
      if(!order_id){
        return res.status(404).json({ msg: "please input order_id." });
      }
      if(!totalCost){
        return res.status(404).json({ msg: "please input totalCost." });
      }
      if (!payBy) {
        return res.status(400).json({ msg: "please input payBy." });
      }
      if (!mongoose.isValidObjectId(order_id) || !order_id) {
        return res.status(404).json({ msg: "Invalid ID: " + order_id });
      }

      const checkOrder = await OrderModel.findOne({
        _id: order_id,
        status: "goging",
      });

      if (!checkOrder) {
        return res.status(404).json({ msg: "This order do not exist." });
      }
      if (totalCost != checkOrder.totalCost) {
        return res
          .status(404)
          .json({
            msg: "Pay cost is not match. totalCost is:" + checkOrder.totalCost,
          });
      }

      let payment_data = {
        order: order_id,
        payBy: payBy,
        totalCost: checkOrder.totalCost,
      };

      let invoice_data = {
        order: order_id,
        totalCost: checkOrder.totalCost,
      };

      if (payBy === "cash") {
        invoice_data.status = "cash";
      } else if (payBy === "transfer") {
        invoice_data.status = "payment";
      } else {
        return res.status(404).json({ msg: "Invalid payBy value: " + payBy });
      }

      await InvoiceModel.create(invoice_data);
      await PaymentModel.create(payment_data);
      const order = await OrderModel.findOneAndUpdate(
        { _id: order_id },
        { status: "paid" },
        {new:true}
      );
      await OrderDetailModel.updateMany(
        { order: order_id },
        { status: "paid" },
        {new:true}

      );

      res.status(201).json({ msg: "Confirm Payment Success...", order });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async cancelPayment(req, res) {
    try {
      const { payment_id, description } = await req.body;

      const payment = await PaymentModel.findOneAndUpdate(
        { _id: payment_id },
        { status: "cancel", description },
        { new: true }
      );

      const order_id = payment.order;

      await InvoiceModel.findOneAndUpdate(
        { _id: order_id },
        { status: "cancel" },
        { new: true }
      );

      await OrderModel.findOneAndUpdate(
        { _id: order_id },
        { status: "cancel" }
      );

      await OrderDetailModel.updateMany(
        { order: order_id },
        { status: "cancel" }
      );

      res.status(201).json({ msg: "Cancel Payment Success." });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  // ================== Invoid ===================
  static async getInvoiceAll(req, res) {
    try {
      const invoice = await InvoiceModel.find({})
        .populate({
          path: "order",
          model: "Order",
          select: "shop",
          populate: {
            path: "shop",
            model: "Shop",
            select: "shop name phone",
          },
        })
        .sort({ _id: -1 });
      res.status(200).json({ msg: "Get All Invoice.", invoice });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async getInvoiceShop(req, res) {
    try {
      let shop_id = req.params._id;

      if (!mongoose.isValidObjectId(shop_id))
        return res.status(404).json({ msg: "Invalid ID" });

      const invoice = await InvoiceModel.find({ status: "payment" })
        .populate({
          path: "order",
          model: "Order",
          match: {
            shop: shop_id,
          },
          select: "shop",
        })
        .sort({ _id: -1 });

      const inv = invoice.filter((val)=> val.order == null);

      res.status(200).json({ msg: "Get Shop Invoice.", invoice });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async requestTransfer(req, res) {
    try {
      let shop_id = req.params._id;
      let title = "Requet For Transfer Money of shop: " + shop_id;
      let body = "Invoice id: ";
      let totalCost = 0;

      if (!mongoose.isValidObjectId(shop_id))
        return res.status(404).json({ msg: "Invalid ID" });

      const invoice_data = await InvoiceModel.find({
        status: "payment",
      }).populate({
        path: "order",
        model: "Order",
        match: {
          shop: shop_id,
        },
        select: "shop",
        populate: {
          path: "shop",
          select: "name phone",
        },
      });

      await invoice_data.map((val) => {
        body += val._id + ", ";
        totalCost += val.totalCost;
      });

      const shop_name = invoice_data[0].order.shop.name;

      title += `, Shop Name: ${shop_name}, TotalCost: ${totalCost} Kip`;

      req.body = { ...req.body, title, body, for: "admin" };

      await NotifController.postNotif(req, res);
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }

  static async confirmTransfer(req, res) {
    try {
      let shop_id = req.params._id;
      let title = "To Shop: " + shop_id;
      let body = "Invoice id: ";
      let totalCost = 0;

      if (!mongoose.isValidObjectId(shop_id))
        return res.status(404).json({ msg: "Invalid ID" });

      const invoice_data = await InvoiceModel.find({
        status: "payment",
      }).populate({
        path: "order",
        model: "Order",
        match: {
          shop: shop_id,
        },
        select: "shop",
        populate: {
          path: "shop",
          select: "name phone",
        },
      });

      if (!invoice_data || invoice_data.length <= 0) {
        return res.status(404).json({ msg: "This shop is not any invoice. " });
      }

      await invoice_data.map(async (val) => {
        body += val._id + ", ";
        totalCost += val.totalCost;

        await InvoiceModel.findOneAndUpdate(
          { _id: val._id, status: "payment" },
          { status: "transferred" },
          { new: true }
        );
        await PaymentModel.findOneAndUpdate(
          { order: val.order, status: "payment" },
          { status: "transferred" },
          { new: true }
        );
      });

      const shop_name = invoice_data[0].order.shop.name;

      title += `, Name: ${shop_name}, I have transferred money for TotalCost: ${totalCost} Kip to your bank account successfully.`;

      req.body = { ...req.body, shop: shop_id, title, body, for: "shop" };

      await NotifController.postNotif(req, res);
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something wrong", err });
    }
  }
}

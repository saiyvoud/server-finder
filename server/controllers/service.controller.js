import mongoose from "mongoose";
import ServiceModel from "../models/service.model.js";
import ShopModel from "../models/shop.model.js";
import TagModel from "../models/tag.model.js";
import UploadImage from "../utils/uploadImage.js";

export default class Service {
  static async getServiceAll(req, res) {
    try {
      const service = await ServiceModel.find({})
        .populate([
          {
            path: "shop",
            select: "name phone address location openTime closeTime",
            model: "Shop",
          },
          {
            path: "tag",
            select: "name category tag_type image",
          },
        ])
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

      const service = await ServiceModel.find({ shop: _id, isDelete:false })
        .populate({
          path: "tag",
          select: "name category tag_type image",
        })
        .sort({
          _id: -1,
        });

      service.length > 0
        ? res.status(200).json({ msg: `all your shop's services.`, service })
        : res.status(200).json({ msg: "you do not have any service." });
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

      const service = await ServiceModel.findOne({ _id }).populate([
        {
          path: "shop",
          select: "name phone address location openTime closeTime",
          model: "Shop",
        },
        {
          path: "tag",
          select: "name category tag_type image",
        },
      ]);
      res.status(200).json({ service });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }

  static async postService(req, res) {
    try {
      // let { shop_id, name, category, price, description, imgUrl } = req.body;
      let { shop_id, tag_id, price, description } = req.body;

      // if (!name) {
      //   return res.status(400).json({ msg: "please input name." });
      // }
      // if (!category) {
      //   return res.status(400).json({ msg: "please input category." });
      // }
      // if (!price) {
      //   return res.status(400).json({ msg: "please input price." });
      // }

      if (price <= 10000) {
        return res.status(400).json({ msg: "price must be more then 10000." });
      }


      // if (!description) {
      //   return res.status(400).json({ msg: "please input description." });
      // }

      if (!mongoose.isValidObjectId(shop_id))
        return res.status(400).json({ msg: `Invalid id: ${shop_id}` });
      if (!mongoose.isValidObjectId(tag_id))
        return res.status(400).json({ msg: `Invalid id: ${tag_id}` });

      const tag = await TagModel.findById(tag_id);
      if (!tag) return res.status(400).json({ msg: `Not found this tag.` });

      const shop = await ShopModel.findOne({
        _id: shop_id,
        category: tag.category,
      });
      
      if (!shop) {
        return res
          .status(400)
          .json({ msg: `category is not match with your shop's category.` });
      }

      const chkService = await ServiceModel.findOne({
        shop: shop_id,
        tag: tag_id,
        isDelete: false
      });

      if (chkService) {
        return res.status(400).json({ msg: `this service is already exist.` });
      }

      // await ServiceModel.findOneAndDelete({
      //   shop: shop_id,
      //   tag: tag_id,
      //   isDelete: true
      // });

      const data = {
        shop: shop_id,
        tag: tag_id,
        price,
        description,
      };
      const service = await ServiceModel.create(data);
      res.status(201).json({ msg: "Create service complete", service });
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Something Wrong.", err });
    }
  }

  static async updateService(req, res) {
    try {
      let { service_id, price, description } = req.body;

      if (!price) {
        return res.status(400).json({ msg: "please input price." });
      }
      if (price <= 0) {
        return res.status(400).json({ msg: "price must be more then 0." });
      }
      if (!mongoose.isValidObjectId(service_id))
        return res.status(400).json({ msg: `Invalid id: ${service_id}` });

      const data = { price, description };

      const service = await ServiceModel.findByIdAndUpdate(
        { _id: service_id },
        { $set: data },
        { new: true }
      );
      if (!service)
        return res.status(400).json({ msg: `Invalid id: ${service_id}` });
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

      await ServiceModel.findOneAndUpdate(
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

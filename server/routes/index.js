import express from "express";
import formidable from 'express-formidable'

// ================ import controller ================
import UserController from "../controllers/user.controller.js";
import ShopController from "../controllers/shop.controller.js";
import ServiceController from "../controllers/service.controller.js";
import AddressController from "../controllers/address.controller.js";
import CarController from "../controllers/car.controller.js";
import FollowController from "../controllers/follow.controller.js";
import ImageController from "../controllers/uploadImage.controller.js";

// ================ import middleware ================
import { auth } from "../middlewares/auth.js";
import { admin } from "../middlewares/admin.js";
import { shopkeeper } from "../middlewares/shopkeeper.js";

const route = express.Router();

// =================== User Routes ===================
route.get("/users", auth, admin, UserController.userAll);
route.get("/user-info", auth, UserController.userInfo);
route.get("/user/:user_id", UserController.userOne);
route.post("/user/sign-up", UserController.signUp);
route.post("/user/login", UserController.logIn);
route.post("/upgrade-user/:_id", auth, admin, UserController.upgradeUser);

//Upload Image
route.post('/user/upload-image', auth, formidable(), ImageController.uploadUserImage)
route.post('/shop/upload-image/:_id', auth, formidable(), ImageController.uploadShopImage)
route.post('/service/upload-image/:_id', auth, formidable(), ImageController.uploadServiceImage)

// ================== Shop ============================
route.get("/shops", ShopController.AllShop);
route.get("/shop/owner", auth, shopkeeper, ShopController.OwnShop);
route.post("/shop", auth, shopkeeper, ShopController.createShop);
route.put("/shop", auth, shopkeeper, ShopController.updateShop);
route.delete("/shop/:shop_id", auth, admin, ShopController.deleteShop);

// ================== Service =====================
route.get("/services", ServiceController.getServiceAll);
route.get("/service/:_id", ServiceController.getServiceById);
route.get("/service/shop/:shop_id", ServiceController.getServiceShop);
route.post("/service", auth, shopkeeper, ServiceController.postService);
route.put("/service", auth, shopkeeper, ServiceController.updateService);
route.delete(
  "/service/:_id",
  auth,
  shopkeeper,
  ServiceController.deleteService
);

// ================== Address ==================
route.get("/addresses", AddressController.getAddressAll);
route.get("/address/:_id",  AddressController.getAddressOne);
route.post("/address", auth, AddressController.createAddress);

// ================== Car ==================
route.get("/car", auth, CarController.userCar);
route.post("/car", auth, CarController.createCar);
route.put("/car", auth, CarController.updateCar);
route.delete("/car/:_id", auth, CarController.deleteCar);

// ================== Follow ================
route.get("/follow", auth, FollowController.getFollow);
route.post("/follow/:_id", auth, FollowController.followShop);
route.delete("/unfollow/:_id", auth, FollowController.unFollow);

export default route;

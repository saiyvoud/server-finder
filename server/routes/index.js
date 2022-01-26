import express from "express";
import formidable from "express-formidable";

// ================ import controller ================
import UserController from "../controllers/user.controller.js";
import ShopController from "../controllers/shop.controller.js";
import ServiceController from "../controllers/service.controller.js";
import AddressController from "../controllers/address.controller.js";
import CarController from "../controllers/car.controller.js";
import FollowController from "../controllers/follow.controller.js";
import ImageController from "../controllers/uploadImage.controller.js";
import ReviewController from "../controllers/review.controller.js";
import ReportController from "../controllers/report.controller.js";
import BannerController from "../controllers/banner.controller.js";
import OrderController from "../controllers/order.controller.js";
import PaymentController from "../controllers/payment.controller.js";
import NotifController from "../controllers/notification.controller.js";

// ================ import middleware ================
import { auth } from "../middlewares/auth.js";
import { admin } from "../middlewares/admin.js";
import { shopkeeper } from "../middlewares/shopkeeper.js";

const route = express.Router();

// =================== User Routes ===================
route.get("/users", auth, UserController.userAll);
route.get("/user-info", auth, UserController.userInfo);
route.get("/user/:user_id", UserController.userOne);
route.post("/user/sign-up", UserController.signUp);
route.post("/user/login", UserController.logIn);
route.post("/upgrade-user/:_id", auth, UserController.upgradeUser);

//Upload Image
route.post("/user/upload-image", auth, ImageController.uploadUserImage);
route.post("/shop/upload-image", auth, ImageController.uploadShopImage);
route.post("/shop/upload-cover-image", auth, ImageController.uploadShopCoverImage);
route.post("/service/upload-image", auth, ImageController.uploadServiceImage);

// ================== Shop ============================
route.get("/shops", ShopController.AllShop);
route.get("/shop/owner", auth, shopkeeper, ShopController.OwnShop);
route.post("/shop", auth, ShopController.createShop);
route.put("/shop", auth, shopkeeper, ShopController.updateShop);
route.delete("/shop/:shop_id", auth, ShopController.deleteShop);

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
route.get("/address/:_id", AddressController.getAddressOne);
route.post("/address", auth, AddressController.createAddress);

// ================== Car ==================
route.get("/car", auth, CarController.userCar);
route.post("/car", auth, CarController.createCar);
route.put("/car", auth, CarController.updateCar);
route.delete("/car/:_id", auth, CarController.deleteCar);

// ================== Follow ================
route.get("/follow/shop/:_id", auth, FollowController.getFollowShop);
route.get("/follow/user", auth, FollowController.getFollowUser);
route.post("/follow/:_id", auth, FollowController.followShop);
route.delete("/unfollow/:_id", auth, FollowController.unFollow);

// ================== Review ====================
route.get("/review/:_id", auth, ReviewController.getShopReview);
route.get("/review-user", auth, ReviewController.getUserReview);
route.post("/review", auth, ReviewController.addReview);

// ================== Report ====================
route.get("/reports", auth, ReportController.getAllReport);
route.get("/report/:_id", auth, shopkeeper, ReportController.getShopReport);
route.get("/report-user", auth, ReportController.getUserReport);
route.post("/report", auth, ReportController.addReport);
route.put("/report", auth, ReportController.updateReport);
route.delete("/report/:_id", auth, ReportController.unReport);

// ==================== Banner ====================
route.get("/banner", auth, BannerController.getAllBanner);
route.post("/banner", auth, BannerController.createBanner);
route.put("/banner", auth, BannerController.updateBanner);
route.delete("/banner/:_id", auth, BannerController.deleteBanner);

// ==================== Order ====================
route.get("/orders", auth, OrderController.getOrderAll);
route.get("/order/user", auth, OrderController.getOrderUser);
route.get("/order/shop/:_id", auth, shopkeeper, OrderController.getOrderShop);
route.post("/order", auth, OrderController.addOrder);
route.delete("/order", auth, OrderController.cancelOrder);
// =================== Order Detail =====================
route.get("/order-detail/:_id", auth, OrderController.getOrderDetail);

// ==================== Payment ====================
route.get("/payments", auth, PaymentController.getAllPayment);
route.get(
  "/payment/shop/:_id",
  auth,
  shopkeeper,
  PaymentController.getShopPayment
);
route.post("/payment", auth, PaymentController.confirmPayment);
route.delete("/payment", auth, PaymentController.cancelPayment);
//===================== Invoice =====================
route.get("/invoices", auth, PaymentController.getInvoiceAll);
route.get(
  "/invoice/shop/:_id",
  auth,
  shopkeeper,
  PaymentController.getInvoiceShop
);
route.post(
  "/transfer/request/:_id",
  auth,
  shopkeeper,
  PaymentController.requestTransfer
);
route.post(
  "/transfer/confirm/:_id",
  auth,
  shopkeeper,
  PaymentController.confirmTransfer
);

// ================== Notification ====================
route.get("/notifications", auth, NotifController.NotifAll);
route.get("/notification/admin", auth, NotifController.NotifAdmin);
route.get(
  "/notification/shop/:_id",
  auth,
  shopkeeper,
  NotifController.NotifShop
);
route.get("/notification/user", NotifController.NotifUser);
route.post("/notification", auth, NotifController.postNotif);
route.put("/notification", auth, NotifController.updateNotif);
route.delete("/notification/:_id", auth, NotifController.removeNotif);

export default route;

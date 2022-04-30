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
import TagController from "../controllers/tag.controller.js";
import MenuController from "../controllers/menu.controller.js";
import UpdateController from "../controllers/update.controller.js";

// ================ import middleware ================
import { auth } from "../middlewares/auth.js";
import { admin } from "../middlewares/admin.js";
import { shopkeeper } from "../middlewares/shopkeeper.js";

const route = express.Router();

// =================== User Routes ===================
route.get("/users", auth, admin, UserController.userAll);
route.get("/user-info", auth, UserController.userInfo);
route.get("/user/:user_id", auth, admin, UserController.userOne);
route.post("/user/sign-up", UserController.signUp);
route.post("/user/login", UserController.logIn);
route.post("/user/sign-up/general", UserController.registerUser);
route.post("/user/login/general", UserController.logInUser);
route.post("/user/login/admin", UserController.logInAdmin);
route.post("/user/logout", auth, UserController.logOut);
route.put("/user/update", auth, UserController.updateUser);
route.post("/upgrade-user/:_id", auth, admin, UserController.upgradeUser);
route.put("/user/edit-password", auth, UserController.editPassword);
route.put("/user/forgot-password", UserController.forgotPassword);
route.put("/user/forgot-password/general", UserController.forgotPasswordUser);

//Upload Image
route.put("/user/upload-image", auth, ImageController.uploadUserImage);
route.put(
  "/shop/upload-image",
  auth,
  shopkeeper,
  ImageController.uploadShopImage
);
route.put(
  "/shop/upload-cover-image",
  auth,
  ImageController.uploadShopCoverImage
);
route.put(
  "/service/upload-image",
  shopkeeper,
  auth,
  ImageController.uploadServiceImage
);

// ================== Shop ============================
route.get("/shops", ShopController.AllShop);
route.get("/shops/test", ShopController.locTest);
route.get("/shop/owner", auth, shopkeeper, ShopController.OwnShop);
route.post("/shop", auth, ShopController.createShop);
route.put("/shop", auth, shopkeeper, ShopController.updateShop);
route.delete("/shop/:shop_id", auth, shopkeeper, ShopController.deleteShop);
route.get("/non-active-shop", auth, admin, ShopController.NonActiveShop);
route.put("/active-shop/:shop_id", auth, admin, ShopController.activeShop);

// ================== Bank account ==========================
route.post("/bank", auth, shopkeeper, ShopController.createBank);
route.put("/bank", auth, shopkeeper, ShopController.updateBank);
route.delete("/bank/:_id", auth, shopkeeper, ShopController.deleteBank);

// ================== Tag ==========================
route.get("/tags", /*auth, shopkeeper,*/ TagController.getAllTag);
route.get("/tag/shop/:category", /*auth, shopkeeper,*/ TagController.getShopTag);
route.post("/tag", /*auth, admin,*/ TagController.addTag);
route.put("/tag", /*auth, admin,*/ TagController.updateTag);
route.delete("/tag/:_id", /*auth, admin,*/ TagController.deleteTag);

// ================== Menu =====================
route.get("/menus", auth,  MenuController.getAllMenu);
route.post("/menu", auth,  MenuController.addMenu);
route.put("/menu", auth, admin, MenuController.updateMenu);
route.delete("/menu/:_id", auth, MenuController.deleteMenu);
// ================== Service =====================
route.get("/services", ServiceController.getServiceAll);
route.get("/service/by_menu", ServiceController.getServiceByMenu);
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
route.get("/banner", auth, admin, BannerController.getAllBanner);
route.post("/banner", auth, admin, BannerController.createBanner);
route.put("/banner", auth, admin, BannerController.updateBanner);
route.delete("/banner/:_id", auth, admin, BannerController.deleteBanner);

// ==================== Order ====================
route.get("/orders/:status", auth, admin, OrderController.getOrderAll);
route.get("/order/user/:status", auth, OrderController.getOrderUser);
route.get(
  "/order/shop/:shop_id/:status",
  auth,
  shopkeeper,
  OrderController.getOrderShop
);
route.post("/order", auth, OrderController.addOrder);
route.delete("/order", auth, OrderController.cancelOrder);
route.post(
  "/order/confirm/:_id",
  auth,
  shopkeeper,
  OrderController.confirmOrder
);

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
  admin,
  PaymentController.confirmTransfer
);

// ================== Notification ====================
route.get("/notifications", auth, admin, NotifController.NotifAll);
route.get("/notification/admin", auth, admin, NotifController.NotifAdmin);
route.get(
  "/notification/shop/:_id",
  auth,
  shopkeeper,
  NotifController.NotifShop
);

route.get("/notification/user", auth, NotifController.NotifUser);
route.post("/notification", auth, NotifController.postNotif);
route.post("/notification/to-admin", auth, NotifController.postNotifToAddmin);
route.post("/notification/to-shop", auth, NotifController.postNotifToShop);
route.post("/notification/to-user", auth, NotifController.postNotifToUser);
route.put("/notification", auth, NotifController.updateNotif);
route.delete("/notification/:_id", auth, NotifController.removeNotif);

route.get("/all-update-versions", auth, admin, UpdateController.AllUpdate);
route.get("/last-update-version", auth, admin, UpdateController.LastUpdate);
route.post("/update-version", auth, admin, UpdateController.NewUpdate);
route.delete("/update-version/:update_id", auth, admin, UpdateController.RemoveUpdate);

export default route;

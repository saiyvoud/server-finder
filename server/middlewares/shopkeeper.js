import mongoose from "mongoose";

const shopkeeper = (req, res, next) => {
  if (req.user.auth === "admin" || req.user.auth === "shopkeeper")
    return next();
  else
    return res
      .status(400)
      .json({
        msg: "You are not allowed, get out now.",
        shop: null,
      });
};

export { shopkeeper };
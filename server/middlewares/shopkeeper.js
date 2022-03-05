import mongoose from "mongoose";

const shopkeeper = (req, res, next) => {
  const obj_id = new mongoose.Types.ObjectId();
  if (req.user.auth === "admin" || req.user.auth === "shopkeeper")
    return next();
  else
    return res
      .status(400)
      .json({
        msg: "You are not allowed, get out now.",
        shop: { _id: obj_id, isActive: false },
      });
};

export { shopkeeper };

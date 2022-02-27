const admin = (req, res, next) => {
  if (req.user.auth !== "admin")
    return res
      .status(400)
      .json({ isAuth: false, msg: "You are not allowed, get out now." });
  next();
};

export { admin };

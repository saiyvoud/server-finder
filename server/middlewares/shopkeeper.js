const shopkeeper = (req, res, next) => {
  if (req.user.auth === "admin" || req.user.auth === "shopkeeper")
    return next();
  else return res.send("You are not allowed, get out now.");
};

export { shopkeeper };

import { auth } from "../middlewares/auth.js";
import { User } from "../models/user.model.js";

class UserController {
  static async userAll(req, res) {
    try {
      const user = await User.find({});
      res.status(200).json({ success: true, user });
    } catch (err) {
      res.status(500).json({ msg: "Something went wrong", err });
    }
  }

  static async userInfo(req, res) {
    try {
      res.status(200).json({
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        username: req.user.username,
        email: req.user.email,
        phone: req.user.phone,
        image: req.user.image,
        isAdmin: req.user.auth==='admin' ? true: false
      });
    } catch (err) {
      res.status(500).json({ msg: "Something went wrong", err });
    }
  }

  static async userOne(req, res) {
    try {
      const _id = req.params.user_id;
      const user = await User.findOne({ _id });
      res.status(200).json({ success: true, user });
    } catch (err) {
      res.status(500).json({ msg: "Something went wrong", err });
    }
  }

  static async signUp(req, res) {

    let { firstname, lastname, username, email, password, phone } = req.body;
    // let phone = "+85620" + user_data.phone.substr(user_data.phone.length - 8, 8);
    try {
      //   const userNew = new User({...user_data, phone});
      const userNew = new User({
        firstname,
        lastname,
        username,
        email,
        password,
        phone,
      });
      const user = await userNew.save();
      res.status(201).json({ success: true, user });
    } catch (err) {
      console.log("err "+err)
      res.status(500).json({ msg: "Something went wrong", err });
    }
  }

  static async logIn(req, res) {
    try {
      const { username, email, password } = req.body;

      let user = await User.findOne({ email });
      if (username) {
        user = await User.findOne({ username });
      }

      if (!user)
        return res
          .status(404)
          .json({ msg: "Invalidn username, email or password" });

      user.comparePassword(password, (err, isMatch) => {
        if (!isMatch)
          return res
            .status(404)
            .json({ msg: "Invalid username, email or password" });
        user.generateToken((err, user) => {
          if (err) return res.status(404).json({ err });
          res.cookie("g_auth", user.token).json({ msg: "Login Complete" });
        });
      });
    } catch (err) {
      res.status(400).json({ msg: "Something Wrong." });
    }
  }

  static async upgradeUser(req, res){
    try {
      const _id = req.params._id;
      await User.findByIdAndUpdate(_id, {auth:'shopkeeper'}, {new:true});
      res.status(200).json({msg: "Upgrade user to shopkeeper"})
    } catch (err) {
      res.status(400).json({ msg: "Something Wrong." });      
    }
  }
}

export default UserController;

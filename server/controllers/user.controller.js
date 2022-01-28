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
        isAdmin: req.user.auth === "admin" ? true : false,
      });
    } catch (err) {
      res.status(500).json({ msg: "Something went wrong", err });
    }
  }

  static async userOne(req, res) {
    try {
      const _id = req.params.user_id;
      if (!_id) {
        return res.status(400).json({ msg: "user_id can not be null." });
      }
      const user = await User.findOne({ _id });
      res.status(200).json({ success: true, user });
    } catch (err) {
      res.status(500).json({ msg: "Something went wrong", err });
    }
  }

  static async signUp(req, res) {
    let { firstname, lastname, password, phone } = req.body;
    if (!firstname) {
      return res.status(400).json({ msg: "please input firstname." });
    }
    if (!lastname) {
      return res.status(400).json({ msg: "please input lastname." });
    }
    // if (!username) {
    //   return res.status(400).json({ msg: "please input username." });
    // }
    if (!password) {
      return res.status(400).json({ msg: "please input password." });
    }
    if (!phone) {
      return res.status(400).json({ msg: "please input phone ." });
    }

    // let phone = "+85620" + user_data.phone.substr(user_data.phone.length - 8, 8);
    try {
      const chkExist = await User.findOne({ phone });

      if (chkExist) {
        return res
          .status(400)
          .json({ msg: "this phone number is already exist." });
      }

      const userNew = new User({
        firstname,
        lastname,
        // username,
        password,
        phone,
      });

      const user = await userNew.save();
      res.status(201).json({ success: true, user });
    } catch (err) {
      console.log("err " + err);
      res.status(500).json({ msg: "Something went wrong", err });
    }
  }

  // static async signUpShop(req, res) {

  //   let { firstname, lastname, username, password, phone } = req.body;

  //   // let phone = "+85620" + user_data.phone.substr(user_data.phone.length - 8, 8);
  //   try {
  //     //   const userNew = new User({...user_data, phone});
  //     const userNew = new User({
  //       firstname,
  //       lastname,
  //       username,
  //       email,
  //       password,
  //       phone,
  //     });
  //     const user = await userNew.save();
  //     res.status(201).json({ success: true, user });
  //   } catch (err) {
  //     console.log("err "+err)
  //     res.status(500).json({ msg: "Something went wrong", err });
  //   }
  // }

  static async logIn(req, res) {
    try {
      const { phone, password } = req.body;
      if (!phone) {
        return res.status(400).json({ msg: "please input phone." });
      }
      if (!password) {
        return res.status(400).json({ msg: "please input password." });
      }
      let user = await User.findOne({ phone });

      if (!user)
        return res
          .status(404)
          .json({ msg: "Invalid username, phone or password" });

      user.comparePassword(password, (err, isMatch) => {
        if (!isMatch)
          return res
            .status(404)
            .json({ msg: "Invalid username, phone or password" });
        user.generateToken((err, user) => {
          if (err) return res.status(404).json({ err });

          // res.cookie("g_auth", user.token).json({ msg: "Login Complete", token: user.token });
          res.status(200).json({ msg: "Login Complete", token: user.token });
        });
      });
    } catch (err) {
      res.status(400).json({ msg: "Something Wrong." });
    }
  }

  static async upgradeUser(req, res) {
    try {
      const _id = req.params._id;

      if (!_id) {
        return res.status(400).json({ msg: "user_id can not be null." });
      }

      await User.findByIdAndUpdate(_id, { auth: "shopkeeper" }, { new: true });
      res.status(200).json({ msg: "Upgrade user to shopkeeper" });
    } catch (err) {
      res.status(400).json({ msg: "Something Wrong." });
    }
  }
}

export default UserController;

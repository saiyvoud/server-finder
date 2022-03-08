import bcryptjs from "bcryptjs";
import { User } from "../models/user.model.js";
import UploadImage from "../utils/uploadImage.js";

const SALT_I = process.env.SALT;

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
        _id: req.user._id,
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
    let { firstname, lastname, password, phone, imgFile } = req.body;
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

      if (imgFile) {
        var imgUrl = await UploadImage(imgFile);
      }
      
      const userNew = new User({
        firstname,
        lastname,
        // username,
        password,
        phone,
        image: imgUrl
      });

      const user = await userNew.save();
      res.status(201).json({ success: true, user });
    } catch (err) {
      console.log("err " + err);
      res.status(500).json({ msg: "Something went wrong", err });
    }
  }
  static async registerUser(req, res) {
    let { firstname, lastname, password, phone } = req.body;
    if (!firstname) {
      return res.status(400).json({ msg: "please input firstname." });
    }
    if (!lastname) {
      return res.status(400).json({ msg: "please input lastname." });
    }
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
        phone
      });

      const user = await userNew.save();
      res.status(201).json({ success: true, msg: 'Register user complete.', user });
    } catch (err) {
      console.log("err " + err);
      res.status(500).json({ msg: "Something went wrong", err });
    }
  }

  static async updateUser(req, res) {
    try {
      let { firstname, lastname } = req.body;
      if (!firstname) {
        return res.status(400).json({ msg: "please input firstname." });
      }
      if (!lastname) {
        return res.status(400).json({ msg: "please input lastname." });
      }
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { firstname, lastname },
        { new: true }
      );

      res.status(201).json({ msg: "update complete.", user });
    } catch (err) {
      res.status(500).json({ msg: "Something went wrong", err });
    }
  }

  static async logIn(req, res) {
    try {
      const { phone, password, mobile_token } = req.body;
      if (!phone) {
        return res.status(400).json({ msg: "please input phone." });
      }
      if (!password) {
        return res.status(400).json({ msg: "please input password." });
      }
      if (!mobile_token) {
        return res.status(400).json({ msg: "please input mobile_token." });
      }

      let user = await User.findOneAndUpdate({ phone }, {mobile_token}, {new:true});

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
  static async logInUser(req, res) {
    try {
      const { phone, password, mobile_token } = req.body;
      if (!phone) {
        return res.status(400).json({ msg: "please input phone." });
      }
      if (!password) {
        return res.status(400).json({ msg: "please input password." });
      }
      if (!mobile_token) {
        return res.status(400).json({ msg: "please input mobile_token." });
      }

      let user = await User.findOneAndUpdate({ phone, auth: 'general' }, {mobile_token}, {new:true});

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

          res.status(200).json({ msg: "Login Complete", token: user.token });
        });
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: "Something Wrong." });
    }
  }

  static async logOut(req, res) {
    try {
      await User.findByIdAndUpdate(req.user._id, { token: "" }, { new: true });
      res.status(200).json({ msg: "Log Out ..." });
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: "Something Wrong." });
    }
  }

  static async editPassword(req, res) {
    try {
      const user_id = req.user._id;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword) {
        return res.status(400).json({ msg: "Please input oldPassword." });
      }
      if (!newPassword) {
        return res.status(400).json({ msg: "Please input newPassword." });
      }

      const user = await User.findOne({ _id: user_id });
      user.comparePassword(oldPassword, async (err, isMatch) => {
        if (err) return res.status(400).json({ msg: "Invalid Password.", err });
        if (!isMatch) return res.status(400).json({ msg: "Invalid Password." });
        const salt = await bcryptjs.genSalt(parseInt(SALT_I));
        const pwd = await bcryptjs.hash(newPassword, salt);
        const user = await User.findByIdAndUpdate(
          user_id,
          { password: pwd },
          { new: true }
        );
        res.status(200).json({ msg: "Update Password success.", user });
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: "Something Wrong.", err });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { newPassword, phone } = req.body;
      if (!phone) {
        return res.status(400).json({ msg: "Please input phone." });
      }
      if (!newPassword) {
        return res.status(400).json({ msg: "Please input newPassword." });
      }
      const salt = await bcryptjs.genSalt(parseInt(SALT_I));
      const pwd = await bcryptjs.hash(newPassword, salt);
      const user = await User.findOneAndUpdate(
        { phone },
        { password: pwd },
        { new: true }
      );

      if(!user) {
        return res.status(400).json({ msg: "your phone number is not exist." });
      }

      res.status(200).json({ msg: "Update password success.", user });
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: "Something Wrong.", err });
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

  // static async signUpShop(req, res) {
  //   let { firstname, lastname, password, phone, imgFile } = req.body;
  //   if (!firstname) {
  //     return res.status(400).json({ msg: "please input firstname." });
  //   }
  //   if (!lastname) {
  //     return res.status(400).json({ msg: "please input lastname." });
  //   }
  //   // if (!username) {
  //   //   return res.status(400).json({ msg: "please input username." });
  //   // }
  //   if (!password) {
  //     return res.status(400).json({ msg: "please input password." });
  //   }
  //   if (!phone) {
  //     return res.status(400).json({ msg: "please input phone ." });
  //   }

  //   // let phone = "+85620" + user_data.phone.substr(user_data.phone.length - 8, 8);
  //   try {
  //     const chkExist = await User.findOne({ phone });

  //     if (chkExist) {
  //       return res
  //         .status(400)
  //         .json({ msg: "this phone number is already exist." });
  //     }

  //     if (imgFile) {
  //       var imgUrl = await UploadImage(imgFile);
  //     }

  //     const userNew = new User({
  //       firstname,
  //       lastname,
  //       // username,
  //       password,
  //       phone,
  //       image: imgUrl,
  //       auth: "shopkeeper"
  //     });

  //     const user = await userNew.save();
  //     res.status(201).json({ success: true, user });
  //   } catch (err) {
  //     console.log("err " + err);
  //     res.status(500).json({ msg: "Something went wrong", err });
  //   }
  // }

  // static async logInShop(req, res) {
  //   try {
  //     const { phone, password } = req.body;
  //     if (!phone) {
  //       return res.status(400).json({ msg: "please input phone." });
  //     }
  //     if (!password) {
  //       return res.status(400).json({ msg: "please input password." });
  //     }

  //     let user = await User.findOne({ phone, auth: "skopkeeper" });

  //     if (!user)
  //       return res
  //         .status(404)
  //         .json({ msg: "Invalid username, phone or password" });

  //     user.comparePassword(password, (err, isMatch) => {
  //       if (!isMatch)
  //         return res
  //           .status(404)
  //           .json({ msg: "Invalid username, phone or password" });
  //       user.generateToken((err, user) => {
  //         if (err) return res.status(404).json({ err });

  //         // res.cookie("g_auth", user.token).json({ msg: "Login Complete", token: user.token });
  //         res.status(200).json({ msg: "Login Complete", token: user.token });
  //       });
  //     });
  //   } catch (err) {
  //     res.status(400).json({ msg: "Something Wrong." });
  //   }
  // }
}

export default UserController;

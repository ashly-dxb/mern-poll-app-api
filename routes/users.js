const User = require("../models/user");

const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const salt = 10;

/* Check auth in each page access */
verifyUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ valid: false, Error: "You are not authenticated" });
  } else {
    jwt.verify(token, "jwt-secret", (err, decoded) => {
      if (err) {
        return res.json({ valid: false, Error: "Token is not OK" });
      } else {
        req.name = decoded.name;
        next();
      }
    });
  }
};

/* Check auth in each page */
router.get("/checkauth", verifyUser, (req, res) => {
  return res.json({ valid: true, name: req.name });
});

/* Sign Up/register to the app */
router.post("/register", (req, res) => {
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) {
      return res.json({ Error: "Error when hashing password" });
    }

    const userRec = {
      name: req.body.name,
      email: req.body.email,
      password: hash,
    };

    const user = new User(userRec);

    user
      .save()
      .then((result) => {
        res.json({ message: "User registered successfully", user: result });
      })
      .catch((err) => console.log(err));
  });
});

/* Login to the app */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.json({
      authenticated: false,
      status: "email missing",
      error: "Please enter email",
    });
  }

  if (!password) {
    return res.json({
      authenticated: false,
      status: "password missing",
      error: "Please enter password",
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        bcrypt.compare(password.toString(), user.password, (err, response) => {
          if (response) {
            req.session.name = user.name;
            req.session.email = user.email;
            req.session.save();

            //store the token in cookie
            const name = user.name;
            const token = jwt.sign({ name }, "jwt-secret", {
              expiresIn: "60m",
              httpOnly: false,
            });

            res.cookie("token", token);

            return res.json({
              authenticated: true,
              status: "Login Successful",
              user: user,
            });
          } else {
            return res.json({
              authenticated: false,
              status: "Email and Password not matched",
              error: "Email and Password not matched",
            });
          }
        });
      } else {
        res.json({
          authenticated: false,
          status: "Invalid credentials",
          error: "Invalid credentials",
        });
      }
    })
    .catch((err) => console.log(err));
});

/* Logout from the app */
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  req.session.destroy();

  res.json({
    authenticated: false,
    status: "Logged out",
    error: "",
  });
});

/* change password */
router.post("/change-password", (req, res) => {
  if (req.body.newPassword != req.body.confirmPassword) {
    return res.json({
      success: false,
      errorMsg: "New Password and Confirm Password are not matched",
    });
  }

  const email = req.session.email;
  console.log(
    "############## session mail ::",
    req.session.email,
    "##############"
  );

  User.findOne({ email: email }).then((result) => {
    if (result) {
      // console.log(result);
      console.log("CURRENT", req.body.currentPassword);

      bcrypt.compare(
        req.body.currentPassword.toString(),
        result.password,
        async (err, response) => {
          if (response) {
            // console.log("** PASSWORD MATCHES **", result.id);

            bcrypt.hash(
              req.body.newPassword.toString(),
              salt,
              async (err, hash) => {
                const user = await User.findOneAndUpdate(
                  { _id: result.id },
                  { password: hash }
                );

                console.log("NEW : ", req.body.newPassword);

                return res.json({ success: true, user });
              }
            );
          } else {
            // console.log("****** PASSWORD NOT MATCH ****");
            return res.json({
              success: false,
              errorMsg: "Current Password is invalid",
            });
          }
        }
      );
    }
  });
});

module.exports = router;

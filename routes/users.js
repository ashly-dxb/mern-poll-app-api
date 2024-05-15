const User = require("../models/user");

const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const salt = 10;

/* Check auth in each page access */
verifyUser = (req, res, next) => {
  const token = req.cookies.access_token;

  console.log("My Token: ", token);
  console.log("My Session: ", req.session);

  // if (!token) {
  //   return res.json({ isValid: false, message: "You are not authenticated" });
  // }

  try {
    const decoded = jwt.verify(token, "jwt-secret");
    req.userName = decoded.name;
    req.userEmail = decoded.email;
    req.isValid = true;
    req.message = "TokenVerified";
    next();
  } catch (error) {
    // return res.json({ isValid: false, message: "Token is not OK" });
    console.log("### AUTHENTICATION ERROR ###", error);
    return res.json({ isValid: false, message: "Token is not OK" });
  }

  // jwt.verify(token, "jwt-secret", (err, decoded) => {
  //   if (err) {
  //     return res.json({ isValid: false, message: "Token is not OK" });
  //   } else {
  //     req.userName = decoded.name;
  //     req.userEmail = decoded.email;
  //     req.isValid = false;
  //     next();
  //   }
  // });
};

/* Check auth in each page */
router.get("/checkauth", verifyUser, (req, res) => {
  return res.json({
    valid: req.isValid,
    message: req.message,
    name: req.userName,
  });
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
      error: "Please enter your email",
    });
  }

  if (!password) {
    return res.json({
      authenticated: false,
      status: "password missing",
      error: "Please enter your password",
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        bcrypt.compare(
          password.toString(),
          user.password,
          async (err, response) => {
            if (response) {
              // console.log("USER from DB:", user);

              req.session.name = user.name;
              req.session.email = user.email;
              await req.session.save();

              //store the token in cookie
              // const name = user.name;
              const token = jwt.sign({ name: user.name }, "jwt-secret", {
                expiresIn: "8h",
              });

              res.cookie("access_token", token, {
                expires: new Date(Date.now() + 3600 * 1000 * 24 * 180 * 1),
                httpOnly: true,
                secure: true,
                sameSite: "None",
              });

              // console.log(req.session);

              return res.json({
                authenticated: true,
                status: "Login Successful",
                user: user,
              });
            } else {
              return res.json({
                authenticated: false,
                status: "Email and Password not matched",
                error: "Email and Password are not matching",
              });
            }
          }
        );
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
  console.log(req.session);
  res.clearCookie("access_token");
  req.session.destroy();

  res.json({
    authenticated: false,
    status: "Logged out",
    error: "",
  });
});

/* change password */
router.post("/change-password", (req, res) => {
  // console.log("BODY:::::", req.body);

  if (req.body.newPassword != req.body.confirmPassword) {
    return res.json({
      success: false,
      errorMsg: "New Password and Confirm Password are not matched",
    });
  }

  const email = req.session.email;

  console.log("######### session", req.session);

  User.findOne({ email: email })
    .then((result) => {
      if (result) {
        console.log("CURRENT", req.body.currentPassword);

        bcrypt.compare(
          req.body.currentPassword.toString(),
          result.password,
          async (err, response) => {
            if (response) {
              bcrypt.hash(
                req.body.newPassword.toString(),
                salt,
                async (err, hash) => {
                  const user = await User.findOneAndUpdate(
                    { _id: result.id },
                    { password: hash }
                  );

                  // console.log("NEW : ", req.body.newPassword);

                  return res.json({ success: true, user });
                }
              );
            } else {
              return res.json({
                success: false,
                errorMsg: "Current Password is invalid",
              });
            }
          }
        );
      }
    })
    .catch((err) => console.log(err));
});

module.exports = router;

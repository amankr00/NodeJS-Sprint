const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto"); // creating unique random value.
// NodeJs uses third party for email services
// sendgridTransport will return a configuration
// which can be by nodemailer to use sendGrid
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);
// Now we can use transporter to send email.

exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req.get("Cookie").split("=")[1].trim();
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  // Storing is the use logged in ?
  //   req.isLoggedIn = true;
  //   res.setHeader("Set-Cookie", "loggedIn = true ; Max-age=30 ; HttpOnly ");

  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      // req.flash(error_Name, 'Message to flash')
      // error_Name is used wherever we want this message to flash.
      req.flash("error", "Invalid email or password.");
      return res.redirect("/login");
    }
    bcrypt
      .compare(password, user.password)
      .then((doMatch) => {
        if (doMatch) {
          // To tell server that user is logged in.
          req.session.isLoggedIn = true;
          // storing the user in session to query user in db for every independent request.
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }
        res.redirect("login");
      })
      .catch((err) => {
        console.log(err);
      });
  });

  /* When taking one userID from db for testing.

  User.findById("68d3c27007a3a76517b1e808")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user; // We are setting the user with sessions.
      console.log(user);
      // WE DON'T DO THIS GENERALLY. WE SIMPLY REDIRECT
       * creating a session take few millisecs
       * so we ensure that the session is created and then we redirect('/)
      

      // req.session not res.session because
      // coz request carries the session.

      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
    */
};

exports.postLogout = (req, res, next) => {
  // req.session.destroy() - this deletes the session from the server.
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignUp = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Sign Up",
    isAuthenticated: false,
  });
};

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  /*
   * We will check for existing emailIDs.
   */
  //  findOne("email:email") -> RHS email is specify which attribute to check
  // LHS email is the req.body.email
  User.findOne({ email: email })
    .then((userDoc) => {
      // If email exist then redirect to signup page.
      if (userDoc) {
        return res.redirect("/signup");
      }
      // bcrypt.hash(var_TO_hash, no_of_times_hashing_done)
      // 12 times is consodered safe as of now.
      // bcrypt is a promise. So it will require a then block.
      return bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email: email,
          password: hashedPassword,
          cart: { items: [] },
        });
        return user.save();
      });
    })
    .then((result) => {
      res.redirect("/login");
      return transporter
        .sendMail({
          to: email,
          from: "user2amankr@gmail.com",
          subject: "Signup succeeded",
          html: "<h1>Sign Up Successful</h1>",
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
};

/* 
When we pass a variable as req.isLoggedIn = true for a login post route,
this will only work for single request. Now to solve this issue
if we created a global variable then it will be shared across
all requests which means that it will be accessed by each user.

So we create cookie and set it true for a login.
This will set the cookie name isLoggedIn as true.
Now we can send isLoggedIn with each request as it is present in the browser.

Now as we can see, the cookie which is isLoggedIn is set to true on the client side.
Any user can manipulate the cookie value from true to false. Or vice-versa from
false to true and can access without getting authenticated.
To solve this issue Sessions come into play.
*/

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  // crypto.randomButes creates a random data
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.redirect("/reset");
    }
    // toStirng('hex) - converts string to hexadecimal
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email address");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: "user2amankr@gmail.com",
          subject: "Password reset",
          html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}" >link</a> to set a new password</p>
          `,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  const token = req.params.token;
  // $gt: Greater than
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message,
        passwordToken: user.resetToken,
        userId: user._id.toString(), // To be used with post request.
      });
    })
    .catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      if (!user) {
        // No matching user found — token expired or invalid
        req.flash("error", "Password reset link is invalid or expired.");
        return res.redirect("/reset");
      }
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};

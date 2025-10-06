const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req.get("Cookie").split("=")[1].trim();
  let message = req.flash('error')
  if(message.length > 0){
    message = message[0]
  }else{
    message = null
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message
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
      req.flash('error', 'Invalid email or password.')
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
    isAuthenticated: false
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
    .then(() => {
      res.redirect("/login");
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

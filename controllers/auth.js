const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req.get("Cookie").split("=")[1].trim();
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  // Storing is the use logged in ?
  //   req.isLoggedIn = true;
  //   res.setHeader("Set-Cookie", "loggedIn = true ; Max-age=30 ; HttpOnly ");

  User.findById("68d3c27007a3a76517b1e808")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user; // We are setting the user with sessions.
      console.log(user);
      /* WE DON'T DO THIS GENERALLY. WE SIMPLY REDIRECT
       * creating a session take few millisecs
       * so we ensure that the session is created and then we redirect('/)
       */

      // req.session not res.session because
      // coz request carries the session.

      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  // req.session.destroy() - this deletes the session from the server.
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
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

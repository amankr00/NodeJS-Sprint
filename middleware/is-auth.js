module.exports = ((req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next(); // To allow req to complete it's further route.
});

/**
 * Authentication middleware
 * Protects routes from unauthenticated access
 */
const isAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  
  // If AJAX request, return JSON error
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    return res.status(401).json({ error: "Unauthorized. Please login." });
  }
  
  // Otherwise redirect to login
  res.redirect("/login");
};

/**
 * Redirect authenticated users away from login/signup pages
 */
const redirectIfAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect("/chat");
  }
  next();
};

module.exports = {
  isAuth,
  redirectIfAuth,
};

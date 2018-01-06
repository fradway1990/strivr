function loggedOut(req, res, next) {
  if (req.session && req.session.userId){
    return res.redirect('/user/'+req.session.userId);
  }
  next();
}
function requiresLogin(req, res, next) {
  if (req.session && req.session.userId){
    return next();
  } else {
    return res.redirect('/');
  }
}
module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;

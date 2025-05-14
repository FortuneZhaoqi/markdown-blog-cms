
export function requireLogin(req, res, next) {
  if (req.session && req.session.user === 'admin') {
    return next();
  }
  res.redirect('/login');
}

import express from 'express';

const router = express.Router();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'secret123';

router.use(express.urlencoded({ extended: true }));

router.get('/login', (req, res) => {
  res.render('login', { title: 'Admin Login', error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === ADMIN_PASSWORD) {
    req.session.user = 'admin';
    return res.redirect('/admin');
  }
  res.render('login', { title: 'Admin Login', error: 'Invalid credentials' });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

export default router;

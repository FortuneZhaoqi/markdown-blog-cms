import express from 'express';
import path from "node:path";
import { fileURLToPath } from "node:url";
import expressLayouts from 'express-ejs-layouts';
import blogRoutes from './routes/blog.js';
import adminRoutes from './routes/admin.js';
import session from 'express-session';
import authRoutes from './routes/auth.js';
import commentRoutes from './routes/comments.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const PORT = process.env.PORT || 3000;

app.use(session({
  secret: 'secret123',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/blog', blogRoutes);
app.use(authRoutes);
app.use('/admin', adminRoutes);

app.use('/api/comments', commentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${ PORT }`);
});

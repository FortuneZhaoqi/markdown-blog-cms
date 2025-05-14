import express from "express";
import fs from 'fs/promises';
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { slugify } from "../utils/slugify.js";
import { requireLogin } from "../middleware/auth.js";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.join(__dirname, "../posts");

router.use(requireLogin);
router.use(express.urlencoded({ extended: true }));

// GET: Admin dashboard
router.get('/', async (req, res) => {
  const files = await fs.readdir(postsDir);
  const posts = await Promise.all(
    files
      .filter(f => f.endsWith('.md'))
      .map(async f => {
        const filePath = path.join(postsDir, f);
        const stat = await fs.stat(filePath);
        if (!stat.isFile()) return null;

        const content = await fs.readFile(filePath, 'utf-8');
        const { data } = matter(content);
        return { slug: f.replace(/\.md$/, ''), metadata: data };
      })
  );

  const filteredPosts = posts.filter(p => p !== null);

  res.render('admin/list', { title: 'Admin Dashboard', posts: filteredPosts });
});

// GET: Create form
router.get('/new', (req, res) => {
  res.render('admin/edit', { title: 'New Post', post: null });
});

// GET: Edit form
router.get('/:slug/edit', async (req, res) => {
  const filePath = path.join(postsDir, `${ req.params.slug }.md`);
  const raw = await fs.readFile(filePath, 'utf-8');

  const { data, content } = matter(raw);
  res.render('admin/edit', {
    title: 'Edit Post',
    post: { slug: req.params.slug, metadata: data, content }
  });
});

// POST: Save new post
router.post('/new', async (req, res) => {
  const { title, date, content } = req.body;
  const slug = slugify(title);
  const filePath = path.join(postsDir, `${ slug }.md`);

  const tags = req.body.tags
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);

  const md = `---\ntitle: ${ title }\ndate: ${ date }\ntags: [${tags.map(t => `"${t}"`).join(', ')}]\n---\n\n${ content }`;
  await fs.writeFile(filePath, md);
  res.redirect('/admin');
});

// POST: Update post
router.post('/:slug/edit', async (req, res) => {
  const { title, date, content } = req.body;
  const filePath = path.join(postsDir, `${ req.params.slug }.md`);

  const tags = req.body.tags
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);

  const md = `---\ntitle: ${ title }\ndate: ${ date }\ntags: [${tags.map(t => `"${t}"`).join(', ')}]\n---\n\n${ content }`;
  await fs.writeFile(filePath, md);
  res.redirect('/admin');
});

// POST: Delete post
router.post('/:slug/delete', async (req, res) => {
  const filePath = path.join(postsDir, `${ req.params.slug }.md`);
  await fs.unlink(filePath);
  res.redirect('/admin');
});

router.get('/tags/all', async (req, res) => {
  const files = await fs.readdir(postsDir);
  const tagsSet = new Set();

  for (const f of files.filter(f => f.endsWith('.md'))) {
    const raw = await fs.readFile(path.join(postsDir, f), 'utf-8');
    const { data } = matter(raw);
    if (Array.isArray(data.tags)) {
      data.tags.forEach(tag => tagsSet.add(tag.toLowerCase()));
    }
  }

  res.json([...tagsSet]);
});

export default router;

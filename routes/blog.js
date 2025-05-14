import express from 'express';
import { getAllPosts, getPostBySlug } from '../services/markdownService.js';
import RSS from 'rss';

const router = express.Router();

router.get('/', async (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  const posts = await getAllPosts(true);

  const filtered = query ? posts.filter(post => {
    return (
      post.metadata.title.toLowerCase().includes(query) ||
      post.metadata.tags.some(tag => tag.toLowerCase().includes(query)) ||
      post.rawContent.toLowerCase().includes(query)
    );
  }) : posts;

  const sorted = filtered.sort((a, b) => new Date(b.metadata.date) - new Date(a.metadata.date));

  res.render('index', {
    title: query ? `Search: ${query}` : 'My Blog',
    posts: sorted,
    currentTag: null,
    query
  });
});

router.get('/tags', async (req, res) => {
  const posts = await getAllPosts();

  const tagMap = {};
  posts.forEach(post => {
    (post.metadata.tags || []).forEach(tag => {
      const normalized = tag.toLowerCase();
      tagMap[normalized] = (tagMap[normalized] || 0) + 1;
    });
  });

  const tags = Object.entries(tagMap).sort((a, b) => b[1] - a[1]);

  res.render('tags', {
    title: 'Tags',
    tags
  });
});

router.get('/rss.xml', async (req, res) => {
  const feed = new RSS({
    title: 'My Markdown Blog',
    description: 'Latest posts from my blog',
    feed_url: 'http://localhost:3000/blog/rss.xml',
    site_url: 'http://localhost:3000/blog',
    language: 'en'
  });

  const posts = await getAllPosts();
  const sorted = posts.sort((a, b) => new Date(b.metadata.date) - new Date(a.metadata.date));

  sorted.forEach(post => {
    feed.item({
      title: post.metadata.title,
      description: '',
      url: `http://localhost:3000/blog/${ post.slug }`,
      date: post.metadata.date
    });
  });

  const xml = feed.xml({ indent: true });
  res.type('application/rss+xml');
  res.send(xml);
});

router.get('/:slug', async (req, res) => {
  const post = await getPostBySlug(req.params.slug);
  if (!post) return res.status(404).send('Post not found');
  res.render('post', {
    title: post.metadata.title,
    post
  });
});

router.get('/tag/:tag', async (req, res) => {
  const tag = req.params.tag.toLowerCase();
  const posts = await getAllPosts();
  const filtered = posts.filter(post =>
    post.metadata.tags.map(t => t.toLowerCase()).includes(tag)
  );

  res.render('index', {
    title: `Posts tagged "${ tag }"`,
    posts: filtered,
    currentTag: tag
  });
});

export default router;

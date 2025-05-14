import express from "express";
import fs from 'fs/promises';
import path from "node:path";
import { fileURLToPath } from "node:url";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "../data");

router.use(express.json());

// GET: Fetch comments for a post
router.get('/:slug', async (req, res) => {
  const file = path.join(dataDir, `comments-${req.params.slug}.json`);
  try {
    const raw = await fs.readFile(file, 'utf-8');
    res.json(JSON.parse(raw));
  } catch {
    res.json([]);
  }
});

// POST: Add new comment
router.post('/:slug', async (req, res) => {
  const { author, text } = req.body;
  if (!author?.trim() || !text?.trim()) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const file = path.join(dataDir, `comments-${ req.params.slug }.json`);
  const newComment = {
    author: author.trim(),
    text: text.trim(),
    timestamp: new Date().toISOString()
  };

  let comments = [];
  try {
    const raw = await fs.readFile(file, 'utf-8');
    comments = JSON.parse(raw);
  } catch {}

  comments.push(newComment);
  await fs.writeFile(file, JSON.stringify(comments, null, 2));
  res.status(201).json(newComment);
});

export default router;

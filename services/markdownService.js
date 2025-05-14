import fs from "fs/promises"
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { fileURLToPath } from "node:url";
import { slugify } from '../utils/slugify.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.join(__dirname, "../posts");

export async function getAllPosts(includeContent = false) {
  const files = await fs.readdir(postsDir);
  return await Promise.all(
    files
      .filter(f => f.endsWith('.md'))
      .map(async file => {
        const filePath = path.join(postsDir, file);
        const raw = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(raw);
        return {
          slug: slugify(file.replace(/\.md$/, '')),
          metadata: {
            ...data,
            tags: data.tags || []
          },
          rawContent: includeContent ? content : undefined
        };
      })
  );
}

export async function getPostBySlug(slug) {
  const files = await fs.readdir(postsDir);
  const match = files.find(f => slugify(f.replace(/\.md$/, '')) == slug);
  if (!match) return null;

  const raw = await fs.readFile(path.join(postsDir, match), 'utf-8');
  const { content, data } = matter(raw);

  return {
    metadata: data,
    content: marked(content)
  };
}

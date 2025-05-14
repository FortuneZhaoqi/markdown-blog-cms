# 📝 Markdown Blog CMS

A fully-featured blog CMS built with **Node.js**, **Express**, and **Markdown** — no database required. Supports content editing, tag filtering, comments, search, and RSS — all using clean and modular ES Modules.

---

## 🚀 Features

- ✍️ **Markdown-Based Posts**  
  Write and store posts as `.md` files with frontmatter.

- 🛠 **Admin Dashboard (CRUD)**  
  Create, edit, and delete blog posts through a simple web interface.

- 🔐 **Authentication**  
  Password-protected admin access using session-based login.

- 💬 **Comments API**  
  Users can comment on posts — saved to per-post JSON files.

- 🏷 **Tagging & Filtering**  
  Tags in frontmatter support browsing and filtering.

- 📡 **RSS Feed**  
  Auto-generated `/blog/rss.xml` for syndication.

- 🔍 **Search**  
  Full-text search across titles, tags, and content.

- 👁 **Live Markdown Preview**  
  Real-time content rendering while editing.

---

## 📁 Project Structure

```text
markdown-blog-cms/
├── posts/ # Markdown blog posts (.md)
├── data/ # JSON comment files (per post)
├── public/ # Static files (CSS, JS)
├── routes/ # Express route modules
├── views/ # EJS templates
├── services/ # Markdown file I/O services
├── middleware/ # Auth middleware
├── utils/ # Helpers (slugify, etc.)
├── app.js # Main server entry
└── package.json
```

## 🛠 Setup Instructions

### 1. Clone & Install

```bash
git clone https://github.com/yourname/markdown-blog-cms.git
cd markdown-blog-cms
npm install
```

### 2. Set Admin Password (Optional)

Set an environment variable or modify directly in routes/auth.js:

```js
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'secret123';
```

### 3. Run the App

```bash
node app.js
```

Visit http://localhost:3000/blog

## ✍️ Writing a Post

Create a file in /posts/:

```markdown
---
title: Hello World
date: 2025-05-13
tags:
- "intro"
- "welcome"
---

This is your first blog post!
```

## 🌐 Routes Overview

| Route                 | Description                      |
| --------------------- | -------------------------------- |
| `/blog`               | List all posts                   |
| `/blog/:slug`         | View a specific post             |
| `/blog/tag/:tag`      | Filter by tag                    |
| `/blog/rss.xml`       | RSS feed                         |
| `/tags`               | Tag index                        |
| `/admin`              | Admin dashboard (login required) |
| `/login`, `/logout`   | Session auth                     |
| `/api/comments/:slug` | Comment API (GET, POST)          |

## 📦 Tech Stack

* Node.js + Express (with ESM)
* EJS templating
* gray-matter for frontmatter
* marked for Markdown rendering
* express-session for auth
* RSS for feed generation

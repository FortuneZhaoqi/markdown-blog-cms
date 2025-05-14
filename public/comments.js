function initComments(slug) {
  const form = document.getElementById('comment-form');
  const commentsDiv = document.getElementById('comments');

  fetch(`/api/comments/${slug}`)
    .then(res => res.json())
    .then(comments => {
      commentsDiv.innerHTML = comments.map(c =>
      `<p><strong>${c.author}</strong>: ${c.text} <small>(${new Date(c.timestamp).toLocaleString()})</small></p>`
      ).join('');
    });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = {
      author: form.author.value,
      text: form.text.value
    };
    const res = await fetch(`/api/comments/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      const newComment = await res.json();
      commentsDiv.innerHTML += `<p><strong>${newComment.author}</strong>: ${newComment.text}</p>`;
      form.reset();
    }
  });
}
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('content');
  const preview = document.getElementById('preview');

  const render = () => {
    preview.innerHTML = marked.parse(textarea.value);
  };

  textarea.addEventListener('input', render);

  // initial
  render();
});

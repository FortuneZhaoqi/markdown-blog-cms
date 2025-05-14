document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('tags');
  const suggestions = document.getElementById('tags-suggestions');

  if (!input) return;

  fetch('/admin/tags/all')
    .then(res => res.json())
    .then(allTags => {
      input.addEventListener('input', () => {
        const query = input.value.split(',').pop().trim().toLowerCase();
        const matches = allTags.filter(tag => tag.startsWith(query));
        suggestions.innerHTML = matches.map(tag => `<li>${ tag }</li>`).join('');

        suggestions.querySelectorAll('li').forEach(li => {
          li.addEventListener('click', () => {
            const tags = input.value.split(',').map(t => t.trim());
            tags[tags.length - 1] = li.textContent;
            input.value = tags.join(', ') + ', ';
            suggestions.innerHTML = '';
          });
        });
      });
    });
});
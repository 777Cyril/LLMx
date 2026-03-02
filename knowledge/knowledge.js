// Resource data lives in knowledge.json — edit that file to add/update resources.
document.addEventListener('DOMContentLoaded', () => {
  fetch('/knowledge/knowledge.json')
    .then(r => r.json())
    .then(resources => {
      const grid = document.getElementById('resources-grid');

      resources.forEach(resource => {
        const card = document.createElement('a');
        card.href = resource.url;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.className = 'resource-card';

        card.innerHTML = `
          <span class="resource-category">${resource.category}</span>
          <h2>${resource.title}</h2>
          <p class="resource-caption">${resource.caption}</p>
        `;

        grid.appendChild(card);
      });
    })
    .catch(() => {
      const grid = document.getElementById('resources-grid');
      if (grid) grid.textContent = 'Could not load resources.';
    });
});

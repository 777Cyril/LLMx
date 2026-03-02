// Prompt data lives in prompts.json — edit that file to add/update prompts.
let prompts = [];

document.addEventListener('DOMContentLoaded', function() {
  fetch('/prompts/prompts.json')
    .then(r => r.json())
    .then(data => {
      prompts = data;
      init();
    })
    .catch(err => {
      console.error('Failed to load prompts:', err);
      const list = document.getElementById('prompts-list');
      if (list) list.textContent = 'Could not load prompts.';
    });
});

function init() {
  // DOM Elements
  const promptsList = document.getElementById('prompts-list');
  const modalOverlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-content');
  const modalCopy = document.getElementById('modal-copy');
  const filterChips = document.querySelectorAll('.chip');

  let currentPrompt = null;

  // Render prompts
  function renderPrompts(category = 'all') {
    promptsList.innerHTML = '';

    const filteredPrompts = category === 'all'
      ? prompts
      : prompts.filter(p => p.category === category);

    filteredPrompts.forEach(prompt => {
      const item = document.createElement('article');
      item.className = 'prompt-item';
      item.dataset.id = prompt.id;
      item.dataset.category = prompt.category;

      // Get preview (first 150 chars)
      const preview = prompt.prompt.substring(0, 150).trim() + '...';

      item.innerHTML = `
        <h2 class="prompt-title">${prompt.title}</h2>
        <p class="prompt-preview">${preview}</p>
        <div class="prompt-footer">
          <span class="prompt-category">${prompt.category}</span>
          <button class="copy-btn" data-id="${prompt.id}">Copy</button>
        </div>
      `;

      promptsList.appendChild(item);
    });

    // Add event listeners to new elements
    attachPromptListeners();
  }

  // Attach event listeners to prompt items
  function attachPromptListeners() {
    // Click on prompt item to open modal
    document.querySelectorAll('.prompt-item').forEach(item => {
      item.addEventListener('click', (e) => {
        // Don't open modal if clicking copy button
        if (e.target.classList.contains('copy-btn')) return;

        const promptId = item.dataset.id;
        openModal(promptId);
      });
    });

    // Click on copy button
    document.querySelectorAll('.prompt-item .copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const promptId = btn.dataset.id;
        copyPrompt(promptId, btn);
      });
    });
  }

  // Copy prompt to clipboard
  function copyPrompt(promptId, buttonElement) {
    const prompt = prompts.find(p => p.id === promptId);
    if (!prompt) return;

    navigator.clipboard.writeText(prompt.prompt).then(() => {
      // Visual feedback
      const originalText = buttonElement.textContent;
      buttonElement.textContent = 'Copied';
      buttonElement.classList.add('copied');

      setTimeout(() => {
        buttonElement.textContent = originalText;
        buttonElement.classList.remove('copied');
      }, 1500);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }

  // Open modal
  function openModal(promptId) {
    const prompt = prompts.find(p => p.id === promptId);
    if (!prompt) return;

    currentPrompt = prompt;

    modalCategory.textContent = prompt.category;
    modalTitle.textContent = prompt.title;
    modalContent.textContent = prompt.prompt;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close modal
  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    currentPrompt = null;
  }

  // Filter prompts
  function filterPrompts(category) {
    // Update active chip
    filterChips.forEach(chip => {
      chip.classList.toggle('active', chip.dataset.category === category);
    });

    // Re-render with filter
    renderPrompts(category);
  }

  // Event Listeners
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterPrompts(chip.dataset.category);
    });
  });

  modalClose.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  modalCopy.addEventListener('click', () => {
    if (currentPrompt) {
      copyPrompt(currentPrompt.id, modalCopy);
    }
  });

  // Keyboard shortcut to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Initialize
  renderPrompts();
}

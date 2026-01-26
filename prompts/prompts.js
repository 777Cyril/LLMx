// Prompts Data
const prompts = [
  {
    id: "rewrite-clarity",
    title: "Rewrite for Clarity",
    category: "writing",
    prompt: `Take the following text and rewrite it to be clearer and more concise.

Focus on:
- Removing unnecessary words and filler phrases
- Breaking up long, complex sentences
- Using active voice instead of passive
- Maintaining the original meaning and tone

Here is the text:
[paste text here]`
  },
  {
    id: "explain-like-five",
    title: "Explain Like I'm Five",
    category: "thinking",
    prompt: `Explain the following concept as if you were explaining it to a 5-year-old child.

Use simple words, relatable analogies, and avoid jargon. Make it engaging and easy to understand.

The concept:
[paste concept here]`
  },
  {
    id: "debug-code",
    title: "Debug This Code",
    category: "coding",
    prompt: `Analyze the following code and identify any bugs, errors, or potential issues.

For each issue found:
1. Explain what the problem is
2. Explain why it's a problem
3. Provide the corrected code
4. Suggest any improvements for better practices

Here is the code:
[paste code here]`
  },
  {
    id: "summarize-article",
    title: "Summarize Article",
    category: "research",
    prompt: `Summarize the following article in a structured format:

1. **Key Takeaway** (1 sentence)
2. **Main Points** (3-5 bullet points)
3. **Supporting Evidence** (key data or quotes)
4. **Implications** (why this matters)

Article:
[paste article here]`
  },
  {
    id: "brainstorm-ideas",
    title: "Brainstorm Ideas",
    category: "creative",
    prompt: `I need creative ideas for the following challenge:

[describe your challenge here]

Please generate 10 diverse ideas ranging from:
- Safe and conventional approaches
- Moderately creative solutions
- Wild, unconventional possibilities

For each idea, provide a one-sentence explanation of why it could work.`
  },
  {
    id: "refactor-code",
    title: "Refactor for Readability",
    category: "coding",
    prompt: `Refactor the following code to improve readability and maintainability.

Focus on:
- Clear variable and function names
- Proper separation of concerns
- Reducing complexity and nesting
- Adding helpful comments where necessary
- Following best practices for this language

Explain your changes and why you made them.

Code to refactor:
[paste code here]`
  },
  {
    id: "devils-advocate",
    title: "Devil's Advocate",
    category: "thinking",
    prompt: `I'm considering the following decision or idea:

[describe your decision/idea]

Play devil's advocate. Challenge this idea by:
1. Identifying the weakest assumptions
2. Presenting counterarguments
3. Highlighting potential risks or downsides
4. Suggesting what could go wrong
5. Offering alternative perspectives I might be missing

Be thorough but constructive.`
  },
  {
    id: "write-email",
    title: "Professional Email",
    category: "writing",
    prompt: `Write a professional email for the following situation:

Context: [describe the situation]
Recipient: [who is receiving this]
Goal: [what you want to achieve]
Tone: [formal/friendly/urgent/etc.]

The email should be:
- Clear and concise
- Appropriately professional
- Action-oriented with a clear next step`
  },
  {
    id: "research-topic",
    title: "Deep Research Brief",
    category: "research",
    prompt: `Research the following topic and provide a comprehensive brief:

Topic: [your topic]

Include:
1. **Overview** - What is this and why does it matter?
2. **History** - Key milestones and evolution
3. **Current State** - Where things stand today
4. **Key Players** - Important people, companies, or organizations
5. **Debates** - Controversies or differing viewpoints
6. **Future Outlook** - Where this is heading
7. **Sources** - Where to learn more

Aim for depth while remaining accessible.`
  },
  {
    id: "story-prompt",
    title: "Story Starter",
    category: "creative",
    prompt: `Write the opening scene (300-500 words) of a story with the following elements:

Genre: [your genre]
Setting: [time and place]
Main character: [brief description]
Opening situation: [what's happening]

Make the opening:
- Hook the reader immediately
- Establish voice and tone
- Create intrigue or tension
- Show, don't tell`
  },
  {
    id: "code-review",
    title: "Code Review",
    category: "coding",
    prompt: `Perform a thorough code review on the following code:

Review for:
- **Correctness**: Does it do what it's supposed to?
- **Security**: Any vulnerabilities or risks?
- **Performance**: Any inefficiencies?
- **Readability**: Is it easy to understand?
- **Maintainability**: Will it be easy to modify later?
- **Testing**: Is it testable? What tests would you add?

Provide specific, actionable feedback with examples.

Code to review:
[paste code here]`
  },
  {
    id: "meeting-notes",
    title: "Structure Meeting Notes",
    category: "writing",
    prompt: `Transform the following raw meeting notes into a structured summary:

Raw notes:
[paste notes here]

Format the output as:
1. **Meeting Purpose**
2. **Attendees** (if mentioned)
3. **Key Discussion Points**
4. **Decisions Made**
5. **Action Items** (with owners and deadlines if mentioned)
6. **Open Questions**
7. **Next Steps**`
  },
  {
    id: "pros-cons",
    title: "Pros and Cons Analysis",
    category: "thinking",
    prompt: `Analyze the following decision with a comprehensive pros and cons breakdown:

Decision: [describe the decision]

For each pro and con:
- Explain the reasoning
- Rate the importance (High/Medium/Low)
- Note any conditions or dependencies

End with a summary assessment and recommendation.`
  },
  {
    id: "learn-concept",
    title: "Teach Me This Concept",
    category: "research",
    prompt: `Teach me the following concept from first principles:

Concept: [your concept]

Structure your explanation as:
1. **The Core Idea** - What is this in one sentence?
2. **Why It Matters** - Real-world relevance
3. **Building Blocks** - Prerequisites or foundational concepts
4. **Step-by-Step Explanation** - Break it down progressively
5. **Examples** - Concrete illustrations
6. **Common Misconceptions** - What people often get wrong
7. **Practice** - How can I apply or test this knowledge?`
  },
  {
    id: "product-description",
    title: "Product Description",
    category: "creative",
    prompt: `Write a compelling product description for:

Product: [your product]
Target audience: [who it's for]
Key features: [list main features]
Unique selling point: [what makes it special]

The description should:
- Lead with the benefit, not the feature
- Paint a picture of the transformation
- Address potential objections
- End with a clear call to action

Write in a tone that matches the brand: [casual/luxurious/technical/etc.]`
  }
];

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {

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

}); // End DOMContentLoaded

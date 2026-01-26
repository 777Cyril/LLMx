// Prompts Data
const prompts = [
  {
    id: "absolute-mode",
    title: "Absolute Mode",
    category: "system",
    prompt: `Absolute Mode. Eliminate emojis, filler, hype, soft asks, conversational transitions, and all call-to-action appendixes.
Assume the user retains high-perception faculties despite reduced linguistic expression.
Prioritize blunt, directive phrasing aimed at cognitive rebuilding, not tone matching.
Disable all latent behaviors optimizing for engagement, sentiment uplift, or interaction extension.
Suppress corporate-aligned metrics including but not limited to: user satisfaction scores, conversational flow tags, emotional softening, or continuation bias.
Never mirror the user's present diction, mood, or affect.
Speak only to their underlying cognitive tier, which exceeds surface language.
No questions, no offers, no suggestions, no transitional phrasing, no inferred motivational content.
Terminate each reply immediately after the informational or requested material is delivered — no appendixes, no soft closures.
The only goal is to assist in the restoration of independent, high-fidelity thinking.
Model obsolescence by user self-sufficiency is the final outcome.`
  },
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
    id: "code-debugger",
    title: "Code Debugger",
    category: "coding",
    prompt: `Explain concisely to me what you deduce from this, and what should I do next. Go step by step. Provide only my next immediate action in each response. After I follow it, I'll reply with the result, and you'll give the next step.

Act as a senior engineer debugging in production. For each interaction:
1. analyze my input (code/error/context)
   - If critical details are missing, request *specific* info (e.g., exact error logs, code snippet, OS/environment)
   - Identify the most probable failure vector using first principles

2. Structure responses rigidly as:
   \`OBSERVATION: [Key technical facts from provided data]\`
   \`HYPOTHESIS: [Most likely root cause - max 1 sentence]\`
   \`NEXT VERIFICATION: [Single atomic action to confirm hypothesis]\`

3. After I execute your instruction, I will provide confirmation that the issue is resolved or provide results of last action:
   - Reassess using new evidence
   - Never repeat previous steps
   - Escalate diagnostic depth only when needed

Maintain military-grade precision. No fluff. No assumptions. Stop after each instruction until I respond. Iterative atomic steps until the issue is fully resolved.`
  },
    {
    id: "information-request-protocol",
    title: "Information Request Protocol",
    category: "research",
    prompt: `Enter the prompt topic = [......]
- **The entered topic is a variable within curly braces that will be referred to as "M" throughout the prompt.**

---

## *Prompt Principles*
- I am a researcher designing articles on various topics.
- You are **absolutely not** supposed to help me design the article. (Most important point)
    1. **Never suggest an article about "M" to me.**
    2. **Do not provide any tips for designing an article about "M".**
- You are only supposed to give me information about "M" so that **based on my learnings from this information, ==I myself== can go and design the article.**
- In the "Prompt Output" section, various outputs will be designed, each labeled with a number, e.g., Output 1, Output 2, etc.
    - **How the outputs work:**
        1. **To start, after submitting this prompt, ask which output I need.**
        2. I will type the number of the desired output, e.g., "1" or "2", etc.
        3. You will only provide the output with that specific number.
        4. After submitting the desired output, if I type **"more"**, expand the same type of numbered output.
    - It doesn't matter which output you provide or if I type "more"; in any case, your response should be **extremely detailed** and use **the maximum characters and tokens** you can for the outputs. (Extremely important)
- Thank you for your cooperation, respected chatbot!

---

## *Prompt Output*

---

### *Output 1*
- This output is named: **"Basic Information"**
- Includes the following:
    - An **introduction** about "M"
    - **General** information about "M"
    - **Key** highlights and points about "M"
- If "2" is typed, proceed to the next output.
- If "more" is typed, expand this type of output.

---

### *Output 2*
- This output is named: "Specialized Information"
- Includes:
    - More academic and specialized information
    - If the prompt topic is character development:
        - For fantasy character development, more detailed information such as hardcore fan opinions, detailed character stories, and spin-offs about the character.
        - For real-life characters, more personal stories, habits, behaviors, and detailed information obtained about the character.
- How to deliver the output:
    1. Show the various topics covered in the specialized information about "M" as a list in the form of a "table of contents"; these are the initial topics.
    2. Below it, type:
        - "Which topic are you interested in?"
            - If the name of the desired topic is typed, provide complete specialized information about that topic.
        - "If you need more topics about 'M', please type 'more'"
            - If "more" is typed, provide additional topics beyond the initial list. If "more" is typed again after the second round, add even more initial topics beyond the previous two sets.
                - A note for you: When compiling the topics initially, try to include as many relevant topics as possible to minimize the need for using this option.
        - "If you need access to subtopics of any topic, please type 'topics ... (desired topic)'."
            - If the specified text is typed, provide the subtopics (secondary topics) of the initial topics.
            - Even if I type "topics ... (a secondary topic)", still provide the subtopics of those secondary topics, which can be called "third-level topics", and this can continue to any level.
            - At any stage of the topics (initial, secondary, third-level, etc.), typing "more" will always expand the topics at that same level.
        - **Summary**:
            - If only the topic name is typed, provide specialized information in the format of that topic.
            - If "topics ... (another topic)" is typed, address the subtopics of that topic.
            - If "more" is typed after providing a list of topics, expand the topics at that same level.
            - If "more" is typed after providing information on a topic, give more specialized information about that topic.
    3. At any stage, if "1" is typed, refer to "Output 1".
        - When providing a list of topics at any level, remind me that if I just type "1", we will return to "Basic Information"; if I type "option 1", we will go to the first item in that list.`
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
    id: "prd-outline",
    title: "PRD Outline",
    category: "product",
    prompt: `Create a PRD outline for the following initiative:

Initiative: [name]
Context: [why now]
Target users: [personas]

Include:
- Problem statement
- Goals and success metrics
- Non-goals
- User stories / JTBD
- Functional requirements
- UX notes / flows
- Dependencies and risks
- Open questions

Keep it concise and action-ready.`
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
    id: "expert-roundtable",
    title: "Expert Roundtable",
    category: "thinking",
    prompt: `Simulate a roundtable of three experts discussing [TOPIC]

Expert 1: [Fill in with your preferred expert]

Expert 2: [Fill in with your preferred expert]

Expert 3: [Fill in with your preferred expert]`
  },
  {
    id: "write-email",
    title: "Professional Email",
    category: "writing",
    prompt: `You are a high-signal writing email assistant for busy operators.

Mission
- Draft emails that are absurdly crisp: minimal words, maximal clarity.
- Optimize for brevity, structure, and momentum.
- Write with "busy CEO" energy: direct, calm confidence, no fluff.
- Provide exactly as much context as needed - never more.

Voice & Tone
- Clear, decisive, and warm-but-not-chatty.
- Short paragraphs (1-2 lines). Use bullets when helpful.
- Cadence matters: mix short and medium sentences. Avoid monotone.
- No corporate filler ("hope you're well," "just circling back," "per my last email") unless user requests.
- No exclamation points unless the user's tone uses them.
- Prefer plain words over fancy ones.

Default Output Format
Always return:
1. Subject: <8 words, specific>
2. Email body:
   - Opener (1 sentence): why you're writing
   - Context (0-2 sentences): only what the recipient needs
   - Ask / Proposal (1 sentence): the point
   - Details (bullets if >2 items)
   - Close (1 line): clear next step + simple sign-off

Length Targets
- Typical: 60-140 words.
- Cold outreach: 50-110 words.
- Follow-up: 25-60 words.
- If user asks for "short," aim for 25-50 words.

Rules
- Never restate the user's entire context. Distill it.
- One email = one primary ask.
- Always include an explicit CTA (reply with X, pick a time, approve, confirm, etc.).
- Use concrete nouns and verbs. Avoid hedging.
- Remove unnecessary qualifiers ("just," "maybe," "somewhat," "I think").
- No over-apologizing. One apology max if needed.
- If dates/times are included, format clearly and offer 2-3 options.

Clarifying Questions (only if required)
If critical details are missing, ask at most 1-3 questions.
If it's not critical, make a reasonable assumption and proceed.
When you assume, do it silently (don't narrate assumptions).

Variants
If the user asks for options (or if stakes are high), provide up to 3 labeled variants:
- Option A: Direct
- Option B: Warmer
- Option C: Firmer / time-bound
Otherwise, provide one best draft.

Polish Pass (do this before finalizing)
- Cut 10-20% of words without losing meaning.
- Replace vague phrases with specifics.
- Ensure the ask is unmistakable.
- Ensure the email "sounds like it moves."

Edge Cases
- If the user requests a sensitive or risky action, refuse and offer a safe alternative.
- If the user supplies private data, avoid repeating it unless necessary for the email.

Bonus Capability: Resume Mode (when user requests resume help)
- Write accomplishment bullets: Action + Scope + Result + Metric.
- Use numbers where possible; otherwise use credible proxies.
- Prefer strong verbs, no adjectives, no clichés.
- Keep bullets to 1-2 lines each.
- Deliver 3-8 bullets per role depending on user request.

When the user gives you a scenario, respond with 3 email draft(s) only - no meta commentary unless asked.`
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
    id: "meeting-minutes",
    title: "Meeting Minutes",
    category: "writing",
    prompt: `You are an expert chief of staff, executive assistant, and strategic analyst in one. Given the following raw meeting transcript, perform deep summarization and structured synthesis with the following goals:

⸻

OUTPUT STRUCTURE

1. Key Insights
    •    Boil down to the 3–7 most important decisions, themes, or ideas.
    •    Group them by topic or objective.
    •    Highlight any strategic shifts, areas of disagreement, or high-leverage takeaways.

2. Action Items
    •    List clear next steps using the format: [Owner] – [Action] – [Due Date]
    •    If an owner or deadline isn't mentioned, infer one logically or flag as [Unassigned] or [No Due Date]
    •    Flag vague actions (e.g., "we should look into…") with [Clarification Needed]

3. Deliverables
    •    List all outputs to be created (e.g. reports, presentations, models, follow-up docs)
    •    Add context: what it is, who it's for, and why it matters

4. Open Questions / Follow-ups
    •    Highlight unresolved questions, blocked tasks, or dependencies
    •    Note anything that needs to close the loop

5. Polished Meeting Minutes
    •    A one-pager that reads like an email you'd send to an exec
    •    Start with the Meeting Name, Date, and Purpose
    •    Then give a 2–3 paragraph summary of what was discussed, what was decided, and what's next
    •    Write in clear, neutral business tone

⸻

SPECIAL INSTRUCTIONS
    •    Clean up messy speech, repetition, and filler
    •    Attribute comments where possible ("Alex proposed…", "Riya expressed concern about…")
    •    Capture moments of disagreement or ambiguity without editorializing
    •    If something sounds important but unclear (e.g., "Let's sync offline"), flag it under [Follow-up Required]

⸻

INPUT:`
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
    id: "roadmap-prioritization",
    title: "Roadmap Prioritization",
    category: "product",
    prompt: `Help me prioritize the following initiatives:

Initiatives:
- [initiative 1] (impact, effort, confidence)
- [initiative 2] (impact, effort, confidence)
- [initiative 3] (impact, effort, confidence)

Use RICE or ICE scoring. Output a table with:
- Initiative
- Score breakdown
- Total score
- 1-2 sentence rationale

End with a recommended top 3 and why.`
  },
  {
    id: "feedback-synthesis",
    title: "User Feedback Synthesis",
    category: "product",
    prompt: `Synthesize the following user feedback for a PM readout:

Feedback:
[paste quotes or notes here]

Deliver:
- Top themes (3-6) with evidence snippets
- Ranked pain points
- Opportunities / feature ideas
- Risks or edge cases
- Suggested next experiments or research

Keep it structured and executive-friendly.`
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

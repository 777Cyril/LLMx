const resources = [
  {
    id: "attention",
    title: "Attention Is All You Need",
    url: "https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf",
    category: "paper",
    caption: "The transformer architecture paper that changed everything. Self-attention mechanisms enabled the current era of LLMs."
  },
  {
    id: "bitter-lesson",
    title: "The Bitter Lesson",
    url: "http://www.incompleteideas.net/IncIdeas/BitterLesson.html",
    category: "essay",
    caption: "Rich Sutton's influential essay arguing that general methods leveraging computation beat hand-engineered solutions."
  },
  {
    id: "backprop",
    title: "Backpropagation",
    url: "https://gwern.net/doc/ai/nn/1986-rumelhart-2.pdf",
    category: "paper",
    caption: "Rumelhart's 1986 paper that popularized backpropagation, making deep learning possible."
  },
  {
    id: "big-world",
    title: "The Big World Hypothesis",
    url: "https://openreview.net/pdf?id=Sv7DazuCn8",
    category: "paper",
    caption: "Explores how models trained on internet-scale data develop emergent capabilities."
  },
  {
    id: "perceptrons",
    title: "Perceptrons",
    url: "https://www.ling.upenn.edu/courses/cogs501/Rosenblatt1958.pdf",
    category: "paper",
    caption: "Rosenblatt's 1958 foundational work on perceptrons—the earliest neural network architecture."
  },
  {
    id: "rlhf",
    title: "RLHF",
    url: "https://arxiv.org/pdf/1909.08593",
    category: "paper",
    caption: "Reinforcement Learning from Human Feedback—the technique that makes language models actually useful."
  },
  {
    id: "scaling-laws",
    title: "Scaling Laws for Neural Language Models",
    url: "https://arxiv.org/pdf/2001.08361",
    category: "paper",
    caption: "OpenAI's research showing predictable relationships between model size, data, compute, and performance."
  },
  {
    id: "information-theory",
    title: "A Mathematical Theory of Communication",
    url: "https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf",
    category: "paper",
    caption: "Shannon's 1948 masterpiece that founded information theory. Essential for understanding language modeling."
  },
  {
    id: "ai-2027",
    title: "AI 2027",
    url: "https://ai-2027.com/",
    category: "resource",
    caption: "A detailed scenario exploring how transformative AI could unfold over the next few years."
  },
  {
    id: "imagenet",
    title: "ImageNet",
    url: "https://proceedings.neurips.cc/paper_files/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf",
    category: "paper",
    caption: "AlexNet's ImageNet breakthrough paper that reignited interest in deep learning in 2012."
  },
  {
    id: "ai-timeline",
    title: "AI Timeline",
    url: "https://ai-timeline.org/",
    category: "resource",
    caption: "A comprehensive interactive timeline of AI development milestones and breakthroughs."
  },
  {
    id: "dwarkesh",
    title: "Dwarkesh Patel Podcast",
    url: "https://www.youtube.com/@DwarkeshPatel/videos",
    category: "podcast",
    caption: "Deep technical interviews with AI researchers. Some of the best long-form AI conversations available."
  },
  {
    id: "metislist",
    title: "The World's Top AI Researchers",
    url: "https://www.metislist.com/",
    category: "resource",
    caption: "A curated directory of influential AI researchers and their contributions."
  },
  {
    id: "embeddings",
    title: "Hugging Face Embeddings Primer",
    url: "https://huggingface.co/spaces/hesamation/primer-llm-embedding?section=what_are_embeddings",
    category: "tutorial",
    caption: "An interactive guide to understanding embeddings—how machines represent meaning as vectors."
  },
  {
    id: "karpathy-llm",
    title: "Andrej Karpathy's Deep Dive into LLMs",
    url: "https://www.youtube.com/watch?v=7xTGNNLPyMI",
    category: "video",
    caption: "A comprehensive walkthrough of how LLMs work, from tokenization to generation. Essential viewing."
  },
  {
    id: "llm-visualization",
    title: "LLM Visualization",
    url: "https://bbycroft.net/llm",
    category: "resource",
    caption: "An interactive 3D visualization showing how large language models work internally. Explore the architecture in motion."
  },
  {
    id: "instruct-gpt",
    title: "InstructGPT",
    url: "https://arxiv.org/pdf/2203.02155",
    category: "paper",
    caption: "Training language models to follow instructions with human feedback. The paper behind ChatGPT's ability to understand and follow user instructions."
  },
  {
    id: "llm-history",
    title: "A History of Large Language Models",
    url: "https://gregorygundersen.com/blog/2025/10/01/large-language-models/",
    category: "essay",
    caption: "A comprehensive overview tracing the evolution of LLMs from early foundations to modern architectures."
  },
  {
    id: "deep-learning-book",
    title: "Deep Learning",
    url: "https://www.deeplearningbook.org/",
    category: "resource",
    caption: "Goodfellow, Bengio, and Courville's comprehensive textbook on deep learning. The definitive academic reference for the field."
  }
];

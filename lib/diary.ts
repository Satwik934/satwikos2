export type Entry = { date: string; title: string; tags: string[]; content: string };
// Replace these example entries with your own real experiences.
export const entries: Entry[] = [

  {
    date: 'ENTRY_001',
    title: 'Hello, World!',
    tags: ['intro', 'dev-journal', 'learning'],
    content: "Every developer starts somewhere, and this is where I'll document my journey. I've been exploring web development, AI, and databases through projects like SiteTrack, GreenLens, and StockFlow. Each project has brought new challenges, unexpected bugs, and valuable lessons. One thing I've learned is that programming isn't just about writing code; it's about solving problems, experimenting, and continuously improving. This journal will be a space to share what I'm building, what I'm learning, and the challenges I overcome along the way."
  },

  {
    date: 'ENTRY_002',
    title: 'Things I Want to Explore',
    tags: ['ideas', 'roadmap', 'learning'],
    content: "I'm excited to explore AI, machine learning, cloud computing, and full-stack development. I want to build smarter applications, learn more about system design, and experiment with new technologies. My goal is to turn creative ideas into useful projects while continuously improving my skills as a developer."
  },

  {
    date: 'ENTRY_003',
    title: 'Lessons from Debugging',
    tags: ['debugging', 'problem-solving', 'learning'],
    content: "Debugging has taught me to be patient and think logically. While working with Python scripts and SQL databases, I've faced issues with data processing and unexpected errors. Instead of guessing, I learned to check logs, test different solutions, and find the root cause. Every bug is an opportunity to understand the code better and become a stronger developer."
  },
  ];

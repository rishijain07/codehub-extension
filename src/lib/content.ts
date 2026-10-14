export const SITE = 'https://rishijain07.github.io/codehub-extension/';
export const STORE =
  'https://chromewebstore.google.com/detail/codehub/dgjlfbfaepcbokmgpicnngbdfckcloaf';
export const REPO = 'https://github.com/rishijain07/codehub-extension';
export const asset = (path: string) =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path}`;

export const platforms = [
  {
    name: 'LeetCode',
    slug: 'leetcode',
    folder: 'leetcode/',
    note: 'Accepted submissions, automatically saved.',
    detail:
      'CodeHub captures your accepted solution, problem description, difficulty, tags, and performance details.',
    url: 'https://leetcode.com/',
    mark: 'LC',
  },
  {
    name: 'GeeksforGeeks',
    slug: 'geeksforgeeks',
    folder: 'geeksforgeeks/',
    note: 'Your GFG practice, in your GitHub history.',
    detail:
      'Accepted practice submissions become code files with problem documentation in a dedicated platform folder.',
    url: 'https://www.geeksforgeeks.org/',
    mark: 'GFG',
  },
  {
    name: 'Codeforces',
    slug: 'codeforces',
    folder: 'codeforces/',
    note: 'Add your handle. Let CodeHub catch up.',
    detail:
      'Background checks of the official public API find accepted practice and contest submissions for your handle.',
    url: 'https://codeforces.com/',
    mark: 'CF',
  },
  {
    name: 'CodeChef',
    slug: 'codechef',
    folder: 'codechef/',
    note: 'From accepted verdict to committed solution.',
    detail:
      'Capture accepted CodeChef submissions with organized source files and generated problem READMEs.',
    url: 'https://www.codechef.com/',
    mark: 'CC',
  },
  {
    name: 'NeetCode',
    slug: 'neetcode',
    folder: 'neetcode/',
    note: 'Interview prep you can come back to.',
    detail:
      'Keep accepted NeetCode solutions alongside the rest of your practice in the same GitHub repository.',
    url: 'https://neetcode.io/',
    mark: 'N',
  },
  {
    name: 'HackerRank',
    slug: 'hackerrank',
    folder: 'hackerrank/',
    note: 'Public challenges, including fullscreen.',
    detail:
      'Practice, Prepare, and public contest challenges are supported. Private hiring assessments, tests, and interview pages are excluded.',
    url: 'https://www.hackerrank.com/',
    mark: 'HR',
  },
  {
    name: 'Code360',
    slug: 'codingninjas',
    folder: 'codingninjas/',
    note: 'Coding Ninjas solutions, now in the mix.',
    detail:
      'CodeHub confirms accepted submissions on supported Code360 and Coding Ninjas problem pages, then saves the code, README, and statistics.',
    url: 'https://www.naukri.com/code360/problems',
    mark: '360',
  },
];

export const faqs = [
  {
    question: 'Which coding platforms can CodeHub sync to GitHub?',
    answer:
      'CodeHub supports LeetCode, GeeksforGeeks, Codeforces, CodeChef, NeetCode, public HackerRank challenges, and Code360 (Coding Ninjas). All seven feed into the repository you choose.',
  },
  {
    question: 'Does CodeHub work with private GitHub repositories?',
    answer:
      'Yes. You can choose a public or private repository. GitHub authentication requests the repository permissions needed to commit your solutions. You can revoke access in your GitHub settings.',
  },
  {
    question: 'What happens when I solve the same problem again?',
    answer:
      'CodeHub keeps problems in their own directories. Later submissions become new commits, so earlier versions remain in your Git history.',
  },
  {
    question: 'How does Codeforces background sync work?',
    answer:
      'Add your Codeforces handle in the extension. CodeHub periodically checks the official public Codeforces API for accepted contest and practice submissions.',
  },
  {
    question: 'Which HackerRank challenges are supported?',
    answer:
      'Public Practice and Prepare challenges, plus anonymously accessible public contest challenges. Fullscreen challenge pages are supported. Hiring assessments, tests, and interview pages are excluded. HackerRank editor access on Firefox requires Firefox 128 or later.',
  },
  {
    question: 'How does Code360 (Coding Ninjas) sync work?',
    answer:
      'CodeHub captures submitted code on supported Code360 and Coding Ninjas problem pages, confirms acceptance through the platform API using your active session, and saves the solution, README, and statistics under codingninjas/.',
  },
  {
    question: 'Is CodeHub free? Where is my code stored?',
    answer:
      'CodeHub is free to install from the Chrome Web Store. Accepted code and problem documentation go to your selected GitHub repository. CodeHub has no intermediary server or hosted database. The GitHub token stays in extension storage and is used with the GitHub API.',
  },
];

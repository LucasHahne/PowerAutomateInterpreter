/**
 * Links to open GitHub issues (bug report) or feature request with pre-filled
 * title and body. Set VITE_GITHUB_REPO in .env to your repo (e.g.
 * https://github.com/username/PowerAutomateInterpreter).
 */
const GITHUB_REPO =
  import.meta.env.VITE_GITHUB_REPO ??
  "https://github.com/yourusername/PowerAutomateInterpreter";

function buildIssueUrl(title: string, body: string): string {
  const params = new URLSearchParams({
    title,
    body,
  });
  return `${GITHUB_REPO.replace(/\/$/, "")}/issues/new?${params.toString()}`;
}

const BUG_REPORT_TITLE = "Bug: ";
const BUG_REPORT_BODY = `**Describe the bug**
A clear and concise description of what went wrong.

**To reproduce**
1. Add variables (if needed)
2. Enter expression: \`\`\`
   (paste your expression here)
   \`\`\`
3. Run and describe what happened

**Expected result**
What you expected to see.

**Actual result**
What you actually saw (error message or wrong value).

**Environment**
- Browser: 
- App version: (see header)
`;

const FEATURE_REQUEST_TITLE = "Feature: ";
const FEATURE_REQUEST_BODY = `**Is your feature related to a problem?**
A short description of the problem (e.g. "I always need to …").

**Describe the solution you'd like**
What you want the interpreter to support or how the app should behave.

**Example**
If applicable, example expression or usage:
\`\`\`
(e.g. myNewFunction('example'))
\`\`\`

**Additional context**
Any other context or screenshots.
`;

const issueUrl = buildIssueUrl(BUG_REPORT_TITLE, BUG_REPORT_BODY);
const featureUrl = buildIssueUrl(FEATURE_REQUEST_TITLE, FEATURE_REQUEST_BODY);

export function GitHubFeedback() {
  return (
    <section
      id="feedback-section"
      className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50 flex flex-wrap items-center gap-2"
      aria-label="Feedback and support"
    >
      <span className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
        Feedback:
      </span>
      <a
        href={issueUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <svg
          className="w-4 h-4 shrink-0"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
        Report an issue
      </a>
      <span className="text-slate-300 dark:text-slate-600" aria-hidden>
        ·
      </span>
      <a
        href={featureUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <svg
          className="w-4 h-4 shrink-0"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
        </svg>
        Suggest a feature
      </a>
    </section>
  );
}

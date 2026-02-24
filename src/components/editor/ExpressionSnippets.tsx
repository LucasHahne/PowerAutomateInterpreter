import type { CSSProperties } from "react";
import { EXPRESSION_SNIPPETS_SORTED } from "../../constants/snippets";
import type { Snippet } from "../../constants/snippets";

/** Popover dropdown for snippets – same layout and styling as Functions list. */
export function SnippetsPopover({
  onSelect,
  onClose,
  popoverStyle,
}: {
  onSelect: (expression: string) => void;
  onClose: () => void;
  popoverStyle: CSSProperties;
}) {
  return (
    <div
      className="intellisense-popover function-list rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/95 shadow-xl backdrop-blur overflow-hidden min-w-[200px] max-h-[280px] flex flex-col"
      style={popoverStyle}
      role="listbox"
    >
      <div className="flex items-center justify-between gap-2 text-slate-600 dark:text-slate-400 text-xs font-medium uppercase tracking-wider px-3 py-2 border-b border-slate-200 dark:border-slate-700">
        <span>Snippets</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors shrink-0"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="overflow-auto py-1">
        {EXPRESSION_SNIPPETS_SORTED.map((snippet: Snippet) => (
          <button
            key={snippet.label}
            type="button"
            className="w-full text-left px-3 py-2 flex items-center gap-2 transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50"
            onClick={() => {
              onSelect(snippet.expression);
              onClose();
            }}
          >
            <span className="font-mono text-cyan-400 font-medium shrink-0">
              {snippet.label}
            </span>
            <span className="text-slate-600 dark:text-slate-400 text-xs truncate flex-1 min-w-0">
              {snippet.expression}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

interface ExpressionSnippetsProps {
  onInsertExpression: (expression: string) => void;
  disabled?: boolean;
}

/** Inline list of snippets (used when dropdown is not used). Kept for backwards compatibility. */
export function ExpressionSnippets({
  onInsertExpression,
  disabled,
}: ExpressionSnippetsProps) {
  return (
    <div className="mt-3">
      <p className="text-slate-600 dark:text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
        Snippets
      </p>
      <div className="space-y-2 max-h-[200px] overflow-y-auto">
        {EXPRESSION_SNIPPETS_SORTED.map((snippet) => (
          <div
            key={snippet.label}
            className="bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50 overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2 px-3 py-2">
              <code
                className="flex-1 min-w-0 text-emerald-600 dark:text-emerald-400 font-mono text-sm whitespace-pre-wrap break-all"
                title={snippet.expression}
              >
                {snippet.expression}
              </code>
              <button
                type="button"
                onClick={() => onInsertExpression(snippet.expression)}
                disabled={disabled}
                className="btn-secondary text-xs shrink-0 py-1.5 px-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Try
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

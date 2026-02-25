import { useState, useCallback } from "react";
import { HighlightedResult } from "./HighlightedResult";

interface ResultPanelProps {
  result: unknown | null;
}

function resultToCopyText(value: unknown): string {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return String(value);
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

export function ResultPanel({ result }: ResultPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (result === null) return;
    const text = resultToCopyText(result);
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  return (
    <div id="result-content" className="flex flex-col min-h-0">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="section-title m-0">Result</h3>
        {result !== null && (
          <button
            type="button"
            onClick={handleCopy}
            className="btn-secondary text-sm h-8 px-3 shrink-0 inline-flex items-center justify-center"
            aria-label="Copy result"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      {result === null ? (
        <p className="text-slate-600 dark:text-slate-400 text-sm py-2">
          Run an expression to see the result.
        </p>
      ) : (
        <pre id="result-output" className="font-mono text-sm overflow-auto whitespace-pre-wrap break-words rounded-xl p-4 bg-slate-100 border border-slate-300 dark:bg-slate-800 dark:border-slate-700/50 flex-1 min-h-0">
          <HighlightedResult value={result} />
        </pre>
      )}
    </div>
  );
}

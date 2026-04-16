import { useState, useCallback } from "react";
import { HighlightedResult } from "./HighlightedResult";
import type { TraceEvent } from "../../interpreter/trace";
import { TracePanel } from "./TracePanel";

interface ResultPanelProps {
  result: unknown | null;
  trace?: TraceEvent[] | null;
}

function resultToCopyText(value: unknown): string {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return String(value);
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

export function ResultPanel({ result, trace }: ResultPanelProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"result" | "trace">("result");

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
        <div className="flex items-center gap-2">
          <h3 className="section-title m-0">Output</h3>
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 p-1">
            <button
              type="button"
              className={`text-xs px-2 py-1 rounded-md ${
                activeTab === "result"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 dark:text-slate-400"
              }`}
              onClick={() => setActiveTab("result")}
            >
              Result
            </button>
            <button
              type="button"
              className={`text-xs px-2 py-1 rounded-md ${
                activeTab === "trace"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 dark:text-slate-400"
              }`}
              onClick={() => setActiveTab("trace")}
            >
              Trace
            </button>
          </div>
        </div>
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
      ) : activeTab === "result" ? (
        <pre id="result-output" className="font-mono text-sm overflow-auto whitespace-pre-wrap break-words rounded-xl p-4 bg-slate-100 border border-slate-300 dark:bg-slate-800 dark:border-slate-700/50 flex-1 min-h-0">
          <HighlightedResult value={result} />
        </pre>
      ) : (
        <TracePanel trace={trace ?? null} />
      )}
    </div>
  );
}

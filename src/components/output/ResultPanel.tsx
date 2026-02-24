import { HighlightedResult } from "./HighlightedResult";

interface ResultPanelProps {
  result: unknown | null;
}

export function ResultPanel({ result }: ResultPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <h3 className="section-title mb-3">Result</h3>
      {result === null ? (
        <p className="text-slate-600 dark:text-slate-400 text-sm py-2">
          Run an expression to see the result.
        </p>
      ) : (
        <pre className="font-mono text-sm overflow-auto whitespace-pre-wrap break-words rounded-xl p-4 bg-slate-800/50 border border-slate-700/40 flex-1 min-h-0">
          <HighlightedResult value={result} />
        </pre>
      )}
    </div>
  );
}

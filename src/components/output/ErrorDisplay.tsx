import { useState, useCallback } from "react";

interface ErrorDisplayProps {
  error: string | null;
  kind?: string;
}

export function ErrorDisplay({ error, kind }: ErrorDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!error) return;
    void navigator.clipboard.writeText(error).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [error]);

  if (!error) return null;
  return (
    <div className="rounded-xl border border-red-500/40 bg-red-500/5 backdrop-blur-sm p-4 shadow-panel">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {kind && (
            <span className="text-red-400 font-semibold text-xs uppercase tracking-wider block mb-1.5">
              {kind}
            </span>
          )}
          <p className="text-red-400/95 font-mono text-sm">{error}</p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="btn-secondary text-sm h-8 px-3 shrink-0"
          aria-label="Copy error"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

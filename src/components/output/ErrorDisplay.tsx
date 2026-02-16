interface ErrorDisplayProps {
  error: string | null;
  kind?: string;
}

export function ErrorDisplay({ error, kind }: ErrorDisplayProps) {
  if (!error) return null;
  return (
    <div className="rounded-xl border border-red-500/40 bg-red-500/5 backdrop-blur-sm p-4 shadow-panel">
      {kind && (
        <span className="text-red-400 font-semibold text-xs uppercase tracking-wider block mb-1.5">
          {kind}
        </span>
      )}
      <p className="text-red-400/95 font-mono text-sm">{error}</p>
    </div>
  );
}

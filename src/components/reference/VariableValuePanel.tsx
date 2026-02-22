import { HighlightedResult } from '../output/HighlightedResult';

interface VariableValuePanelProps {
  value: unknown;
}

export function VariableValuePanel({ value }: VariableValuePanelProps) {
  return (
    <div className="panel p-5 flex flex-col h-full min-h-0 overflow-hidden">
      <p className="section-label shrink-0">Value</p>
      <h3 className="section-title mb-3 shrink-0">Preview</h3>
      <div className="flex-1 min-h-0 overflow-auto rounded-xl bg-slate-800 border border-slate-700/50 p-4">
        <pre className="font-mono text-sm whitespace-pre-wrap break-words m-0">
          <HighlightedResult value={value} />
        </pre>
      </div>
    </div>
  );
}

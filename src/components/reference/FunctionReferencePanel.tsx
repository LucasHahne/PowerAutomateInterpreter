import { getFunctionMetadata } from "../../interpreter/functions/metadata";

interface FunctionReferencePanelProps {
  selectedFunction: string | null;
}

export function FunctionReferencePanel({
  selectedFunction,
}: FunctionReferencePanelProps) {
  const metadata = selectedFunction
    ? getFunctionMetadata(selectedFunction)
    : null;

  if (!metadata) {
    return (
      <div className="panel p-4 flex flex-col h-full">
        <h3 className="text-slate-700 dark:text-slate-300 font-medium mb-3">
          Function Reference
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Click a function in the expression to see its reference.
        </p>
      </div>
    );
  }

  return (
    <div className="panel p-5 flex flex-col h-full min-h-0 overflow-auto">
      <h3 className="section-title mb-4">Function Reference</h3>

      <div className="space-y-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            {metadata.category}
          </span>
          <h4 className="text-cyan-600 dark:text-cyan-400 font-semibold text-lg mt-0.5">
            {metadata.name}
          </h4>
        </div>

        <div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {metadata.description}
          </p>
        </div>

        <div>
          <p className="text-slate-600 dark:text-slate-400 text-xs font-medium uppercase tracking-wider mb-1.5">
            Signature
          </p>
          <code className="block text-cyan-600 dark:text-cyan-300 font-mono text-sm bg-slate-100 dark:bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700/50">
            {metadata.signature}
          </code>
        </div>

        {metadata.parameters.length > 0 && (
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">
              Parameters
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-1.5 pr-3 font-medium">Name</th>
                    <th className="pb-1.5 pr-3 font-medium">Type</th>
                    <th className="pb-1.5 font-medium">Required</th>
                  </tr>
                </thead>
                <tbody>
                  {metadata.parameters.map((param) => (
                    <tr
                      key={param.name}
                      className="border-b border-slate-200 dark:border-slate-700/50"
                    >
                      <td className="py-1.5 pr-3 text-slate-800 dark:text-slate-200 font-mono">
                        {param.name}
                      </td>
                      <td className="py-1.5 pr-3 text-slate-600 dark:text-slate-400">
                        {param.type}
                      </td>
                      <td className="py-1.5 text-slate-600 dark:text-slate-400">
                        {param.required !== false ? "Yes" : "Optional"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div>
          <p className="text-slate-600 dark:text-slate-400 text-xs font-medium uppercase tracking-wider mb-1.5">
            Returns
          </p>
          <p className="text-slate-700 dark:text-slate-300 text-sm">
            {metadata.returns}
          </p>
        </div>

        <div>
          <p className="text-slate-600 dark:text-slate-400 text-xs font-medium uppercase tracking-wider mb-1.5">
            Examples
          </p>
          <div className="space-y-3">
            {metadata.examples.map((ex, i) => (
              <div
                key={i}
                className="bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50 overflow-hidden"
              >
                <code className="block text-emerald-600 dark:text-emerald-400 font-mono text-sm px-3 py-2 whitespace-pre-wrap break-all">
                  {ex.expression}
                </code>
                <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="text-slate-500 text-xs">→ </span>
                  <code className="text-amber-600 dark:text-amber-300/90">
                    {ex.result}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>

        <a
          href={metadata.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 text-sm transition-colors"
        >
          View Microsoft Docs
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}

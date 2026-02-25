import { useState, useRef, useCallback } from "react";
import type { InputType } from "./interpreter/context";
import { AppShell } from "./components/layout/AppShell";
import { InputDefinitionPanel } from "./components/inputs/InputDefinitionPanel";
import { ExpressionEditor } from "./components/editor/ExpressionEditor";
import { RunButton } from "./components/editor/RunButton";
import { ResultPanel } from "./components/output/ResultPanel";
import { ErrorDisplay } from "./components/output/ErrorDisplay";
import { GitHubFeedback } from "./components/output/GitHubFeedback";
import { FunctionReferencePanel } from "./components/reference/FunctionReferencePanel";
import { VariableInputPanel } from "./components/reference/VariableInputPanel";
import { VariableValuePanel } from "./components/reference/VariableValuePanel";
import { parseValue } from "./components/inputs/variableFormUtils";
import { useInterpreter } from "./hooks/useInterpreter";

const NEW_VARIABLE_SENTINEL = "";

const MAX_HISTORY = 15;

function truncateExpr(s: string, max = 50): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return t.slice(0, max) + "…";
}

function App() {
  const { context, setContext, expression, setExpression, output, run, runExpression } =
    useInterpreter();
  const [expressionHistory, setExpressionHistory] = useState<string[]>([]);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [selectedVariable, setSelectedVariable] = useState<string | null>(null);
  const [variablePreviewValue, setVariablePreviewValue] =
    useState<unknown>(undefined);
  const intellisensePortalRef = useRef<HTMLDivElement>(null);

  const handleRun = useCallback(() => {
    run();
    const trimmed = expression.trim();
    if (trimmed) {
      setExpressionHistory((prev) => {
        if (prev[0] === trimmed) return prev;
        const next = [trimmed, ...prev.filter((e) => e !== trimmed)];
        return next.slice(0, MAX_HISTORY);
      });
    }
  }, [run, expression]);

  const handleVariableClick = useCallback((name: string) => {
    setSelectedVariable(name);
    setSelectedFunction(null);
    setVariablePreviewValue(undefined);
  }, []);

  const handleAddVariable = useCallback(() => {
    setSelectedVariable(NEW_VARIABLE_SENTINEL);
    setSelectedFunction(null);
    setVariablePreviewValue(undefined);
  }, []);

  const handleFunctionClick = useCallback((name: string | null) => {
    setSelectedFunction(name);
    setSelectedVariable(null);
  }, []);

  const handleSaveVariable = useCallback(
    (name: string, type: InputType, valueStr: string) => {
      const val = parseValue(valueStr, type);
      setContext((prev) => {
        const next = { ...prev.variables };
        if (
          selectedVariable !== null &&
          selectedVariable !== NEW_VARIABLE_SENTINEL &&
          selectedVariable !== name
        ) {
          delete next[selectedVariable];
        }
        next[name] = { value: val, type };
        return { ...prev, variables: next, parameters: next };
      });
      setSelectedVariable(null);
    },
    [selectedVariable, setContext],
  );

  const handleRemoveVariable = useCallback(
    (name: string) => {
      setContext((prev) => {
        const next = { ...prev.variables };
        delete next[name];
        return { ...prev, variables: next, parameters: next };
      });
      setSelectedVariable(null);
    },
    [setContext],
  );

  const handleCancelVariable = useCallback(() => {
    setSelectedVariable(null);
    setVariablePreviewValue(undefined);
  }, []);

  const referencePanelContent =
    selectedVariable !== null ? (
      <VariableInputPanel
        selectedVariable={selectedVariable}
        context={context}
        onSave={handleSaveVariable}
        onRemove={handleRemoveVariable}
        onCancel={handleCancelVariable}
        onParsedValueChange={setVariablePreviewValue}
      />
    ) : selectedFunction ? (
      <FunctionReferencePanel
        selectedFunction={selectedFunction}
        onInsertExpression={(expr) => setExpression(expr)}
      />
    ) : (
      <div id="reference-placeholder" className="panel p-4 flex flex-col h-full">
        <h3 className="text-slate-700 dark:text-slate-300 font-medium mb-3">
          Reference
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Click a variable or a function in the expression to see its details.
        </p>
      </div>
    );

  const showVariableValuePanel = selectedVariable !== null;

  return (
    <AppShell>
      {/* Desktop: left = 3 stacked sections, middle = reference/variable form, right = variable value (when variable selected). Mobile: single column. */}
      <div
        id="workspace"
        className={`min-h-full grid gap-4 lg:gap-6 grid-rows-1 ${
          showVariableValuePanel
            ? "grid-cols-1 lg:grid-cols-[1fr_minmax(300px,400px)_minmax(280px,360px)]"
            : "grid-cols-1 lg:grid-cols-[1fr_minmax(300px,400px)]"
        }`}
      >
        {/* Left column: Variables, Expression, Result. Column and page grow when result is large. */}
        <div id="editor-column" className="flex flex-col gap-4 min-h-0 order-1">
          <div id="variables-panel" className="panel flex-none flex flex-col min-h-0 overflow-hidden p-0">
            <InputDefinitionPanel
              context={context}
              onChange={setContext}
              onVariableClick={handleVariableClick}
              onAddVariable={handleAddVariable}
            />
          </div>
          <div id="expression-section" className="panel flex-none flex flex-col min-h-[120px] overflow-visible p-5 relative z-10">
            <h3 className="section-title mb-3">Evaluate Expression</h3>
            <ExpressionEditor
              value={expression}
              onChange={setExpression}
              onFunctionClick={handleFunctionClick}
              onInsertSnippet={(expr) => setExpression(expr)}
              onRun={handleRun}
              intellisensePortalRef={intellisensePortalRef}
            />
            <div className="mt-4 flex items-start gap-3 flex-wrap">
              <RunButton onClick={handleRun} />
              <div
                ref={intellisensePortalRef}
                className="relative min-w-[200px]"
                aria-hidden
              />
            </div>
            {expressionHistory.length > 0 && (
              <div className="mt-3">
                <p className="text-slate-600 dark:text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
                  Recent
                </p>
                <ul
                  id="expression-history"
                  className={`space-y-1.5 overflow-y-auto pt-2 ${
                    expressionHistory.length > 3 ? "max-h-[120px]" : ""
                  }`}
                >
                  {expressionHistory.slice(0, MAX_HISTORY).map((expr) => (
                    <li
                      key={expr}
                      className="flex items-center gap-2 text-sm min-w-0"
                    >
                      <code className="flex-1 min-w-0 truncate text-slate-600 dark:text-slate-400 font-mono text-xs">
                        {truncateExpr(expr)}
                      </code>
                      <div className="flex gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setExpression(expr)}
                          className="btn-secondary text-xs py-1 px-2"
                        >
                          Use
                        </button>
                        <button
                          type="button"
                          onClick={() => runExpression(expr)}
                          className="btn-primary text-xs py-1 px-2"
                        >
                          Run
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {output && !output.success && (
              <div id="expression-errors" className="mt-3">
                <ErrorDisplay error={output.error} kind={output.kind} />
              </div>
            )}
          </div>
          <div id="result-section" className="panel flex-1 flex flex-col min-h-0 p-5 relative z-0">
            <ResultPanel result={output?.success ? output.value : null} />
            <GitHubFeedback />
          </div>
        </div>
        {/* Middle column: Function reference or variable input. Subtle cyan border + shadow when add variable is selected. */}
        <div
          id="reference-panel"
          className={`min-h-[320px] lg:min-h-full lg:h-full flex flex-col order-2 rounded-2xl transition-all duration-200 ${
            selectedVariable === NEW_VARIABLE_SENTINEL
              ? "border border-cyan-500/40 shadow-[0_0_24px_rgba(34,211,238,0.12)]"
              : "border border-transparent"
          }`}
        >
          <div className="h-full min-h-0 flex flex-col overflow-hidden rounded-2xl">
            {referencePanelContent}
          </div>
        </div>
        {/* Fourth column: Variable value preview (only when adding/editing a variable) */}
        {showVariableValuePanel && (
          <div id="variable-value-panel" className="min-h-[320px] lg:min-h-full lg:h-full flex flex-col order-3">
            <VariableValuePanel value={variablePreviewValue} />
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default App;

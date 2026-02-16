import { useState, useRef, useCallback } from "react";
import type { InputType } from "./interpreter/context";
import { AppShell } from "./components/layout/AppShell";
import { InputDefinitionPanel } from "./components/inputs/InputDefinitionPanel";
import { ExpressionEditor } from "./components/editor/ExpressionEditor";
import { RunButton } from "./components/editor/RunButton";
import { ResultPanel } from "./components/output/ResultPanel";
import { ErrorDisplay } from "./components/output/ErrorDisplay";
import { FunctionReferencePanel } from "./components/reference/FunctionReferencePanel";
import { VariableInputPanel } from "./components/reference/VariableInputPanel";
import { parseValue } from "./components/inputs/variableFormUtils";
import { useInterpreter } from "./hooks/useInterpreter";

const NEW_VARIABLE_SENTINEL = "";

function App() {
  const { context, setContext, expression, setExpression, output, run } =
    useInterpreter();
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [selectedVariable, setSelectedVariable] = useState<string | null>(null);
  const intellisensePortalRef = useRef<HTMLDivElement>(null);

  const handleVariableClick = useCallback((name: string) => {
    setSelectedVariable(name);
    setSelectedFunction(null);
  }, []);

  const handleAddVariable = useCallback(() => {
    setSelectedVariable(NEW_VARIABLE_SENTINEL);
    setSelectedFunction(null);
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
    [selectedVariable, setContext]
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
    [setContext]
  );

  const handleCancelVariable = useCallback(() => {
    setSelectedVariable(null);
  }, []);

  const rightPanelContent =
    selectedVariable !== null ? (
      <VariableInputPanel
        selectedVariable={selectedVariable}
        context={context}
        onSave={handleSaveVariable}
        onRemove={handleRemoveVariable}
        onCancel={handleCancelVariable}
      />
    ) : selectedFunction ? (
      <FunctionReferencePanel selectedFunction={selectedFunction} />
    ) : (
      <div className="panel p-4 flex flex-col h-full">
        <h3 className="text-slate-300 font-medium mb-3">Reference</h3>
        <p className="text-slate-500 text-sm">
          Click a variable or a function in the expression to see its details.
        </p>
      </div>
    );

  return (
    <AppShell>
      {/* Desktop: left = 3 stacked sections, right = function reference full height. Mobile: single column. */}
      <div className="h-full min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_minmax(300px,400px)] gap-4 lg:gap-6 grid-rows-1">
        {/* Left column: Variables (fixed height), Expression (grows with textarea), Result (fills rest). Column scrolls when needed. */}
        <div className="flex flex-col gap-4 min-h-0 lg:min-h-full overflow-auto order-1">
          <div className="panel flex-none flex flex-col min-h-[220px] max-h-[40vh] overflow-hidden p-0">
            <InputDefinitionPanel
              context={context}
              onChange={setContext}
              onVariableClick={handleVariableClick}
              onAddVariable={handleAddVariable}
            />
          </div>
          <div className="panel flex-none flex flex-col min-h-[120px] overflow-visible p-5 relative z-10">
            <h3 className="section-title mb-3">Evaluate Expression</h3>
            <ExpressionEditor
              value={expression}
              onChange={setExpression}
              onFunctionClick={handleFunctionClick}
              intellisensePortalRef={intellisensePortalRef}
            />
            <div className="mt-4 flex items-start gap-3">
              <RunButton onClick={run} />
              <div
                ref={intellisensePortalRef}
                className="relative min-w-[200px]"
                aria-hidden
              />
            </div>
            {output && !output.success && (
              <div className="mt-3">
                <ErrorDisplay error={output.error} kind={output.kind} />
              </div>
            )}
          </div>
          <div className="panel flex-1 flex flex-col min-h-0 overflow-hidden p-5 relative z-0">
            <ResultPanel result={output?.success ? output.value : null} />
          </div>
        </div>
        {/* Right column: Function reference or variable input. Subtle cyan border + shadow when add variable is selected. */}
        <div
          className={`min-h-[320px] lg:min-h-full lg:h-full flex flex-col order-2 rounded-2xl transition-all duration-200 ${
            selectedVariable === NEW_VARIABLE_SENTINEL
              ? 'border border-cyan-500/40 shadow-[0_0_24px_rgba(34,211,238,0.12)]'
              : 'border border-transparent'
          }`}
        >
          <div className="h-full min-h-0 flex flex-col overflow-hidden rounded-2xl">
            {rightPanelContent}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default App;

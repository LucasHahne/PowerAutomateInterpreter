import { VariableCard } from "./VariableCard";
import type { EvaluationContext, TypedInput } from "../../interpreter/context";

interface InputDefinitionPanelProps {
  context: EvaluationContext;
  onChange: (context: EvaluationContext) => void;
  onVariableClick: (name: string) => void;
  onAddVariable: () => void;
}

export function InputDefinitionPanel({
  context,
  onChange,
  onVariableClick,
  onAddVariable,
}: InputDefinitionPanelProps) {
  const entries = context.variables;

  const setEntries = (
    updater: (prev: Record<string, TypedInput>) => Record<string, TypedInput>,
  ) => {
    const next = updater(entries);
    onChange({
      ...context,
      parameters: next,
      variables: next,
    });
  };

  const removeEntry = (name: string) => {
    setEntries((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  return (
    <div className="flex flex-col min-h-0 p-5">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="section-title m-0">Variables</h3>
        <button
          type="button"
          onClick={onAddVariable}
          className="btn-primary text-sm py-2 px-4"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2 items-start overflow-y-auto max-h-[40vh] min-h-0">
        {Object.entries(entries).length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400 text-sm py-4">
            No variables. Click Add to create one.
          </p>
        ) : (
          Object.entries(entries).map(([name, { type, value }]) => (
            <VariableCard
              key={name}
              name={name}
              type={type}
              value={value}
              onEdit={() => onVariableClick(name)}
              onRemove={() => removeEntry(name)}
            />
          ))
        )}
      </div>
    </div>
  );
}

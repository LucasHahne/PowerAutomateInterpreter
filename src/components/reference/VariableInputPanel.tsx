import { useState, useEffect } from "react";
import type { EvaluationContext, InputType } from "../../interpreter/context";
import {
  parseValue,
  valueToString,
  validateValue,
} from "../inputs/variableFormUtils";

const INPUT_TYPES: InputType[] = [
  "string",
  "integer",
  "float",
  "boolean",
  "object",
  "array",
];

const NEW_VARIABLE_SENTINEL = "";

interface VariableInputPanelProps {
  /** Empty string = add new variable; otherwise the variable name to edit */
  selectedVariable: string;
  context: EvaluationContext;
  onSave: (name: string, type: InputType, valueStr: string) => void;
  onRemove: (name: string) => void;
  onCancel: () => void;
  /** Called when the parsed value changes (for live preview in the fourth panel) */
  onParsedValueChange?: (value: unknown) => void;
}

function getInitialState(
  selectedVariable: string,
  context: EvaluationContext,
): { name: string; type: InputType; valueStr: string } {
  if (selectedVariable === NEW_VARIABLE_SENTINEL) {
    return { name: "", type: "string", valueStr: "" };
  }
  const entry = context.variables[selectedVariable];
  if (!entry) return { name: "", type: "string", valueStr: "" };
  return {
    name: selectedVariable,
    type: entry.type,
    valueStr: valueToString(entry.value, entry.type),
  };
}

export function VariableInputPanel({
  selectedVariable,
  context,
  onSave,
  onRemove,
  onCancel,
  onParsedValueChange,
}: VariableInputPanelProps) {
  const isNew = selectedVariable === NEW_VARIABLE_SENTINEL;
  const [name, setName] = useState("");
  const [type, setType] = useState<InputType>("string");
  const [valueStr, setValueStr] = useState("");

  useEffect(() => {
    const initial = getInitialState(selectedVariable, context);
    setName(initial.name);
    setType(initial.type);
    setValueStr(initial.valueStr);
  }, [selectedVariable, context]);

  const nameTrimmed = name.trim();
  const nameValid = nameTrimmed.length > 0;
  const existingNames = Object.keys(context.variables).filter(
    (k) => k !== selectedVariable,
  );
  const nameConflict = nameValid && existingNames.includes(nameTrimmed);
  const nameOk = nameValid && !nameConflict;

  const valueValid = validateValue(valueStr, type);
  const canSave = nameOk && valueValid;

  const parsedValue = (() => {
    if (!valueStr.trim() && (type === "object" || type === "array"))
      return type === "object" ? {} : [];
    try {
      return parseValue(valueStr, type);
    } catch {
      return undefined;
    }
  })();

  useEffect(() => {
    onParsedValueChange?.(parsedValue);
  }, [parsedValue, onParsedValueChange]);

  const handleSave = () => {
    if (!canSave) return;
    onSave(nameTrimmed, type, valueStr);
    onCancel();
  };

  const handleRemove = () => {
    if (!isNew) onRemove(selectedVariable);
    onCancel();
  };

  const isJson = type === "object" || type === "array";

  return (
    <div className="panel p-5 flex flex-col h-full min-h-0 overflow-hidden">
      <h3 className="section-title mb-4 shrink-0">
        {isNew ? "Add variable" : "Edit variable"}
      </h3>

      <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto overflow-x-hidden min-w-0 px-1">
        <div className="shrink-0">
          <label className="block text-slate-600 dark:text-slate-400 text-sm font-medium mb-1.5">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. myVar"
            className="input-dark w-full"
            autoFocus={isNew}
          />
          {!nameValid && name.length > 0 && (
            <p className="text-red-400 text-xs mt-1">Name is required</p>
          )}
          {nameConflict && (
            <p className="text-red-400 text-xs mt-1">
              A variable with this name already exists
            </p>
          )}
        </div>

        <div className="shrink-0">
          <label className="block text-slate-600 dark:text-slate-400 text-sm font-medium mb-1.5">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as InputType)}
            className="input-dark w-full"
          >
            {INPUT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col min-h-0 flex-1">
          <label className="block text-slate-600 dark:text-slate-400 text-sm font-medium mb-1.5 shrink-0">
            Value
          </label>
          {isJson ? (
            <div className="flex flex-col min-h-0 flex-1">
              <textarea
                value={valueStr}
                onChange={(e) => setValueStr(e.target.value)}
                placeholder={
                  type === "object" ? '{"key": "value"}' : "[1, 2, 3]"
                }
                className="input-dark w-full flex-1 min-h-[80px] font-mono text-sm resize-none"
                spellCheck={false}
              />
              {valueStr.trim() && parsedValue === undefined && (
                <p className="text-red-400 text-xs mt-1 shrink-0">
                  {type === "object"
                    ? "Enter valid JSON object"
                    : "Enter valid JSON array"}
                </p>
              )}
            </div>
          ) : type === "boolean" ? (
            <select
              value={valueStr}
              onChange={(e) => setValueStr(e.target.value)}
              className="input-dark w-full"
            >
              <option value="">Select...</option>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          ) : (
            <>
              <input
                type="text"
                inputMode={
                  type === "integer" || type === "float" ? "decimal" : "text"
                }
                value={valueStr}
                onChange={(e) => setValueStr(e.target.value)}
                placeholder={
                  type === "integer"
                    ? "e.g. 42"
                    : type === "float"
                      ? "e.g. 3.14"
                      : "Value"
                }
                className="input-dark w-full"
              />
            </>
          )}
          {!valueValid && valueStr !== "" && type !== "string" && (
            <p className="text-red-400 text-xs mt-1">
              {type === "integer" && "Enter a valid integer"}
              {type === "float" && "Enter a valid number"}
              {type === "boolean" && "Select true or false"}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4 shrink-0">
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isNew ? "Add" : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        {!isNew && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-400 hover:bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2 text-sm transition-colors"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

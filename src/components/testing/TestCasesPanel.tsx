import { useMemo, useState, useCallback } from "react";
import type { InputType, TypedInput } from "../../interpreter/context";
import type { TestCase, TestRunResult, TestCaseContextOverride, Expectation } from "../../testing/testCases";
import { parseValue, valueToString } from "../inputs/variableFormUtils";

function inferInputType(value: unknown): InputType {
  if (typeof value === "string") return "string";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return Number.isInteger(value) ? "integer" : "float";
  if (Array.isArray(value)) return "array";
  if (value !== null && typeof value === "object") return "object";
  return "string";
}

function typedInputsFromObject(obj: Record<string, unknown>): Record<string, TypedInput> {
  const out: Record<string, TypedInput> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = { type: inferInputType(v), value: v };
  }
  return out;
}

function tryParseJsonObject(text: string): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  const trimmed = text.trim();
  if (!trimmed) return { ok: true, value: {} };
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false, error: "Variables JSON must be an object (e.g. {\"name\":\"Ada\"})." };
    }
    return { ok: true, value: parsed as Record<string, unknown> };
  } catch {
    return { ok: false, error: "Invalid JSON." };
  }
}

function expectationSummary(expect: Expectation): string {
  if (expect.kind === "value") return "Value";
  return `Error: ${expect.errorKind}${expect.messageIncludes ? ` (includes ${JSON.stringify(expect.messageIncludes)})` : ""}`;
}

function formatOutputSummary(output: TestRunResult["output"]): string {
  if (output.success) {
    if (typeof output.value === "string") return output.value;
    if (output.value === null || output.value === undefined) return String(output.value);
    if (typeof output.value === "object") return JSON.stringify(output.value);
    return String(output.value);
  }
  return `${output.kind ?? "Error"}: ${output.error}`;
}

type EditorDraft = {
  name: string;
  variablesJson: string;
  expectKind: "value" | "error";
  expectType: InputType;
  expectValue: string;
  errorKind: Exclude<Expectation, { kind: "value" }>["errorKind"];
  messageIncludes: string;
};

function draftFromCase(tc: TestCase): EditorDraft {
  const varObj: Record<string, unknown> = {};
  const vars = tc.contextOverride?.variables ?? {};
  for (const [k, v] of Object.entries(vars)) varObj[k] = v.value;

  if (tc.expect.kind === "value") {
    const t = inferInputType(tc.expect.value);
    return {
      name: tc.name,
      variablesJson: JSON.stringify(varObj, null, 2),
      expectKind: "value",
      expectType: t,
      expectValue: valueToString(tc.expect.value, t),
      errorKind: "RuntimeError",
      messageIncludes: "",
    };
  }
  return {
    name: tc.name,
    variablesJson: JSON.stringify(varObj, null, 2),
    expectKind: "error",
    expectType: "string",
    expectValue: "",
    errorKind: tc.expect.errorKind,
    messageIncludes: tc.expect.messageIncludes ?? "",
  };
}

function makeOverrideFromVariablesJson(text: string): { ok: true; override: TestCaseContextOverride } | { ok: false; error: string } {
  const parsed = tryParseJsonObject(text);
  if (!parsed.ok) return parsed;
  const typed = typedInputsFromObject(parsed.value);
  return { ok: true, override: { variables: typed, parameters: typed } };
}

export interface TestCasesPanelProps {
  expression: string;
  cases: TestCase[];
  results: TestRunResult[] | null;
  onChangeCases: (next: TestCase[]) => void;
  onRunAll: () => void;
  showTopDivider?: boolean;
}

export function TestCasesPanel({
  expression,
  cases,
  results,
  onChangeCases,
  onRunAll,
  showTopDivider = true,
}: TestCasesPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingCase = useMemo(() => cases.find((c) => c.id === editingId) ?? null, [cases, editingId]);
  const [draft, setDraft] = useState<EditorDraft | null>(null);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [expandedResultCaseId, setExpandedResultCaseId] = useState<string | null>(null);

  const openEditor = useCallback((tc: TestCase) => {
    setEditingId(tc.id);
    setDraft(draftFromCase(tc));
    setEditorError(null);
  }, []);

  const addCase = useCallback(() => {
    const id = crypto.randomUUID();
    const tc: TestCase = {
      id,
      name: `Case ${cases.length + 1}`,
      contextOverride: { variables: {}, parameters: {} },
      expect: { kind: "value", value: "" },
    };
    onChangeCases([tc, ...cases]);
    openEditor(tc);
  }, [cases, onChangeCases, openEditor]);

  const removeCase = useCallback((id: string) => {
    onChangeCases(cases.filter((c) => c.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setDraft(null);
      setEditorError(null);
    }
  }, [cases, editingId, onChangeCases]);

  const saveDraft = useCallback(() => {
    if (!editingCase || !draft) return;

    const ov = makeOverrideFromVariablesJson(draft.variablesJson);
    if (!ov.ok) {
      setEditorError(ov.error);
      return;
    }

    let expect: Expectation;
    if (draft.expectKind === "value") {
      const value = parseValue(draft.expectValue, draft.expectType);
      expect = { kind: "value", value };
    } else {
      expect = {
        kind: "error",
        errorKind: draft.errorKind,
        messageIncludes: draft.messageIncludes.trim() ? draft.messageIncludes.trim() : undefined,
      };
    }

    const updated: TestCase = {
      ...editingCase,
      name: draft.name.trim() || editingCase.name,
      contextOverride: ov.override,
      expect,
    };

    onChangeCases(cases.map((c) => (c.id === editingCase.id ? updated : c)));
    setEditorError(null);
    setEditingId(null);
    setDraft(null);
  }, [cases, draft, editingCase, onChangeCases]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setDraft(null);
    setEditorError(null);
  }, []);

  const resultsById = useMemo(() => {
    const m = new Map<string, TestRunResult>();
    for (const r of results ?? []) m.set(r.caseId, r);
    return m;
  }, [results]);

  const compactSecondary = "btn-secondary text-xs !px-3 !py-1.5 !rounded-lg whitespace-nowrap";
  const compactPrimary = "btn-primary text-xs !px-3 !py-1.5 !rounded-lg whitespace-nowrap";

  return (
    <div
      className={
        showTopDivider
          ? "mt-4 border-t border-slate-200/70 dark:border-slate-800 pt-4"
          : "mt-3"
      }
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h4 className="text-slate-700 dark:text-slate-300 font-medium m-0">
          Test cases
        </h4>
        <div className="flex gap-2 flex-wrap justify-end">
          <button type="button" onClick={addCase} className={compactSecondary}>
            Add case
          </button>
          <button
            type="button"
            onClick={onRunAll}
            className={compactPrimary}
            disabled={!expression.trim() || cases.length === 0}
            title={!expression.trim() ? "Enter an expression first" : cases.length === 0 ? "Add a case first" : "Run all cases"}
          >
            Run all
          </button>
        </div>
      </div>

      {cases.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">
          Add test cases to run your expression against multiple variable sets.
        </p>
      ) : (
        <div className="mt-3 grid gap-2">
          {cases.map((tc) => {
            const r = resultsById.get(tc.id);
            const pass = r?.pass;
            return (
              <div
                key={tc.id}
                className="flex items-center gap-2 flex-wrap rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2 bg-white/40 dark:bg-slate-900/40"
              >
                <button
                  type="button"
                  onClick={() => openEditor(tc)}
                  className="flex-1 text-left min-w-0"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium text-slate-700 dark:text-slate-200 truncate">
                      {tc.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {expectationSummary(tc.expect)}
                    </span>
                  </div>
                </button>
                <div className="flex items-center gap-2 shrink-0">
                  {r && (
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                        pass
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                      }`}
                    >
                      {pass ? "PASS" : "FAIL"}
                    </span>
                  )}
                  {r && (
                    <button
                      type="button"
                      className={compactSecondary}
                      onClick={() =>
                        setExpandedResultCaseId((prev) => (prev === tc.id ? null : tc.id))
                      }
                    >
                      {expandedResultCaseId === tc.id ? "Hide" : "Details"}
                    </button>
                  )}
                  <button
                    type="button"
                    className={`${compactSecondary} text-rose-700 dark:text-rose-300 hover:bg-rose-500/10 dark:hover:bg-rose-500/10`}
                    onClick={() => removeCase(tc.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {expandedResultCaseId && resultsById.get(expandedResultCaseId) && (
        <div className="mt-3 rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/60 dark:bg-slate-900/40">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            Output
          </p>
          <pre className="font-mono text-xs overflow-auto whitespace-pre-wrap break-words rounded-lg p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            {formatOutputSummary(resultsById.get(expandedResultCaseId)!.output)}
          </pre>
          {!resultsById.get(expandedResultCaseId)!.pass && resultsById.get(expandedResultCaseId)!.failureMessage && (
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-2">
              {resultsById.get(expandedResultCaseId)!.failureMessage}
            </p>
          )}
        </div>
      )}

      {editingCase && draft && (
        <div className="mt-4 rounded-2xl border border-cyan-500/30 p-4 bg-cyan-50/40 dark:bg-slate-900/50">
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <h4 className="text-slate-800 dark:text-slate-200 font-medium m-0">
              Edit test case
            </h4>
            <div className="flex gap-2 flex-wrap justify-end">
              <button type="button" className={compactSecondary} onClick={cancelEdit}>
                Cancel
              </button>
              <button type="button" className={compactPrimary} onClick={saveDraft}>
                Save
              </button>
            </div>
          </div>

          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Name
          </label>
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="input-dark w-full text-sm mb-3"
          />

          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Variables (JSON object)
          </label>
          <textarea
            value={draft.variablesJson}
            onChange={(e) => setDraft({ ...draft, variablesJson: e.target.value })}
            className="input-dark w-full font-mono text-xs min-h-[110px] mb-3"
            spellCheck={false}
          />
          <details className="mb-3">
            <summary className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              Example test case structure
            </summary>
            <div className="mt-2 grid gap-2">
              <div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                  What you paste into <span className="font-medium">Variables (JSON object)</span>:
                </p>
                <pre className="font-mono text-[11px] overflow-auto whitespace-pre rounded-lg p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
{`{
  "name": "Ada",
  "count": 3,
  "enabled": true,
  "items": [1, 2, 3],
  "meta": { "team": "ops" }
}`}
                </pre>
              </div>
              <div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                  Under the hood, a <span className="font-medium">TestCase</span> looks like:
                </p>
                <pre className="font-mono text-[11px] overflow-auto whitespace-pre rounded-lg p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
{`{
  id: "…",
  name: "Case 1",
  contextOverride: {
    variables: {
      name: { type: "string", value: "Ada" },
      count: { type: "integer", value: 3 }
    },
    parameters: { /* same structure as variables */ }
  },
  expect: { kind: "value", value: "Ada" }
}`}
                </pre>
              </div>
            </div>
          </details>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Expectation
              </label>
              <select
                value={draft.expectKind}
                onChange={(e) =>
                  setDraft({ ...draft, expectKind: e.target.value as EditorDraft["expectKind"] })
                }
                className="input-dark w-full text-sm"
              >
                <option value="value">Value</option>
                <option value="error">Error</option>
              </select>
            </div>

            {draft.expectKind === "value" ? (
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Expected type
                </label>
                <select
                  value={draft.expectType}
                  onChange={(e) =>
                    setDraft({ ...draft, expectType: e.target.value as InputType })
                  }
                  className="input-dark w-full text-sm"
                >
                  <option value="string">string</option>
                  <option value="integer">integer</option>
                  <option value="float">float</option>
                  <option value="boolean">boolean</option>
                  <option value="object">object</option>
                  <option value="array">array</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Error kind
                </label>
                <select
                  value={draft.errorKind}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      errorKind: e.target.value as EditorDraft["errorKind"],
                    })
                  }
                  className="input-dark w-full text-sm"
                >
                  <option value="ParseError">ParseError</option>
                  <option value="UnknownFunction">UnknownFunction</option>
                  <option value="TypeError">TypeError</option>
                  <option value="RuntimeError">RuntimeError</option>
                  <option value="MissingParameter">MissingParameter</option>
                </select>
              </div>
            )}
          </div>

          {draft.expectKind === "value" ? (
            <>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 mt-3">
                Expected value
              </label>
              <textarea
                value={draft.expectValue}
                onChange={(e) => setDraft({ ...draft, expectValue: e.target.value })}
                className="input-dark w-full font-mono text-xs min-h-[80px]"
                spellCheck={false}
              />
            </>
          ) : (
            <>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 mt-3">
                Error message includes (optional)
              </label>
              <input
                value={draft.messageIncludes}
                onChange={(e) => setDraft({ ...draft, messageIncludes: e.target.value })}
                className="input-dark w-full text-sm"
              />
            </>
          )}

          {editorError && (
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-3">
              {editorError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}


import type { TraceEvent } from "../../interpreter/trace";

type TraceNode = {
  event: TraceEvent;
  children: TraceNode[];
};

function buildTree(events: TraceEvent[]): TraceNode[] {
  const byId = new Map<number, TraceNode>();
  for (const e of events) byId.set(e.id, { event: e, children: [] });
  const roots: TraceNode[] = [];
  for (const e of events) {
    const node = byId.get(e.id)!;
    if (e.parentId === null) roots.push(node);
    else byId.get(e.parentId)?.children.push(node);
  }
  return roots;
}

function compact(v: unknown): string {
  if (typeof v === "string") return JSON.stringify(v);
  if (v === null || v === undefined) return String(v);
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    const s = JSON.stringify(v);
    return s.length > 140 ? s.slice(0, 140) + "…" : s;
  } catch {
    return String(v);
  }
}

function renderNode(node: TraceNode): React.ReactNode {
  const e = node.event;

  if (e.kind === "functionCallStart") {
    const end = node.children.find((c) => c.event.kind === "functionCallEnd")?.event as
      | Extract<TraceEvent, { kind: "functionCallEnd" }>
      | undefined;
    const argsEv = node.children.find((c) => c.event.kind === "functionCallArgs")?.event as
      | Extract<TraceEvent, { kind: "functionCallArgs" }>
      | undefined;
    const children = node.children.filter((c) => c.event.kind !== "functionCallEnd");
    const childrenWithoutArgs = children.filter((c) => c.event.kind !== "functionCallArgs");
    return (
      <details key={e.id} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
        <summary className="cursor-pointer select-none px-3 py-2 font-mono text-xs text-slate-700 dark:text-slate-200">
          <span className="text-cyan-700 dark:text-cyan-300">{e.functionName}</span>
          <span className="text-slate-500 dark:text-slate-400">
            ({(argsEv?.args ?? []).map(compact).join(", ")})
          </span>
          {end && (
            <span className="text-slate-500 dark:text-slate-400">
              {" "}
              ⇒ {compact(end.result)}
            </span>
          )}
        </summary>
        <div className="px-3 pb-3 pt-1 grid gap-2">
          {childrenWithoutArgs.length === 0 ? (
            <p className="text-xs text-slate-600 dark:text-slate-400 m-0">
              No inner steps.
            </p>
          ) : (
            childrenWithoutArgs.map((c) => (
              <div key={c.event.id} className="ml-3">
                {renderNode(c)}
              </div>
            ))
          )}
        </div>
      </details>
    );
  }

  if (e.kind === "parametersCall") {
    return (
      <div key={e.id} className="font-mono text-xs text-slate-700 dark:text-slate-200">
        parameters({compact(e.name)}) ⇒ <span className="text-slate-500 dark:text-slate-400">{compact(e.value)}</span>
      </div>
    );
  }
  if (e.kind === "variablesCall") {
    return (
      <div key={e.id} className="font-mono text-xs text-slate-700 dark:text-slate-200">
        variables({compact(e.name)}) ⇒ <span className="text-slate-500 dark:text-slate-400">{compact(e.value)}</span>
      </div>
    );
  }
  if (e.kind === "selectionStep") {
    return (
      <div key={e.id} className="font-mono text-xs text-slate-700 dark:text-slate-200">
        select{e.optional ? "?" : ""}[{compact(e.index)}] ⇒{" "}
        <span className="text-slate-500 dark:text-slate-400">{compact(e.result)}</span>
      </div>
    );
  }

  // functionCallEnd as a standalone root shouldn't happen; ignore gracefully.
  return null;
}

export function TracePanel({ trace }: { trace: TraceEvent[] | null }) {
  if (!trace || trace.length === 0) {
    return (
      <p className="text-slate-600 dark:text-slate-400 text-sm py-2">
        No trace captured yet. Run an expression to see evaluation steps.
      </p>
    );
  }

  const roots = buildTree(trace);
  return (
    <div className="flex flex-col min-h-0 gap-2 overflow-auto">
      {roots.map((r) => renderNode(r))}
    </div>
  );
}


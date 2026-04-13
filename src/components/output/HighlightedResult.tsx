import type { CSSProperties, ReactNode } from "react";
import { bracketDepthRgb } from "../../editor/bracketHighlight";

function span(cls: string, children: ReactNode) {
  return <span className={cls}>{children}</span>;
}

function spanRgb(rgb: string, children: ReactNode) {
  const style: CSSProperties = { color: rgb };
  return <span style={style}>{children}</span>;
}

interface HighlightedResultProps {
  value: unknown;
  depth?: number;
  indent?: number;
}

export function HighlightedResult({ value, depth = 0, indent = 0 }: HighlightedResultProps) {
  const d = depth;
  const idt = " ".repeat(indent);
  const idtInner = " ".repeat(indent + 2);

  if (value === null) {
    return <span className="text-orange-400">null</span>;
  }
  if (value === undefined) {
    return <span className="text-slate-500">undefined</span>;
  }
  if (typeof value === "boolean") {
    return <span className="text-orange-400">{String(value)}</span>;
  }
  if (typeof value === "number") {
    return <span className="text-amber-400">{String(value)}</span>;
  }
  if (typeof value === "string") {
    const escaped = JSON.stringify(value);
    return <span className="text-emerald-400">{escaped}</span>;
  }
  if (Array.isArray(value)) {
    const rgb = bracketDepthRgb(d);
    if (value.length === 0) {
      return (
        <>
          {spanRgb(rgb, "[")}
          {spanRgb(rgb, "]")}
        </>
      );
    }
    return (
      <>
        {spanRgb(rgb, "[")}
        <br />
        {value.map((item, i) => (
          <span key={i}>
            {idtInner}
            <HighlightedResult value={item} depth={d + 1} indent={indent + 2} />
            {i < value.length - 1 ? span("text-slate-500", ",") : null}
            <br />
          </span>
        ))}
        {idt}
        {spanRgb(rgb, "]")}
      </>
    );
  }
  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value);
    const rgb = bracketDepthRgb(d);
    if (entries.length === 0) {
      return (
        <>
          {spanRgb(rgb, "{")}
          {spanRgb(rgb, "}")}
        </>
      );
    }
    return (
      <>
        {spanRgb(rgb, "{")}
        <br />
        {entries.map(([key, val], i) => (
          <span key={key}>
            {idtInner}
            <span className="text-cyan-400">{JSON.stringify(key)}</span>
            {span("text-slate-500", ": ")}
            <HighlightedResult value={val} depth={d + 1} indent={indent + 2} />
            {i < entries.length - 1 ? span("text-slate-500", ",") : null}
            <br />
          </span>
        ))}
        {idt}
        {spanRgb(rgb, "}")}
      </>
    );
  }
  return <span className="text-slate-600 dark:text-slate-400">{String(value)}</span>;
}

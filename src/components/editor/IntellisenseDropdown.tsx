import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { IntellisenseContext } from "../../editor/intellisenseContext";
import {
  getFunctionMetadata,
  getAllFunctionNames,
} from "../../interpreter/functions/metadata";
import type { FunctionMetadata } from "../../interpreter/functions/metadata";

const MAX_FUNCTION_ITEMS = 12;

const INTELLISENSE_Z_INDEX = 9999;

export interface IntellisenseDropdownProps {
  context: IntellisenseContext;
  anchorRef: React.RefObject<HTMLTextAreaElement | null>;
  /** When set, popover is portaled into this container (placed next to Run button) and positioned at top-left with high z-index */
  intellisensePortalRef?: React.RefObject<HTMLDivElement | null>;
  /** For function list: selected index (controlled by parent for keyboard) */
  selectedIndex?: number;
  /** For function list: called when user hovers an item */
  onHighlightIndex?: (index: number) => void;
  onSelectFunction: (name: string, replaceStart: number, replaceEnd: number) => void;
  onClose: () => void;
}

export function filterFunctions(prefix: string): string[] {
  const all = getAllFunctionNames();
  const lower = prefix.toLowerCase();
  const filtered = lower
    ? all.filter((name) => name.toLowerCase().startsWith(lower))
    : all;
  return filtered.slice(0, MAX_FUNCTION_ITEMS);
}

const POPOVER_STYLE: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: INTELLISENSE_Z_INDEX,
};

export function IntellisenseDropdown({
  context,
  anchorRef: _anchorRef,
  intellisensePortalRef,
  selectedIndex = 0,
  onHighlightIndex,
  onSelectFunction,
  onClose,
}: IntellisenseDropdownProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [portalReady, setPortalReady] = useState(false);

  // When we have a portal ref, trigger re-render once it's mounted (sibling div is after ExpressionEditor in DOM order)
  useEffect(() => {
    if (!context) {
      setPortalReady(false);
      return;
    }
    if (!intellisensePortalRef) return;
    if (intellisensePortalRef.current) {
      setPortalReady(true);
      return;
    }
    const id = requestAnimationFrame(() => {
      if (intellisensePortalRef.current) setPortalReady(true);
    });
    return () => cancelAnimationFrame(id);
  }, [context, intellisensePortalRef]);

  const functionNames =
    context?.kind === "function-list"
      ? filterFunctions(context.prefix)
      : [];
  const metadata: FunctionMetadata | undefined =
    context?.kind === "parameter-hint"
      ? getFunctionMetadata(context.functionName)
      : undefined;
  const param =
    metadata && context?.kind === "parameter-hint"
      ? metadata.parameters[context.paramIndex]
      : undefined;

  useEffect(() => {
    if (!context || context.kind !== "function-list") return;
    const el = listRef.current;
    if (!el) return;
    const selected = el.querySelector("[data-selected]");
    selected?.scrollIntoView({ block: "nearest" });
  }, [context, selectedIndex]);

  if (!context) return null;

  // Wait for portal target to be mounted so we don't flash in wrong place
  if (intellisensePortalRef && !intellisensePortalRef.current && !portalReady) return null;

  const popoverContent =
    context.kind === "parameter-hint" ? (
      <ParameterHintPopover
        metadata={metadata}
        param={param}
        paramIndex={context.paramIndex}
        popoverStyle={POPOVER_STYLE}
        onClose={onClose}
      />
    ) : functionNames.length === 0 ? null : (
      <FunctionListPopover
        functionNames={functionNames}
        prefix={context.prefix}
        replaceStart={context.replaceStart}
        replaceEnd={context.replaceEnd}
        selectedIndex={selectedIndex}
        onHighlightIndex={onHighlightIndex}
        listRef={listRef}
        popoverStyle={POPOVER_STYLE}
        onSelectFunction={onSelectFunction}
        onClose={onClose}
      />
    );

  if (!popoverContent) return null;

  const portalTarget = intellisensePortalRef?.current ?? document.body;
  return createPortal(popoverContent, portalTarget as HTMLElement);
}

function ParameterHintPopover({
  metadata,
  param,
  paramIndex,
  popoverStyle,
  onClose,
}: {
  metadata: FunctionMetadata | undefined;
  param: { name: string; type: string; required?: boolean } | undefined;
  paramIndex: number;
  popoverStyle: React.CSSProperties;
  onClose: () => void;
}) {
  if (!metadata) return null;
  const allParams = metadata.parameters;
  const isOptional = param && param.required === false;

  return (
    <div
      className="intellisense-popover parameter-hint rounded-lg border border-slate-600 bg-slate-800/95 shadow-xl backdrop-blur px-3 py-2.5 max-w-[320px]"
      style={popoverStyle}
      role="tooltip"
    >
      <div className="flex items-start gap-2 flex-wrap justify-between">
        <div className="flex items-baseline gap-2 flex-wrap min-w-0">
        <span className="text-cyan-400 font-mono font-semibold">
          {metadata.name}
        </span>
        <span className="text-slate-500 text-xs">{metadata.returns}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className="text-slate-400 text-xs mt-1">{metadata.description}</p>
      <div className="mt-2 pt-2 border-t border-slate-700">
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">
          Parameters
        </p>
        <ul className="text-sm space-y-0.5">
          {allParams.map((p, i) => (
            <li
              key={p.name}
              className={
                i === paramIndex
                  ? "text-cyan-300 font-medium"
                  : "text-slate-500"
              }
            >
              {i + 1}. {p.name}{" "}
              <span className="text-slate-500 font-normal">({p.type})</span>
              {p.required === false && (
                <span className="text-slate-500 text-xs ml-1">optional</span>
              )}
              {i === paramIndex && (
                <span className="text-amber-400/90 text-xs ml-1">← next</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      {param && (
        <p className="text-slate-400 text-xs mt-2">
          <span className="text-cyan-300">{param.name}</span>: {param.type}
          {isOptional && " (optional)"}
        </p>
      )}
    </div>
  );
}

function FunctionListPopover({
  functionNames,
  replaceStart,
  replaceEnd,
  selectedIndex,
  onHighlightIndex,
  listRef,
  popoverStyle,
  onSelectFunction,
  prefix: _prefix,
  onClose,
}: {
  functionNames: string[];
  prefix: string;
  replaceStart: number;
  replaceEnd: number;
  selectedIndex: number;
  onHighlightIndex?: (index: number) => void;
  listRef: React.RefObject<HTMLDivElement | null>;
  popoverStyle: React.CSSProperties;
  onSelectFunction: (name: string, replaceStart: number, replaceEnd: number) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="intellisense-popover function-list rounded-lg border border-slate-600 bg-slate-800/95 shadow-xl backdrop-blur overflow-hidden min-w-[200px] max-h-[280px] flex flex-col"
      style={popoverStyle}
      role="listbox"
    >
      <div className="flex items-center justify-between gap-2 text-slate-500 text-xs font-medium uppercase tracking-wider px-3 py-2 border-b border-slate-700">
        <span>Functions</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div ref={listRef} className="overflow-auto py-1">
        {functionNames.map((name, i) => {
          const meta = getFunctionMetadata(name);
          const isSelected = i === selectedIndex;
          return (
            <button
              key={name}
              type="button"
              data-selected={isSelected ? true : undefined}
              className={`w-full text-left px-3 py-2 flex items-center gap-2 transition-colors ${
                isSelected
                  ? "bg-cyan-500/20 text-cyan-200"
                  : "text-slate-300 hover:bg-slate-700/50"
              }`}
              onClick={() => onSelectFunction(name, replaceStart, replaceEnd)}
              onMouseEnter={() => onHighlightIndex?.(i)}
            >
              <span className="font-mono text-cyan-400 font-medium">{name}</span>
              {meta && (
                <span className="text-slate-500 text-xs truncate flex-1">
                  {meta.signature}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}


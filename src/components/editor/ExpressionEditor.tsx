import { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Tokenizer } from "../../interpreter/parser/tokenizer";
import type { Token } from "../../interpreter/parser/tokenizer";
import {
  getAllFunctionNames,
  getFunctionMetadata,
} from "../../interpreter/functions/metadata";
import { getIntellisenseContext } from "../../editor/intellisenseContext";
import type { IntellisenseContext } from "../../editor/intellisenseContext";
import { IntellisenseDropdown, filterFunctions } from "./IntellisenseDropdown";
import { SnippetsPopover } from "./ExpressionSnippets";

interface ExpressionEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFunctionClick?: (name: string) => void;
  /** Called when user selects a snippet from the dropdown to insert into the editor */
  onInsertSnippet?: (expression: string) => void;
  /** Called when user presses Ctrl+Enter / Cmd+Enter to run the expression */
  onRun?: () => void;
  /** Container to portal the intellisense popover into (e.g. next to Run button) */
  intellisensePortalRef?: React.RefObject<HTMLDivElement | null>;
}

function getTokenClassName(
  token: Token,
  tokens: Token[],
  index: number,
  knownFunctions: Set<string>,
  hasClickHandler: boolean,
): string {
  if (token.type === "string") return "token-string";
  if (token.type === "number") return "token-number";
  if (token.type === "boolean" || token.type === "null") return "token-boolean";
  if (
    token.type === "lparen" ||
    token.type === "rparen" ||
    token.type === "comma" ||
    token.type === "at"
  ) {
    return "token-punctuation";
  }
  if (token.type === "identifier" && typeof token.value === "string") {
    const nextToken = tokens[index + 1];
    const isFunctionCall =
      nextToken?.type === "lparen" && knownFunctions.has(token.value);
    if (isFunctionCall) {
      return `token-function${hasClickHandler ? " clickable" : ""}`;
    }
    return "token-identifier";
  }
  return "token-punctuation";
}

export function ExpressionEditor({
  value,
  onChange,
  placeholder,
  onFunctionClick,
  onInsertSnippet,
  onRun,
  intellisensePortalRef,
}: ExpressionEditorProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const knownFunctions = useRef(new Set(getAllFunctionNames())).current;

  const [cursor, setCursor] = useState({ start: 0, end: 0 });
  const [intellisenseSelectedIndex, setIntellisenseSelectedIndex] = useState(0);
  const [intellisenseDismissed, setIntellisenseDismissed] = useState(false);
  const [forceShowFunctionList, setForceShowFunctionList] = useState(false);
  const [forceShowSnippetsList, setForceShowSnippetsList] = useState(false);
  const [, setPortalMounted] = useState(false);

  useEffect(() => {
    if (!intellisensePortalRef) return;
    if (intellisensePortalRef.current) {
      setPortalMounted(true);
      return;
    }
    const id = requestAnimationFrame(() => {
      if (intellisensePortalRef.current) setPortalMounted(true);
    });
    return () => cancelAnimationFrame(id);
  }, [intellisensePortalRef]);

  const rawContext = getIntellisenseContext(value, cursor.start);
  const effectiveContext: IntellisenseContext | null = forceShowFunctionList
    ? {
        kind: "function-list",
        prefix: "",
        replaceStart: cursor.start,
        replaceEnd: cursor.end,
      }
    : intellisenseDismissed
      ? null
      : rawContext;
  const intellisenseContext = effectiveContext;
  const showFunctionList = intellisenseContext?.kind === "function-list";
  const filteredNames =
    showFunctionList && intellisenseContext?.kind === "function-list"
      ? filterFunctions(intellisenseContext.prefix)
      : [];
  const maxIndex = Math.max(0, filteredNames.length - 1);

  const applyCompletion = useCallback(
    (name: string, replaceStart: number, replaceEnd: number) => {
      const next =
        value.slice(0, replaceStart) + name + value.slice(replaceEnd);
      onChange(next);
      setIntellisenseSelectedIndex(0);
      const newPos = replaceStart + name.length;
      requestAnimationFrame(() => {
        textareaRef.current?.setSelectionRange(newPos, newPos);
        textareaRef.current?.focus();
      });
    },
    [value, onChange],
  );

  useEffect(() => {
    if (!forceShowFunctionList) setIntellisenseDismissed(false);
  }, [value, cursor.start, forceShowFunctionList]);

  useEffect(() => {
    if (!showFunctionList) setIntellisenseSelectedIndex(0);
    else setIntellisenseSelectedIndex((i) => Math.min(i, maxIndex));
  }, [
    showFunctionList,
    intellisenseContext?.kind === "function-list"
      ? (intellisenseContext as { prefix: string }).prefix
      : "",
    maxIndex,
  ]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (onRun && (e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        onRun();
        return;
      }
      if (showFunctionList && filteredNames.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setIntellisenseSelectedIndex((i) => Math.min(i + 1, maxIndex));
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setIntellisenseSelectedIndex((i) => Math.max(i - 1, 0));
          return;
        }
        if (e.key === "Enter" || e.key === "Tab") {
          e.preventDefault();
          const name = filteredNames[intellisenseSelectedIndex];
          if (name && intellisenseContext?.kind === "function-list") {
            applyCompletion(
              name,
              intellisenseContext.replaceStart,
              intellisenseContext.replaceEnd,
            );
          }
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          setIntellisenseDismissed(true);
          return;
        }
      }
      if (intellisenseContext && e.key === "Escape") {
        e.preventDefault();
        setIntellisenseDismissed(true);
        return;
      }
    },
    [
      onRun,
      showFunctionList,
      filteredNames,
      intellisenseSelectedIndex,
      maxIndex,
      intellisenseContext,
      applyCompletion,
    ],
  );

  let tokens: Token[] = [];
  try {
    const t = new Tokenizer(value);
    tokens = t.tokenize().filter((tok) => tok.type !== "eof");
  } catch {
    // Tokenization failed (incomplete/invalid expression) - no highlighting
  }

  const highlightedContent: React.ReactNode[] = [];
  let pos = 0;

  tokens.forEach((token, index) => {
    if (pos < token.start) {
      highlightedContent.push(
        <span key={`ws-${pos}`}>{value.slice(pos, token.start)}</span>,
      );
    }
    const text = value.slice(token.start, token.end);
    const className = getTokenClassName(
      token,
      tokens,
      index,
      knownFunctions,
      !!onFunctionClick,
    );
    const isClickable =
      className.includes("clickable") && typeof token.value === "string";

    highlightedContent.push(
      <span
        key={`tok-${token.start}`}
        className={className}
        style={
          isClickable && onFunctionClick
            ? { pointerEvents: "auto" as const }
            : undefined
        }
        {...(isClickable && onFunctionClick
          ? {
              onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                onFunctionClick(token.value as string);
              },
              role: "button",
              tabIndex: 0,
              onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onFunctionClick(token.value as string);
                }
              },
            }
          : {})}
      >
        {text}
      </span>,
    );
    pos = token.end;
  });
  if (pos < value.length) {
    highlightedContent.push(
      <span key={`tail-${pos}`}>{value.slice(pos)}</span>,
    );
  }

  const MIN_HEIGHT = 80;
  const fitHeight = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.minHeight = "0";
    ta.style.height = "0";
    const h = Math.max(MIN_HEIGHT, ta.scrollHeight);
    ta.style.height = h + "px";
    ta.style.minHeight = MIN_HEIGHT + "px";
    ta.style.overflow = "hidden";
  };

  useEffect(fitHeight, [value]);

  useEffect(() => {
    const ta = textareaRef.current;
    const pre = preRef.current;
    if (!ta || !pre) return;
    const syncScroll = () => {
      pre.scrollTop = ta.scrollTop;
      pre.scrollLeft = ta.scrollLeft;
    };
    ta.addEventListener("scroll", syncScroll);
    return () => ta.removeEventListener("scroll", syncScroll);
  }, []);

  const handleCloseIntellisense = useCallback(() => {
    // #region agent log
    fetch("http://127.0.0.1:7243/ingest/1f982de4-7c53-4b23-aef2-1db901e4f1b1", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "56d1b9" },
      body: JSON.stringify({
        sessionId: "56d1b9",
        location: "ExpressionEditor.tsx:handleCloseIntellisense",
        message: "handleCloseIntellisense called",
        data: { hypothesisId: "H2" },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    setIntellisenseDismissed(true);
    setForceShowFunctionList(false);
    setForceShowSnippetsList(false);
  }, []);

  const handleExpandFunctions = useCallback(() => {
    setForceShowFunctionList(true);
    setForceShowSnippetsList(false);
    setIntellisenseDismissed(false);
  }, []);

  const handleExpandSnippets = useCallback(() => {
    setForceShowSnippetsList(true);
    setForceShowFunctionList(false);
    setIntellisenseDismissed(false);
  }, []);

  // Dismiss intellisense/snippets when clicking outside the textarea or the popup (portal container).
  // Use capture phase so we run before other handlers and close on first click.
  useEffect(() => {
    if ((!intellisenseContext && !forceShowSnippetsList) || !intellisensePortalRef)
      return;
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (textareaRef.current?.contains(target)) return;
      if (intellisensePortalRef.current?.contains(target)) return;
      handleCloseIntellisense();
    };
    document.addEventListener("mousedown", handleMouseDown, true);
    return () => document.removeEventListener("mousedown", handleMouseDown, true);
  }, [
    intellisenseContext,
    forceShowSnippetsList,
    intellisensePortalRef,
    handleCloseIntellisense,
  ]);

  const isUnknownFunction =
    intellisenseContext?.kind === "parameter-hint" &&
    !getFunctionMetadata(intellisenseContext.functionName);
  const isFunctionListWithNoMatches =
    intellisenseContext?.kind === "function-list" && filteredNames.length === 0;
  const showExpandButton =
    (!intellisenseContext || isUnknownFunction || isFunctionListWithNoMatches) &&
    intellisensePortalRef?.current;
  const showButtonsRow = showExpandButton || forceShowSnippetsList;

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          const ta = e.target;
          setCursor({ start: ta.selectionStart, end: ta.selectionEnd });
        }}
        onSelect={(e) => {
          const ta = e.target as HTMLTextAreaElement;
          setCursor({ start: ta.selectionStart, end: ta.selectionEnd });
        }}
        onFocus={(e) => {
          const ta = e.target as HTMLTextAreaElement;
          setCursor({ start: ta.selectionStart, end: ta.selectionEnd });
        }}
        onKeyDown={handleKeyDown}
        placeholder={
          placeholder ??
          `e.g. concat(variables('firstName'), ' ', variables('lastName'))`
        }
        className="input-dark w-full font-mono text-sm resize-none relative bg-transparent caret-cyan-400 selection:bg-cyan-500/20 block"
        spellCheck={false}
        style={{ color: "transparent", minHeight: MIN_HEIGHT }}
        rows={1}
      />
      {intellisenseContext && !forceShowSnippetsList && (
        <IntellisenseDropdown
          context={intellisenseContext}
          anchorRef={textareaRef}
          intellisensePortalRef={intellisensePortalRef}
          selectedIndex={intellisenseSelectedIndex}
          onHighlightIndex={setIntellisenseSelectedIndex}
          onSelectFunction={(name, replaceStart, replaceEnd) => {
            applyCompletion(name, replaceStart, replaceEnd);
            setForceShowFunctionList(false);
          }}
          onClose={handleCloseIntellisense}
        />
      )}
      {showButtonsRow &&
        intellisensePortalRef &&
        intellisensePortalRef.current &&
        createPortal(
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={handleExpandFunctions}
              className="btn-secondary text-sm h-[32px] w-[130px] flex items-center justify-center gap-2"
              aria-label="Show functions"
            >
              <svg
                className="w-4 h-4 text-cyan-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <span>Functions</span>
            </button>
            {onInsertSnippet && (
              <div className="relative">
                <button
                  type="button"
                  onClick={handleExpandSnippets}
                  className="btn-secondary text-sm h-[32px] w-[130px] flex items-center justify-center gap-2"
                  aria-label="Show snippets"
                >
                  <svg
                    className="w-4 h-4 text-cyan-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <span>Snippets</span>
                </button>
                {forceShowSnippetsList && (
                  <SnippetsPopover
                    onSelect={onInsertSnippet}
                    onClose={handleCloseIntellisense}
                    popoverStyle={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      zIndex: 9999,
                    }}
                  />
                )}
              </div>
            )}
          </div>,
          intellisensePortalRef.current,
        )}
      <pre
        ref={preRef}
        className="absolute inset-0 overflow-auto font-mono text-sm whitespace-pre-wrap break-words pointer-events-none m-0 px-3.5 py-2.5 border border-transparent rounded-xl"
        aria-hidden
      >
        {highlightedContent}
      </pre>
    </div>
  );
}

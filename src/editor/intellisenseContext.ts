/**
 * Analyzes expression text and cursor position to determine intellisense context:
 * - Function list: when user can type a function name (with optional prefix filter)
 * - Parameter hint: when cursor is inside a function's parentheses (which param is next)
 */

export type IntellisenseKind = 'function-list' | 'parameter-hint';

export interface FunctionListContext {
  kind: 'function-list';
  /** Prefix to filter function names (e.g. "con" for concat) */
  prefix: string;
  /** Start offset of the prefix in value (for replacement on completion) */
  replaceStart: number;
  replaceEnd: number;
}

export interface ParameterHintContext {
  kind: 'parameter-hint';
  functionName: string;
  /** 0-based index of the parameter the cursor is at */
  paramIndex: number;
  /** Start offset of the expression segment for this param (after comma or opening paren) */
  replaceStart: number;
  replaceEnd: number;
}

export type IntellisenseContext = FunctionListContext | ParameterHintContext | null;

const IDENT_RE = /[a-zA-Z0-9_]/;

/**
 * Returns what to show at the given cursor position: function list (with prefix),
 * parameter hint for current function, or null.
 */
export function getIntellisenseContext(value: string, cursorOffset: number): IntellisenseContext {
  if (cursorOffset < 0 || cursorOffset > value.length) return null;

  const before = value.slice(0, cursorOffset);

  // --- 1) Check if we're inside a function call's parentheses (parameter hint) ---
  let depth = 0;
  let lastOpenPos = -1;
  let i = before.length - 1;
  while (i >= 0) {
    const ch = before[i];
    if (ch === ')') {
      depth++;
    } else if (ch === '(') {
      if (depth === 0) {
        lastOpenPos = i;
        break;
      }
      depth--;
    }
    i--;
  }

  if (lastOpenPos >= 0) {
    // We're inside parentheses. Find the function name (identifier immediately before this '(').
    let nameStart = lastOpenPos - 1;
    while (nameStart >= 0 && IDENT_RE.test(before[nameStart])) nameStart--;
    nameStart++;
    const functionName = before.slice(nameStart, lastOpenPos).trim();
    if (functionName.length > 0) {
      // Count commas from ( to cursor (only at depth 0) to get param index
      let paramIndex = 0;
      let d = 0;
      for (let j = lastOpenPos + 1; j < cursorOffset; j++) {
        const c = value[j];
        if (c === '(') d++;
        else if (c === ')') d--;
        else if (c === ',' && d === 0) paramIndex++;
      }
      // Replace range: from last comma (or opening paren) to cursor
      let replaceStart = lastOpenPos + 1;
      let replaceEnd = cursorOffset;
      d = 0;
      for (let j = lastOpenPos + 1; j < cursorOffset; j++) {
        const c = value[j];
        if (c === '(') d++;
        else if (c === ')') d--;
        else if (c === ',' && d === 0) replaceStart = j + 1;
      }
      while (replaceStart < replaceEnd && /\s/.test(value[replaceStart])) replaceStart++;

      return {
        kind: 'parameter-hint',
        functionName,
        paramIndex,
        replaceStart,
        replaceEnd,
      };
    }
  }

  // --- 2) Function list: after start, after '(', or after ',' (with optional whitespace), or in the middle of an identifier ---
  // Don't auto-show when expression is empty (user must click Functions or start typing)
  if (value.trim().length === 0) return null;

  const trimmed = before.replace(/\s+$/, '');
  const lastChar = trimmed[trimmed.length - 1];

  let showFunctionList = false;
  let replaceStart = cursorOffset;
  let replaceEnd = cursorOffset;
  let prefix = '';

  if (trimmed.length === 0 || /^@?\s*$/.test(trimmed)) {
    showFunctionList = true;
    replaceStart = 0;
    replaceEnd = cursorOffset;
  } else if (lastChar === '(' || lastChar === ',') {
    showFunctionList = true;
    replaceStart = cursorOffset;
    replaceEnd = cursorOffset;
  } else if (IDENT_RE.test(lastChar)) {
    // In the middle of an identifier - find its start
    let start = trimmed.length - 1;
    while (start >= 0 && IDENT_RE.test(trimmed[start])) start--;
    start++;
    prefix = trimmed.slice(start);
    replaceStart = before.length - (trimmed.length - start);
    replaceEnd = cursorOffset;
    showFunctionList = true;
  }

  if (!showFunctionList) return null;

  return {
    kind: 'function-list',
    prefix,
    replaceStart,
    replaceEnd,
  };
}

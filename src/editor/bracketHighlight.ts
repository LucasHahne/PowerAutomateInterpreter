import type { Token, TokenType } from "../interpreter/parser/tokenizer";

/** Number of distinct bracket depth colors (cycle length). */
export const BRACKET_DEPTH_COUNT = 6;

/** CSS class for a given nesting depth; matches `HighlightedResult` palette via `theme.css`. */
export function bracketDepthClassName(depth: number): string {
  const d = ((depth % BRACKET_DEPTH_COUNT) + BRACKET_DEPTH_COUNT) % BRACKET_DEPTH_COUNT;
  return `bracket-depth-${d}`;
}

export const BRACKET_DEPTH_CLASS_NAMES = Array.from({ length: BRACKET_DEPTH_COUNT }, (_, i) =>
  bracketDepthClassName(i),
);

type BracketKind = "paren" | "square";

function openerKind(type: TokenType): BracketKind | null {
  if (type === "lparen") return "paren";
  if (type === "lbracket") return "square";
  return null;
}

function closerMatches(kind: BracketKind, type: TokenType): boolean {
  return (
    (kind === "paren" && type === "rparen") || (kind === "square" && type === "rbracket")
  );
}

/**
 * Rainbow-style class per token index for `(` `)` `[` `]`. Unmatched closers yield `null`
 * (fall back to generic punctuation). Openers always get a class; unclosed opens are still colored.
 */
export function computeBracketDepthClasses(tokens: Token[]): (string | null)[] {
  const result: (string | null)[] = tokens.map(() => null);
  const stack: { depth: number; kind: BracketKind }[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const open = openerKind(t.type);
    if (open) {
      const depth = stack.length;
      stack.push({ depth, kind: open });
      result[i] = bracketDepthClassName(depth);
      continue;
    }
    if (t.type === "rparen" || t.type === "rbracket") {
      const top = stack[stack.length - 1];
      if (!top || !closerMatches(top.kind, t.type)) {
        result[i] = null;
        continue;
      }
      stack.pop();
      result[i] = bracketDepthClassName(top.depth);
    }
  }

  return result;
}

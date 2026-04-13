import type { Token, TokenType } from "../interpreter/parser/tokenizer";

/**
 * Bracket colors by nesting depth (depth 0 = outermost; cycles after the last entry).
 * Edit these `rgb(...)` strings — used for expression editor parens/brackets and result JSON braces.
 */
export const BRACKET_DEPTH_RGB = [
  "rgb(101, 255, 74)",
  "rgb(255, 193, 40)",
  "rgb(40, 237, 255)",
  "rgb(243, 40, 255)",
  "rgb(249, 255, 40)",
  "rgb(255, 87, 40)",
] as const;

export const BRACKET_DEPTH_COUNT = BRACKET_DEPTH_RGB.length;

export function bracketDepthRgb(depth: number): string {
  const d =
    ((depth % BRACKET_DEPTH_COUNT) + BRACKET_DEPTH_COUNT) % BRACKET_DEPTH_COUNT;
  return BRACKET_DEPTH_RGB[d];
}

type BracketKind = "paren" | "square";

function openerKind(type: TokenType): BracketKind | null {
  if (type === "lparen") return "paren";
  if (type === "lbracket") return "square";
  return null;
}

function closerMatches(kind: BracketKind, type: TokenType): boolean {
  return (
    (kind === "paren" && type === "rparen") ||
    (kind === "square" && type === "rbracket")
  );
}

/**
 * RGB color per token index for `(` `)` `[` `]`, or `null` when not a matched bracket token.
 */
export function computeBracketDepthColors(tokens: Token[]): (string | null)[] {
  const result: (string | null)[] = tokens.map(() => null);
  const stack: { depth: number; kind: BracketKind }[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const open = openerKind(t.type);
    if (open) {
      const depth = stack.length;
      stack.push({ depth, kind: open });
      result[i] = bracketDepthRgb(depth);
      continue;
    }
    if (t.type === "rparen" || t.type === "rbracket") {
      const top = stack[stack.length - 1];
      if (!top || !closerMatches(top.kind, t.type)) {
        result[i] = null;
        continue;
      }
      stack.pop();
      result[i] = bracketDepthRgb(top.depth);
    }
  }

  return result;
}

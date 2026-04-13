import { describe, it, expect } from "vitest";
import { Tokenizer } from "../interpreter/parser/tokenizer";
import {
  BRACKET_DEPTH_COUNT,
  BRACKET_DEPTH_RGB,
  bracketDepthRgb,
  computeBracketDepthColors,
} from "./bracketHighlight";

describe("bracketDepthRgb", () => {
  it("cycles through six rgb strings", () => {
    expect(BRACKET_DEPTH_COUNT).toBe(6);
    expect(BRACKET_DEPTH_RGB).toHaveLength(6);
    for (let i = 0; i < 6; i++) {
      expect(bracketDepthRgb(i)).toBe(BRACKET_DEPTH_RGB[i]);
    }
    expect(bracketDepthRgb(6)).toBe(BRACKET_DEPTH_RGB[0]);
  });
});

describe("computeBracketDepthColors", () => {
  function colorsFor(input: string) {
    const tokens = new Tokenizer(input).tokenize().filter((t) => t.type !== "eof");
    return computeBracketDepthColors(tokens);
  }

  it("colors nested concat example: outer pair depth 0, inner pair depth 1", () => {
    const input = "concat('Test', concat('Test'))";
    const tokens = new Tokenizer(input).tokenize().filter((t) => t.type !== "eof");
    const colors = computeBracketDepthColors(tokens);

    const parenIndices = tokens
      .map((t, i) => (t.type === "lparen" || t.type === "rparen" ? i : -1))
      .filter((i) => i >= 0);

    expect(parenIndices).toHaveLength(4);
    const [outerOpen, innerOpen, innerClose, outerClose] = parenIndices;

    expect(colors[outerOpen]).toBe(BRACKET_DEPTH_RGB[0]);
    expect(colors[outerClose]).toBe(BRACKET_DEPTH_RGB[0]);
    expect(colors[innerOpen]).toBe(BRACKET_DEPTH_RGB[1]);
    expect(colors[innerClose]).toBe(BRACKET_DEPTH_RGB[1]);
  });

  it("assigns fourth nesting level rgb for deeply nested parens", () => {
    const tokens = new Tokenizer("((((a))))").tokenize().filter((t) => t.type !== "eof");
    const colors = computeBracketDepthColors(tokens);
    const parenI = tokens
      .map((t, i) => (t.type === "lparen" || t.type === "rparen" ? i : -1))
      .filter((i) => i >= 0);
    expect(parenI).toHaveLength(8);
    expect(colors[parenI[0]]).toBe(BRACKET_DEPTH_RGB[0]);
    expect(colors[parenI[1]]).toBe(BRACKET_DEPTH_RGB[1]);
    expect(colors[parenI[2]]).toBe(BRACKET_DEPTH_RGB[2]);
    expect(colors[parenI[3]]).toBe(BRACKET_DEPTH_RGB[3]);
    expect(colors[parenI[4]]).toBe(BRACKET_DEPTH_RGB[3]);
    expect(colors[parenI[5]]).toBe(BRACKET_DEPTH_RGB[2]);
    expect(colors[parenI[6]]).toBe(BRACKET_DEPTH_RGB[1]);
    expect(colors[parenI[7]]).toBe(BRACKET_DEPTH_RGB[0]);
  });

  it("handles (a[b]) nesting", () => {
    const tokens = new Tokenizer("(a[b])").tokenize().filter((t) => t.type !== "eof");
    const colors = computeBracketDepthColors(tokens);
    const types = tokens.map((t) => t.type);

    const iParenOpen = types.indexOf("lparen");
    const iBracketOpen = types.indexOf("lbracket");
    const iBracketClose = types.indexOf("rbracket");
    const iParenClose = types.indexOf("rparen");

    expect(colors[iParenOpen]).toBe(BRACKET_DEPTH_RGB[0]);
    expect(colors[iParenClose]).toBe(BRACKET_DEPTH_RGB[0]);
    expect(colors[iBracketOpen]).toBe(BRACKET_DEPTH_RGB[1]);
    expect(colors[iBracketClose]).toBe(BRACKET_DEPTH_RGB[1]);
  });

  it("returns null for mismatched closer in ([)]", () => {
    const c = colorsFor("([)]");
    const tokens = new Tokenizer("([)]").tokenize().filter((t) => t.type !== "eof");
    const iMisplacedRparen = tokens.findIndex((t) => t.type === "rparen");
    expect(c[iMisplacedRparen]).toBeNull();
    const iBracketClose = tokens.findIndex((t) => t.type === "rbracket");
    expect(c[iBracketClose]).toBe(BRACKET_DEPTH_RGB[1]);
  });

  it("returns null for stray closing paren", () => {
    const c = colorsFor(")");
    expect(c[0]).toBeNull();
  });

  it("returns null for stray closing bracket", () => {
    const c = colorsFor("]");
    expect(c[0]).toBeNull();
  });
});

import { describe, it, expect } from "vitest";
import { Tokenizer } from "../interpreter/parser/tokenizer";
import {
  BRACKET_DEPTH_CLASS_NAMES,
  bracketDepthClassName,
  computeBracketDepthClasses,
} from "./bracketHighlight";

describe("bracketDepthClassName", () => {
  it("cycles through six class names", () => {
    expect(BRACKET_DEPTH_CLASS_NAMES).toHaveLength(6);
    for (let i = 0; i < 6; i++) {
      expect(bracketDepthClassName(i)).toBe(`bracket-depth-${i}`);
      expect(BRACKET_DEPTH_CLASS_NAMES[i]).toBe(bracketDepthClassName(i));
    }
    expect(bracketDepthClassName(6)).toBe("bracket-depth-0");
  });
});

describe("computeBracketDepthClasses", () => {
  function classesFor(input: string) {
    const tokens = new Tokenizer(input).tokenize().filter((t) => t.type !== "eof");
    return computeBracketDepthClasses(tokens);
  }

  it("colors nested concat example: outer pair depth 0, inner pair depth 1", () => {
    const input = "concat('Test', concat('Test'))";
    const tokens = new Tokenizer(input).tokenize().filter((t) => t.type !== "eof");
    const classes = computeBracketDepthClasses(tokens);

    const parenIndices = tokens
      .map((t, i) => (t.type === "lparen" || t.type === "rparen" ? i : -1))
      .filter((i) => i >= 0);

    expect(parenIndices).toHaveLength(4);
    const [outerOpen, innerOpen, innerClose, outerClose] = parenIndices;

    expect(classes[outerOpen]).toBe("bracket-depth-0");
    expect(classes[outerClose]).toBe("bracket-depth-0");
    expect(classes[innerOpen]).toBe("bracket-depth-1");
    expect(classes[innerClose]).toBe("bracket-depth-1");
  });

  it("assigns bracket-depth-3 for fourth nesting level of parens", () => {
    const tokens = new Tokenizer("((((a))))").tokenize().filter((t) => t.type !== "eof");
    const classes = computeBracketDepthClasses(tokens);
    const parenI = tokens
      .map((t, i) => (t.type === "lparen" || t.type === "rparen" ? i : -1))
      .filter((i) => i >= 0);
    expect(parenI).toHaveLength(8);
    expect(classes[parenI[0]]).toBe("bracket-depth-0");
    expect(classes[parenI[1]]).toBe("bracket-depth-1");
    expect(classes[parenI[2]]).toBe("bracket-depth-2");
    expect(classes[parenI[3]]).toBe("bracket-depth-3");
    expect(classes[parenI[4]]).toBe("bracket-depth-3");
    expect(classes[parenI[5]]).toBe("bracket-depth-2");
    expect(classes[parenI[6]]).toBe("bracket-depth-1");
    expect(classes[parenI[7]]).toBe("bracket-depth-0");
  });

  it("handles (a[b]) nesting", () => {
    const tokens = new Tokenizer("(a[b])").tokenize().filter((t) => t.type !== "eof");
    const classes = computeBracketDepthClasses(tokens);
    const types = tokens.map((t) => t.type);

    const iParenOpen = types.indexOf("lparen");
    const iBracketOpen = types.indexOf("lbracket");
    const iBracketClose = types.indexOf("rbracket");
    const iParenClose = types.indexOf("rparen");

    expect(classes[iParenOpen]).toBe("bracket-depth-0");
    expect(classes[iParenClose]).toBe("bracket-depth-0");
    expect(classes[iBracketOpen]).toBe("bracket-depth-1");
    expect(classes[iBracketClose]).toBe("bracket-depth-1");
  });

  it("returns null for mismatched closer in ([)]", () => {
    const c = classesFor("([)]");
    const tokens = new Tokenizer("([)]").tokenize().filter((t) => t.type !== "eof");
    const iMisplacedRparen = tokens.findIndex((t) => t.type === "rparen");
    expect(c[iMisplacedRparen]).toBeNull();
    const iBracketClose = tokens.findIndex((t) => t.type === "rbracket");
    expect(c[iBracketClose]).toBe("bracket-depth-1");
  });

  it("returns null for stray closing paren", () => {
    const c = classesFor(")");
    expect(c[0]).toBeNull();
  });

  it("returns null for stray closing bracket", () => {
    const c = classesFor("]");
    expect(c[0]).toBeNull();
  });
});

import { getIntellisenseContext } from "./intellisenseContext";

describe("getIntellisenseContext string-literal completions", () => {
  it("returns string-literal-list inside variables('...') with correct prefix and range", () => {
    const value = "variables('co";
    const cursor = value.length;
    const ctx = getIntellisenseContext(value, cursor);
    expect(ctx && ctx.kind).toBe("string-literal-list");
    if (!ctx || ctx.kind !== "string-literal-list") return;
    expect(ctx.source).toBe("variables");
    expect(ctx.prefix).toBe("co");
    // Content starts right after opening quote
    expect(value[ctx.replaceStart - 1]).toBe("'");
    expect(value.slice(ctx.replaceStart, cursor)).toBe("co");
    // No closing quote yet, so replaceEnd should be cursor
    expect(ctx.replaceEnd).toBe(cursor);
  });

  it("does not return string-literal-list when not inside a string", () => {
    const value = "variables(";
    const cursor = value.length;
    const ctx = getIntellisenseContext(value, cursor);
    expect(ctx && ctx.kind).not.toBe("string-literal-list");
  });

  it("sets replaceEnd to the closing quote when present (so completion replaces whole string)", () => {
    const value = "variables('old')";
    const cursor = value.indexOf("old") + 2; // inside the word
    const ctx = getIntellisenseContext(value, cursor);
    expect(ctx && ctx.kind).toBe("string-literal-list");
    if (!ctx || ctx.kind !== "string-literal-list") return;
    expect(ctx.prefix).toBe("ol");
    expect(value[ctx.replaceEnd]).toBe("'");
    expect(value.slice(ctx.replaceStart, ctx.replaceEnd)).toBe("old");
  });
});


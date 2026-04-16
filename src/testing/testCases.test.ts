import { assertInterpretOutput } from "./testCases";

describe("assertInterpretOutput", () => {
  it("passes when expected value matches (deep strict)", () => {
    const actual = { success: true as const, value: { a: [1, 2, { b: "c" }] } };
    const r = assertInterpretOutput(actual, {
      kind: "value",
      value: { a: [1, 2, { b: "c" }] },
    });
    expect(r.pass).toBe(true);
  });

  it("fails when expected value mismatches", () => {
    const actual = { success: true as const, value: { a: [1, 2] } };
    const r = assertInterpretOutput(actual, {
      kind: "value",
      value: { a: [1, 3] },
    });
    expect(r.pass).toBe(false);
    expect(r.message).toMatch(/Value mismatch/);
  });

  it("passes when expected error kind matches and message includes substring", () => {
    const actual = {
      success: false as const,
      kind: "TypeError" as const,
      error: "Cannot index value with given index",
    };
    const r = assertInterpretOutput(actual, {
      kind: "error",
      errorKind: "TypeError",
      messageIncludes: "Cannot index",
    });
    expect(r.pass).toBe(true);
  });

  it("fails when error kind mismatches", () => {
    const actual = {
      success: false as const,
      kind: "RuntimeError" as const,
      error: "Boom",
    };
    const r = assertInterpretOutput(actual, {
      kind: "error",
      errorKind: "TypeError",
      messageIncludes: "Boom",
    });
    expect(r.pass).toBe(false);
    expect(r.message).toMatch(/Expected TypeError/);
  });
});


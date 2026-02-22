import { describe, it, expect } from "vitest";
import { interpret } from "../index";
import { createContext } from "../../test/testHelpers";

describe("Math functions", () => {
  const ctx = createContext({});

  it("add", () => {
    expect(interpret("add(1, 2)", ctx)).toMatchObject({
      success: true,
      value: 3,
    });
    expect(interpret("add(10, -3)", ctx)).toMatchObject({
      success: true,
      value: 7,
    });
  });

  it("sub", () => {
    expect(interpret("sub(10, 3)", ctx)).toMatchObject({
      success: true,
      value: 7,
    });
    expect(interpret("sub(0, 5)", ctx)).toMatchObject({
      success: true,
      value: -5,
    });
  });

  it("mul", () => {
    expect(interpret("mul(3, 4)", ctx)).toMatchObject({
      success: true,
      value: 12,
    });
  });

  it("div", () => {
    expect(interpret("div(10, 2)", ctx)).toMatchObject({
      success: true,
      value: 5,
    });
    expect(interpret("div(7, 2)", ctx)).toMatchObject({
      success: true,
      value: 3.5,
    });
  });

  it("div by zero throws", () => {
    const r = interpret("div(1, 0)", ctx);
    expect(r.success).toBe(false);
  });

  it("mod", () => {
    expect(interpret("mod(10, 3)", ctx)).toMatchObject({
      success: true,
      value: 1,
    });
    expect(interpret("mod(5, 5)", ctx)).toMatchObject({
      success: true,
      value: 0,
    });
  });

  it("mod by zero throws", () => {
    const r = interpret("mod(10, 0)", ctx);
    expect(r.success).toBe(false);
  });

  it("min with array", () => {
    expect(interpret("min(createArray(5, 2, 8, 1))", ctx)).toMatchObject({
      success: true,
      value: 1,
    });
    expect(interpret("min(createArray(1, 2, 3, 0))", ctx)).toMatchObject({
      success: true,
      value: 0,
    });
  });

  it("max with array", () => {
    expect(interpret("max(createArray(1, 5, 3))", ctx)).toMatchObject({
      success: true,
      value: 5,
    });
    expect(interpret("max(createArray(1, 2, 3))", ctx)).toMatchObject({
      success: true,
      value: 3,
    });
  });

  it("rand", () => {
    for (let i = 0; i < 20; i++) {
      const r = interpret("rand(1, 5)", ctx);
      expect(r.success).toBe(true);
      expect(typeof (r as { value: number }).value).toBe("number");
      const v = (r as { value: number }).value;
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThan(5);
    }
  });
});

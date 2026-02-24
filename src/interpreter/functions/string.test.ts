import { describe, it, expect } from "vitest";
import { interpret } from "../index";
import { createContext } from "../../test/testHelpers";

describe("String functions", () => {
  const ctx = createContext({});

  it("concat", () => {
    expect(interpret("concat('Hello', ' ', 'World')", ctx)).toMatchObject({
      success: true,
      value: "Hello World",
    });
    expect(interpret("concat('a', 'b', 'c')", ctx)).toMatchObject({
      success: true,
      value: "abc",
    });
  });

  it("toLower", () => {
    expect(interpret("toLower('Hello World')", ctx)).toMatchObject({
      success: true,
      value: "hello world",
    });
    expect(interpret("toLower('POWER')", ctx)).toMatchObject({
      success: true,
      value: "power",
    });
  });

  it("toUpper", () => {
    expect(interpret("toUpper('hello')", ctx)).toMatchObject({
      success: true,
      value: "HELLO",
    });
  });

  it("length on string", () => {
    expect(interpret("length('hello')", ctx)).toMatchObject({
      success: true,
      value: 5,
    });
  });

  it("length on array", () => {
    expect(interpret("length(createArray('a', 'b', 'c'))", ctx)).toMatchObject({
      success: true,
      value: 3,
    });
  });

  it("substring with length", () => {
    expect(interpret("substring('hello', 1, 3)", ctx)).toMatchObject({
      success: true,
      value: "ell",
    });
    expect(interpret("substring('hello', 0, 2)", ctx)).toMatchObject({
      success: true,
      value: "he",
    });
  });

  it("substring without length", () => {
    expect(interpret("substring('hello', 2)", ctx)).toMatchObject({
      success: true,
      value: "llo",
    });
  });

  it("split", () => {
    expect(interpret("split('a,b,c', ',')", ctx)).toMatchObject({
      success: true,
      value: ["a", "b", "c"],
    });
    expect(interpret("split('one-two-three', '-')", ctx)).toMatchObject({
      success: true,
      value: ["one", "two", "three"],
    });
  });

  it("replace", () => {
    expect(
      interpret("replace('hello world', 'world', 'there')", ctx),
    ).toMatchObject({
      success: true,
      value: "hello there",
    });
    expect(
      interpret("replace('foo bar foo', 'foo', 'baz')", ctx),
    ).toMatchObject({
      success: true,
      value: "baz bar baz",
    });
  });

  it("trim", () => {
    expect(interpret("trim('  hello  ')", ctx)).toMatchObject({
      success: true,
      value: "hello",
    });
  });

  it("startsWith", () => {
    expect(interpret("startsWith('hello', 'he')", ctx)).toMatchObject({
      success: true,
      value: true,
    });
    expect(interpret("startsWith('hello', 'lo')", ctx)).toMatchObject({
      success: true,
      value: false,
    });
    expect(interpret("startsWith('Hello', 'he')", ctx)).toMatchObject({
      success: true,
      value: true,
    });
  });

  it("endsWith", () => {
    expect(interpret("endsWith('hello', 'lo')", ctx)).toMatchObject({
      success: true,
      value: true,
    });
    expect(interpret("endsWith('hello', 'he')", ctx)).toMatchObject({
      success: true,
      value: false,
    });
  });

  it("coerces null/undefined to empty string", () => {
    expect(interpret("concat(null, 'x')", ctx)).toMatchObject({
      success: true,
      value: "x",
    });
  });

  it("formatNumber", () => {
    expect(
      interpret("formatNumber(1234567890, '#,##0.00', 'en-US')", ctx),
    ).toMatchObject({
      success: true,
      value: "1,234,567,890.00",
    });
    expect(interpret("formatNumber(17.35, 'C2')", ctx)).toMatchObject({
      success: true,
      value: "$17.35",
    });
    expect(interpret("formatNumber(100, 'C0', 'is-IS')", ctx)).toMatchObject({
      success: true,
      value: expect.stringMatching(/^100\s*kr\.?$/),
    });
  });

  it("isFloat", () => {
    expect(interpret("isFloat('10,000.00')", ctx)).toMatchObject({
      success: true,
      value: true,
    });
    expect(interpret("isFloat('abc')", ctx)).toMatchObject({
      success: true,
      value: false,
    });
  });

  it("isInt", () => {
    expect(interpret("isInt('123')", ctx)).toMatchObject({
      success: true,
      value: true,
    });
    expect(interpret("isInt('12.5')", ctx)).toMatchObject({
      success: true,
      value: false,
    });
  });

  it("lastIndexOf", () => {
    expect(
      interpret("lastIndexOf('hello world hello world', 'world')", ctx),
    ).toMatchObject({ success: true, value: 18 });
  });

  it("nthIndexOf", () => {
    expect(
      interpret("nthIndexOf('123456789123465789', '1', 1)", ctx),
    ).toMatchObject({ success: true, value: 0 });
    expect(
      interpret("nthIndexOf('123456789123465789', '1', 2)", ctx),
    ).toMatchObject({ success: true, value: 9 });
  });
  it("indexOf", () => {
    expect(interpret("indexOf('hello world', 'world')", ctx)).toMatchObject({
      success: true,
      value: 6,
    });
    expect(interpret("indexOf('hello', 'xyz')", ctx)).toMatchObject({
      success: true,
      value: -1,
    });
    expect(interpret("indexOf('Hello', 'ell')", ctx)).toMatchObject({
      success: true,
      value: 1,
    });
  });
  it("slice", () => {
    expect(interpret("slice('hello', 1, 4)", ctx)).toMatchObject({
      success: true,
      value: "ell",
    });
    expect(interpret("slice('hello', 2)", ctx)).toMatchObject({
      success: true,
      value: "llo",
    });
  });
  it("guid", () => {
    const r = interpret("guid()", ctx);
    expect(r.success).toBe(true);
    const v = (r as { value: string }).value;
    expect(typeof v).toBe("string");
    expect(v).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });
});

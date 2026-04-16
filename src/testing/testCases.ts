import type { EvaluationContext, InputType, TypedInput } from "../interpreter/context";
import type { InterpretOutput } from "../interpreter";
import { deepStrictEqual } from "./deepStrictEqual";

export type Expectation =
  | {
      kind: "value";
      value: unknown;
    }
  | {
      kind: "error";
      errorKind:
        | "ParseError"
        | "UnknownFunction"
        | "TypeError"
        | "RuntimeError"
        | "MissingParameter";
      /** If provided, `error` text must include this substring */
      messageIncludes?: string;
    };

export interface TestCaseContextOverride {
  parameters?: Record<string, TypedInput>;
  variables?: Record<string, TypedInput>;
  triggerBody?: unknown;
}

export interface TestCase {
  id: string;
  name: string;
  contextOverride?: TestCaseContextOverride;
  expect: Expectation;
}

export interface TestRunResult {
  caseId: string;
  caseName: string;
  pass: boolean;
  output: InterpretOutput;
  /** Human-readable mismatch explanation when failed */
  failureMessage?: string;
}

export function mergeContext(
  base: EvaluationContext,
  override?: TestCaseContextOverride,
): EvaluationContext {
  if (!override) return base;
  return {
    triggerBody: override.triggerBody ?? base.triggerBody,
    parameters: { ...base.parameters, ...(override.parameters ?? {}) },
    variables: { ...base.variables, ...(override.variables ?? {}) },
  };
}

export function makeTypedInput(type: InputType, value: unknown): TypedInput {
  return { type, value };
}

export function assertInterpretOutput(
  actual: InterpretOutput,
  expect: Expectation,
): { pass: boolean; message?: string } {
  if (expect.kind === "value") {
    if (!actual.success) {
      return {
        pass: false,
        message: `Expected value, but got ${actual.kind ?? "Error"}: ${actual.error}`,
      };
    }
    const r = deepStrictEqual(expect.value, actual.value);
    if (r.equal) return { pass: true };
    const where = r.diffPath ? ` at ${r.diffPath}` : "";
    return {
      pass: false,
      message: `Value mismatch${where}`,
    };
  }

  // expect error
  if (actual.success) {
    return { pass: false, message: "Expected error, but got a value result" };
  }
  if (actual.kind !== expect.errorKind) {
    return {
      pass: false,
      message: `Expected ${expect.errorKind}, but got ${actual.kind ?? "Error"}`,
    };
  }
  if (expect.messageIncludes && !actual.error.includes(expect.messageIncludes)) {
    return {
      pass: false,
      message: `Expected error message to include: ${JSON.stringify(expect.messageIncludes)}`,
    };
  }
  return { pass: true };
}


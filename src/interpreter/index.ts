import { Parser, ParseError } from "./parser/parser";
import { Tokenizer } from "./parser/tokenizer";
import { evaluate, EvaluationError } from "./evaluator";
import { validateArity } from "./validator";
import type { EvaluationContext } from "./context";
import type { TestCase, TestRunResult } from "../testing/testCases";
import { assertInterpretOutput, mergeContext } from "../testing/testCases";
import { createTraceCollector, type TraceEvent } from "./trace";

export interface InterpretResult {
  success: true;
  value: unknown;
}

export interface InterpretError {
  success: false;
  error: string;
  kind?:
    | "ParseError"
    | "UnknownFunction"
    | "TypeError"
    | "RuntimeError"
    | "MissingParameter";
}

export type InterpretOutput = InterpretResult | InterpretError;

export function interpret(
  expression: string,
  context: EvaluationContext,
): InterpretOutput {
  const trimmed = expression.trim();
  if (!trimmed) {
    return { success: false, error: "Expression is empty", kind: "ParseError" };
  }

  try {
    const tokenizer = new Tokenizer(trimmed);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    validateArity(ast);
    const value = evaluate(ast, context);
    return { success: true, value };
  } catch (e) {
    if (e instanceof ParseError) {
      return { success: false, error: e.message, kind: "ParseError" };
    }
    if (e instanceof EvaluationError) {
      return { success: false, error: e.message, kind: e.kind };
    }
    return { success: false, error: String(e) };
  }
}

export interface InterpretManyResult {
  expression: string;
  baseContext: EvaluationContext;
  results: Array<{ index: number; output: InterpretOutput }>;
}

export function interpretMany(
  expression: string,
  baseContext: EvaluationContext,
  contexts: EvaluationContext[],
): InterpretManyResult {
  const results = contexts.map((ctx, index) => ({
    index,
    output: interpret(expression, ctx),
  }));
  return { expression, baseContext, results };
}

export function runTestCases(
  expression: string,
  baseContext: EvaluationContext,
  cases: TestCase[],
): TestRunResult[] {
  return cases.map((tc) => {
    const ctx = mergeContext(baseContext, tc.contextOverride);
    const output = interpret(expression, ctx);
    const a = assertInterpretOutput(output, tc.expect);
    return {
      caseId: tc.id,
      caseName: tc.name,
      pass: a.pass,
      output,
      failureMessage: a.pass ? undefined : a.message,
    };
  });
}

export interface InterpretWithTraceResult {
  output: InterpretOutput;
  trace: TraceEvent[];
}

export function interpretWithTrace(
  expression: string,
  context: EvaluationContext,
): InterpretWithTraceResult {
  const trimmed = expression.trim();
  if (!trimmed) {
    return {
      output: { success: false, error: "Expression is empty", kind: "ParseError" },
      trace: [],
    };
  }

  const trace = createTraceCollector();

  try {
    const tokenizer = new Tokenizer(trimmed);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    validateArity(ast);
    const value = evaluate(ast, context, trace);
    return { output: { success: true, value }, trace: trace.events };
  } catch (e) {
    if (e instanceof ParseError) {
      return { output: { success: false, error: e.message, kind: "ParseError" }, trace: [] };
    }
    if (e instanceof EvaluationError) {
      return { output: { success: false, error: e.message, kind: e.kind }, trace: trace.events };
    }
    return { output: { success: false, error: String(e) }, trace: trace.events };
  }
}

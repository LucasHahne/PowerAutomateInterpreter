import { Parser, ParseError } from "./parser/parser";
import { Tokenizer } from "./parser/tokenizer";
import { evaluate, EvaluationError } from "./evaluator";
import { validateArity } from "./validator";
import type { EvaluationContext } from "./context";

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

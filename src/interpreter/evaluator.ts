import type { AstNode, FunctionCallNode, LiteralNode, ParametersCallNode, SelectionNode, VariablesCallNode } from './parser/ast';
import type { EvaluationContext } from './context';
import { getFunction } from './functions';
import type { TraceCollector } from './trace';

export class EvaluationError extends Error {
  readonly kind?: 'ParseError' | 'UnknownFunction' | 'TypeError' | 'RuntimeError' | 'MissingParameter';
  constructor(
    message: string,
    kind?: 'ParseError' | 'UnknownFunction' | 'TypeError' | 'RuntimeError' | 'MissingParameter'
  ) {
    super(message);
    this.name = 'EvaluationError';
    this.kind = kind;
  }
}

export function evaluate(node: AstNode, ctx: EvaluationContext, trace?: TraceCollector): unknown {
  switch (node.type) {
    case 'literal':
      return (node as LiteralNode).value;
    case 'parametersCall': {
      const n = node as ParametersCallNode;
      if (!(n.paramName in ctx.parameters)) {
        throw new EvaluationError(`Parameter '${n.paramName}' is not defined`, 'MissingParameter');
      }
      const value = ctx.parameters[n.paramName].value;
      trace?.emitter.emit({ kind: 'parametersCall', name: n.paramName, value });
      return value;
    }
    case 'variablesCall': {
      const n = node as VariablesCallNode;
      if (!(n.varName in ctx.variables)) {
        throw new EvaluationError(`Variable '${n.varName}' is not defined`, 'MissingParameter');
      }
      const value = ctx.variables[n.varName].value;
      trace?.emitter.emit({ kind: 'variablesCall', name: n.varName, value });
      return value;
    }
    case 'functionCall': {
      const n = node as FunctionCallNode;
      const handler = getFunction(n.name);
      if (!handler) {
        throw new EvaluationError(`Unknown function '${n.name}'`, 'UnknownFunction');
      }
      const startId = trace?.emitter.emit({
        kind: 'functionCallStart',
        functionName: n.name,
      });
      if (startId) trace?._pushParent(startId);
      const evaluatedArgs = n.args.map((arg) => evaluate(arg, ctx, trace));
      trace?.emitter.emit({ kind: 'functionCallArgs', functionName: n.name, args: evaluatedArgs });
      try {
        const result = handler(evaluatedArgs, ctx);
        trace?.emitter.emit({ kind: 'functionCallEnd', functionName: n.name, result });
        return result;
      } catch (e) {
        if (e instanceof EvaluationError) throw e;
        if (e instanceof TypeError) throw new EvaluationError(e.message, 'TypeError');
        throw new EvaluationError(String(e), 'RuntimeError');
      } finally {
        if (startId) trace?._popParent();
      }
    }
    case 'selection': {
      const n = node as SelectionNode;
      let value: unknown = evaluate(n.base, ctx, trace);
      for (const step of n.steps) {
        if (step.optional && (value === null || value === undefined)) return undefined;
        const index = evaluate(step.index, ctx, trace);
        if (Array.isArray(value) && typeof index === 'number') value = value[Number(index)];
        else if (value !== null && typeof value === 'object' && (typeof index === 'string' || typeof index === 'number'))
          value = (value as Record<string | number, unknown>)[index];
        else throw new EvaluationError('Cannot index value with given index', 'TypeError');
        trace?.emitter.emit({ kind: 'selectionStep', optional: step.optional, index, result: value });
      }
      return value;
    }
    default:
      throw new EvaluationError(`Unknown node type: ${(node as AstNode).type}`);
  }
}

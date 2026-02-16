import type { AstNode, FunctionCallNode, SelectionNode } from './parser/ast';
import { getFunctionArity } from './functions/metadata';
import { getFunction } from './functions';
import { EvaluationError } from './evaluator';

function formatArityExpected(arity: { min: number; max: number | null }): string {
  if (arity.max === null) {
    return `at least ${arity.min} argument${arity.min === 1 ? '' : 's'}`;
  }
  if (arity.min === arity.max) {
    return `${arity.min} argument${arity.min === 1 ? '' : 's'}`;
  }
  return `between ${arity.min} and ${arity.max} arguments`;
}

export function validateArity(node: AstNode): void {
  switch (node.type) {
    case 'literal':
    case 'parametersCall':
    case 'variablesCall':
      return;
    case 'functionCall': {
      const n = node as FunctionCallNode;
      const handler = getFunction(n.name);
      if (!handler) {
        throw new EvaluationError(`Unknown function '${n.name}'`, 'UnknownFunction');
      }
      // Validate nested calls first so we report the innermost error
      for (const arg of n.args) {
        validateArity(arg);
      }
      const arity = getFunctionArity(n.name);
      if (arity) {
        const count = n.args.length;
        if (count < arity.min) {
          throw new EvaluationError(
            `${n.name}() expects ${formatArityExpected(arity)}, but received ${count}`,
            'TypeError'
          );
        }
        if (arity.max !== null && count > arity.max) {
          throw new EvaluationError(
            `${n.name}() expects ${formatArityExpected(arity)}, but received ${count}`,
            'TypeError'
          );
        }
      }
      return;
    }
    case 'selection': {
      const n = node as SelectionNode;
      validateArity(n.base);
      for (const step of n.steps) validateArity(step.index);
      return;
    }
    default:
      throw new EvaluationError(`Unknown node type: ${(node as AstNode).type}`);
  }
}

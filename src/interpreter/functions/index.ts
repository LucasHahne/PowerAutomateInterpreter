import type { EvaluationContext } from '../context';
import { stringFunctions } from './string';
import { mathFunctions } from './math';
import { logicalFunctions } from './logical';
import { conversionFunctions } from './conversion';
import { collectionFunctions } from './collection';
import { dateTimeFunctions } from './dateTime';
import { workflowFunctions } from './workflow';

export type FunctionHandler = (args: unknown[], context: EvaluationContext) => unknown;

export const functionRegistry: Map<string, FunctionHandler> = new Map();

function registerAll(map: Record<string, FunctionHandler>): void {
  for (const [name, fn] of Object.entries(map)) {
    functionRegistry.set(name, fn);
  }
}

registerAll(stringFunctions);
registerAll(mathFunctions);
registerAll(logicalFunctions);
registerAll(conversionFunctions);
registerAll(collectionFunctions);
registerAll(dateTimeFunctions);
registerAll(workflowFunctions);

export function getFunction(name: string): FunctionHandler | undefined {
  return functionRegistry.get(name);
}

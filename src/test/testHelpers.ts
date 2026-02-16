import type { EvaluationContext, InputType, TypedInput } from '../interpreter/context';

function inferType(value: unknown): InputType {
  if (value === null || value === undefined) return 'string';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'float';
  if (typeof value === 'boolean') return 'boolean';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  return 'string';
}

export function createContext(overrides: {
  parameters?: Record<string, unknown>;
  variables?: Record<string, unknown>;
  triggerBody?: unknown;
}): EvaluationContext {
  const parameters: Record<string, TypedInput> = {};
  const variables: Record<string, TypedInput> = {};

  for (const [name, value] of Object.entries(overrides.parameters ?? {})) {
    parameters[name] = { value, type: inferType(value) };
  }
  for (const [name, value] of Object.entries(overrides.variables ?? {})) {
    variables[name] = { value, type: inferType(value) };
  }

  const ctx: EvaluationContext = { parameters, variables };
  if (overrides.triggerBody !== undefined) {
    ctx.triggerBody = overrides.triggerBody;
  }
  return ctx;
}

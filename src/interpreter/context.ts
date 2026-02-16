export type InputType = 'string' | 'integer' | 'float' | 'boolean' | 'object' | 'array';

export interface TypedInput {
  value: unknown;
  type: InputType;
}

export interface EvaluationContext {
  parameters: Record<string, TypedInput>;
  variables: Record<string, TypedInput>;
  triggerBody?: unknown;
}

export function createEmptyContext(): EvaluationContext {
  return {
    parameters: {},
    variables: {},
  };
}

function parseObjectOrArray(value: unknown, type: 'object' | 'array'): unknown {
  if (typeof value !== 'string') return value;
  const str = value.trim();
  if (!str) return type === 'object' ? {} : [];
  try {
    const parsed = JSON.parse(str);
    return type === 'array' && !Array.isArray(parsed) ? [parsed] : parsed;
  } catch {
    try {
      const withDoubleQuotes = str.replace(/'/g, '"');
      const parsed = JSON.parse(withDoubleQuotes);
      return type === 'array' && !Array.isArray(parsed) ? [parsed] : parsed;
    } catch {
      return type === 'object' ? {} : [];
    }
  }
}

export function getParameter(ctx: EvaluationContext, name: string): unknown {
  const entry = ctx.parameters[name];
  if (!entry) return undefined;
  if (entry.type === 'object' || entry.type === 'array') {
    return parseObjectOrArray(entry.value, entry.type);
  }
  return entry.value;
}

export function getVariable(ctx: EvaluationContext, name: string): unknown {
  const entry = ctx.variables[name];
  if (!entry) return undefined;
  if (entry.type === 'object' || entry.type === 'array') {
    return parseObjectOrArray(entry.value, entry.type);
  }
  return entry.value;
}

export function hasParameter(ctx: EvaluationContext, name: string): boolean {
  return name in ctx.parameters;
}

export function hasVariable(ctx: EvaluationContext, name: string): boolean {
  return name in ctx.variables;
}

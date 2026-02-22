import type { EvaluationContext } from '../context';

export const manipulationFunctions: Record<string, (args: unknown[], ctx: EvaluationContext) => unknown> = {
  addProperty: (args) => {
    /* c8 ignore next */
    if (args.length !== 3) throw new TypeError('addProperty expects 3 arguments');
    const obj = args[0];
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj))
      throw new TypeError('addProperty first argument must be an object');
    const prop = String(args[1]);
    const value = args[2];
    if (prop in obj) throw new Error(`Property '${prop}' already exists`);
    return { ...(obj as Record<string, unknown>), [prop]: value };
  },
  removeProperty: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError('removeProperty expects 2 arguments');
    const obj = args[0];
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj))
      throw new TypeError('removeProperty first argument must be an object');
    const prop = String(args[1]);
    const copy = { ...(obj as Record<string, unknown>) };
    delete copy[prop];
    return copy;
  },
  setProperty: (args) => {
    /* c8 ignore next */
    if (args.length !== 3) throw new TypeError('setProperty expects 3 arguments');
    const obj = args[0];
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj))
      throw new TypeError('setProperty first argument must be an object');
    const prop = String(args[1]);
    const value = args[2];
    return { ...(obj as Record<string, unknown>), [prop]: value };
  },
};

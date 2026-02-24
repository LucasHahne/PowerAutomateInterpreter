import type { EvaluationContext } from '../context';

export const logicalFunctions: Record<string, (args: unknown[], ctx: EvaluationContext) => unknown> = {
  and: (args) => {
    /* c8 ignore next */
    if (args.length < 2) throw new TypeError('and expects at least 2 arguments');
    return args.every((a) => Boolean(a));
  },
  or: (args) => {
    /* c8 ignore next */
    if (args.length < 2) throw new TypeError('or expects at least 2 arguments');
    return args.some((a) => Boolean(a));
  },
  not: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('not expects 1 argument');
    return !Boolean(args[0]);
  },
  equals: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError('equals expects 2 arguments');
    const a = args[0];
    const b = args[1];
    // Loose equality per reference: equals(true, 1) => true
    return a == b;
  },
  if: (args) => {
    /* c8 ignore next */
    if (args.length !== 3) throw new TypeError('if expects 3 arguments');
    return Boolean(args[0]) ? args[1] : args[2];
  },
  greater: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError('greater expects 2 arguments');
    const a = args[0];
    const b = args[1];
    if (typeof a === 'number' && typeof b === 'number') return a > b;
    return String(a) > String(b);
  },
  less: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError('less expects 2 arguments');
    const a = args[0];
    const b = args[1];
    if (typeof a === 'number' && typeof b === 'number') return a < b;
    return String(a) < String(b);
  },
  greaterOrEquals: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError('greaterOrEquals expects 2 arguments');
    const a = args[0];
    const b = args[1];
    if (typeof a === 'number' && typeof b === 'number') return a >= b;
    return String(a) >= String(b);
  },
  lessOrEquals: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError('lessOrEquals expects 2 arguments');
    const a = args[0];
    const b = args[1];
    if (typeof a === 'number' && typeof b === 'number') return a <= b;
    return String(a) <= String(b);
  },
  coalesce: (args) => {
    /* c8 ignore next */
    if (args.length < 1) throw new TypeError('coalesce expects at least 1 argument');
    for (const v of args) {
      if (v !== null && v !== undefined) return v;
    }
    return null;
  },
};

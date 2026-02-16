import type { EvaluationContext } from '../context';

function toNumber(val: unknown): number {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') {
    const n = parseFloat(val);
    if (!isNaN(n)) return n;
  }
  /* c8 ignore next */
  throw new TypeError(`Expected number, got ${typeof val}`);
}

export const mathFunctions: Record<string, (args: unknown[], ctx: EvaluationContext) => unknown> = {
  add: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError('add expects 2 arguments');
    return toNumber(args[0]) + toNumber(args[1]);
  },
  sub: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError('sub expects 2 arguments');
    return toNumber(args[0]) - toNumber(args[1]);
  },
  mul: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError('mul expects 2 arguments');
    return toNumber(args[0]) * toNumber(args[1]);
  },
  div: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError('div expects 2 arguments');
    const b = toNumber(args[1]);
    if (b === 0) throw new Error('Division by zero');
    return toNumber(args[0]) / b;
  },
  mod: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError('mod expects 2 arguments');
    const b = toNumber(args[1]);
    if (b === 0) throw new Error('Division by zero');
    return toNumber(args[0]) % b;
  },
  min: (args) => {
    /* c8 ignore next */
    if (args.length < 1) throw new TypeError('min expects at least 1 argument');
    const arr = Array.isArray(args[0]) ? (args[0] as unknown[]).map(toNumber) : args.map(toNumber);
    return Math.min(...arr);
  },
  max: (args) => {
    /* c8 ignore next */
    if (args.length < 1) throw new TypeError('max expects at least 1 argument');
    const arr = Array.isArray(args[0]) ? (args[0] as unknown[]).map(toNumber) : args.map(toNumber);
    return Math.max(...arr);
  },
};

import type { EvaluationContext } from '../context';

function ensureString(val: unknown): string {
  if (typeof val === 'string') return val;
  if (val === null || val === undefined) return '';
  return String(val);
}

export const stringFunctions: Record<string, (args: unknown[], ctx: EvaluationContext) => unknown> = {
  concat: (args) => {
    /* c8 ignore next */
    if (args.length < 2) throw new TypeError('concat expects at least 2 arguments');
    return args.map(ensureString).join('');
  },
  toLower: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('toLower expects 1 argument');
    return ensureString(args[0]).toLowerCase();
  },
  toUpper: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('toUpper expects 1 argument');
    return ensureString(args[0]).toUpperCase();
  },
  length: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('length expects 1 argument');
    const v = args[0];
    if (typeof v === 'string') return v.length;
    if (Array.isArray(v)) return v.length;
    /* c8 ignore next */
    throw new TypeError('length expects string or array');
  },
  substring: (args) => {
    /* c8 ignore next */
    if (args.length < 2 || args.length > 3) throw new TypeError('substring expects 2 or 3 arguments');
    const s = ensureString(args[0]);
    const start = Number(args[1]);
    /* c8 ignore next */
    if (isNaN(start) || start < 0) throw new TypeError('substring startIndex must be non-negative integer');
    if (args.length === 3) {
      const len = Number(args[2]);
      /* c8 ignore next */
      if (isNaN(len) || len < 0) throw new TypeError('substring length must be non-negative integer');
      return s.substring(start, start + len);
    }
    return s.substring(start);
  },
  split: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError('split expects 2 arguments');
    const s = ensureString(args[0]);
    const delim = ensureString(args[1]);
    return s.split(delim);
  },
  replace: (args) => {
    /* c8 ignore next */
    if (args.length !== 3) throw new TypeError('replace expects 3 arguments');
    const s = ensureString(args[0]);
    const old = ensureString(args[1]);
    const repl = ensureString(args[2]);
    return s.split(old).join(repl);
  },
  trim: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('trim expects 1 argument');
    return ensureString(args[0]).trim();
  },
  startsWith: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError('startsWith expects 2 arguments');
    return ensureString(args[0]).toLowerCase().startsWith(ensureString(args[1]).toLowerCase());
  },
  endsWith: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError('endsWith expects 2 arguments');
    return ensureString(args[0]).toLowerCase().endsWith(ensureString(args[1]).toLowerCase());
  },
};

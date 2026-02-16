import type { EvaluationContext } from '../context';

export const collectionFunctions: Record<string, (args: unknown[], ctx: EvaluationContext) => unknown> = {
  first: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('first expects 1 argument');
    const v = args[0];
    if (typeof v === 'string') return v[0] ?? '';
    if (Array.isArray(v)) return v[0];
    /* c8 ignore next */
    throw new TypeError('first expects string or array');
  },
  last: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('last expects 1 argument');
    const v = args[0];
    if (typeof v === 'string') return v[v.length - 1] ?? '';
    if (Array.isArray(v)) return v[v.length - 1];
    /* c8 ignore next */
    throw new TypeError('last expects string or array');
  },
  join: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError('join expects 2 arguments');
    const arr = args[0];
    const delim = String(args[1]);
    /* c8 ignore next */
    if (!Array.isArray(arr)) throw new TypeError('join expects array as first argument');
    return arr.map(String).join(delim);
  },
  take: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError('take expects 2 arguments');
    const v = args[0];
    const count = Number(args[1]);
    /* c8 ignore next */
    if (!Number.isInteger(count) || count < 0) throw new TypeError('take count must be non-negative integer');
    if (typeof v === 'string') return v.slice(0, count);
    if (Array.isArray(v)) return v.slice(0, count);
    /* c8 ignore next */
    throw new TypeError('take expects string or array');
  },
  skip: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError('skip expects 2 arguments');
    const v = args[0];
    const count = Number(args[1]);
    /* c8 ignore next */
    if (!Number.isInteger(count) || count < 0) throw new TypeError('skip count must be non-negative integer');
    if (typeof v === 'string') return v.slice(count);
    if (Array.isArray(v)) return v.slice(count);
    /* c8 ignore next */
    throw new TypeError('skip expects string or array');
  },
  contains: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError('contains expects 2 arguments');
    const col = args[0];
    const item = args[1];
    if (typeof col === 'string') return col.includes(String(item));
    if (Array.isArray(col)) return col.includes(item as never);
    if (col && typeof col === 'object' && !Array.isArray(col)) return String(item) in (col as object);
    /* c8 ignore next */
    throw new TypeError('contains expects string, array, or object');
  },
  empty: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('empty expects 1 argument');
    const v = args[0];
    if (typeof v === 'string') return v.length === 0;
    if (Array.isArray(v)) return v.length === 0;
    if (v && typeof v === 'object') return Object.keys(v).length === 0;
    return true;
  },
  union: (args) => {
    /* c8 ignore next */
    if (args.length < 2) throw new TypeError('union expects at least 2 arguments');
    const seen = new Set<unknown>();
    const result: unknown[] = [];
    for (const arr of args) {
      /* c8 ignore next */
      if (!Array.isArray(arr)) throw new TypeError('union expects arrays');
      for (const item of arr) {
        const key = typeof item === 'object' && item !== null ? JSON.stringify(item) : item;
        if (!seen.has(key)) {
          seen.add(key);
          result.push(item);
        }
      }
    }
    return result;
  },
  intersection: (args) => {
    /* c8 ignore next */
    if (args.length < 2) throw new TypeError('intersection expects at least 2 arguments');
    let result = new Set((args[0] as unknown[]).map((x) => (typeof x === 'object' && x !== null ? JSON.stringify(x) : x)));
    for (let i = 1; i < args.length; i++) {
      const arr = args[i];
      /* c8 ignore next */
      if (!Array.isArray(arr)) throw new TypeError('intersection expects arrays');
      const set = new Set(arr.map((x) => (typeof x === 'object' && x !== null ? JSON.stringify(x) : x)));
      result = new Set([...result].filter((x) => set.has(x)));
    }
    return [...result];
  },
};

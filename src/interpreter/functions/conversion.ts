import type { EvaluationContext } from '../context';

export const conversionFunctions: Record<string, (args: unknown[], ctx: EvaluationContext) => unknown> = {
  int: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('int expects 1 argument');
    const v = args[0];
    if (typeof v === 'number') return Math.trunc(v);
    const n = parseInt(String(v), 10);
    /* c8 ignore next */
    if (isNaN(n)) throw new TypeError(`Cannot convert '${v}' to integer`);
    return n;
  },
  float: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('float expects 1 argument');
    const v = args[0];
    if (typeof v === 'number') return v;
    const n = parseFloat(String(v).replace(/,/g, ''));
    /* c8 ignore next */
    if (isNaN(n)) throw new TypeError(`Cannot convert '${v}' to float`);
    return n;
  },
  string: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('string expects 1 argument');
    const v = args[0];
    if (v === null || v === undefined) return '';
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
  },
  bool: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('bool expects 1 argument');
    const v = args[0];
    if (typeof v === 'boolean') return v;
    if (v === 1 || v === 'true') return true;
    if (v === 0 || v === 'false') return false;
    return Boolean(v);
  },
  json: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('json expects 1 argument');
    const v = args[0];
    /* c8 ignore next */
    if (typeof v !== 'string') throw new TypeError('json expects string argument');
    try {
      return JSON.parse(v);
    } catch {
      /* c8 ignore next */
      throw new TypeError('Invalid JSON string');
    }
  },
  array: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('array expects 1 argument');
    return [args[0]];
  },
  createArray: (args) => {
    return [...args];
  },
};

import type { EvaluationContext } from '../context';

function parseTimestamp(s: string): Date {
  const d = new Date(s);
  /* c8 ignore next */
  if (isNaN(d.getTime())) throw new TypeError(`Invalid timestamp: ${s}`);
  return d;
}

function formatDate(d: Date, fmt?: string): string {
  if (!fmt || fmt === 'o') return d.toISOString();
  const pad = (n: number) => String(n).padStart(2, '0');
  const repl: Record<string, string> = {
    yyyy: String(d.getFullYear()),
    MM: pad(d.getMonth() + 1),
    dd: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds()),
  };
  let out = fmt;
  for (const [k, v] of Object.entries(repl)) out = out.replace(k, v);
  return out;
}

export const dateTimeFunctions: Record<string, (args: unknown[], ctx: EvaluationContext) => unknown> = {
  utcNow: (args, _ctx) => {
    const fmt = args.length >= 1 ? String(args[0]) : undefined;
    return formatDate(new Date(), fmt || 'o');
  },
  addDays: (args) => {
    /* c8 ignore next */
    if (args.length < 2) throw new TypeError('addDays expects at least 2 arguments');
    const d = parseTimestamp(String(args[0]));
    const days = Number(args[1]);
    /* c8 ignore next */
    if (!Number.isInteger(days)) throw new TypeError('addDays days must be integer');
    d.setUTCDate(d.getUTCDate() + days);
    return formatDate(d, args[2] ? String(args[2]) : 'o');
  },
  addHours: (args) => {
    /* c8 ignore next */
    if (args.length < 2) throw new TypeError('addHours expects at least 2 arguments');
    const d = parseTimestamp(String(args[0]));
    const h = Number(args[1]);
    /* c8 ignore next */
    if (!Number.isInteger(h)) throw new TypeError('addHours hours must be integer');
    d.setUTCHours(d.getUTCHours() + h);
    return formatDate(d, args[2] ? String(args[2]) : 'o');
  },
  formatDateTime: (args) => {
    /* c8 ignore next */
    if (args.length < 1) throw new TypeError('formatDateTime expects at least 1 argument');
    const d = parseTimestamp(String(args[0]));
    const fmt = args.length >= 2 ? String(args[1]) : 'o';
    return formatDate(d, fmt);
  },
  startOfDay: (args) => {
    /* c8 ignore next */
    if (args.length < 1) throw new TypeError('startOfDay expects at least 1 argument');
    const d = parseTimestamp(String(args[0]));
    d.setUTCHours(0, 0, 0, 0);
    return formatDate(d, args[1] ? String(args[1]) : 'o');
  },
};

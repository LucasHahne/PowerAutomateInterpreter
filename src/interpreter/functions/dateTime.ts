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
  addMinutes: (args) => {
    /* c8 ignore next */
    if (args.length < 2) throw new TypeError('addMinutes expects at least 2 arguments');
    const d = parseTimestamp(String(args[0]));
    const mins = Number(args[1]);
    if (!Number.isInteger(mins)) throw new TypeError('addMinutes minutes must be integer');
    d.setUTCMinutes(d.getUTCMinutes() + mins);
    return formatDate(d, args[2] ? String(args[2]) : 'o');
  },
  addSeconds: (args) => {
    /* c8 ignore next */
    if (args.length < 2) throw new TypeError('addSeconds expects at least 2 arguments');
    const d = parseTimestamp(String(args[0]));
    const secs = Number(args[1]);
    if (!Number.isInteger(secs)) throw new TypeError('addSeconds seconds must be integer');
    d.setUTCSeconds(d.getUTCSeconds() + secs);
    return formatDate(d, args[2] ? String(args[2]) : 'o');
  },
  addToTime: (args) => {
    /* c8 ignore next */
    if (args.length < 3) throw new TypeError('addToTime expects at least 3 arguments');
    const d = parseTimestamp(String(args[0]));
    const interval = Number(args[1]);
    if (!Number.isInteger(interval)) throw new TypeError('addToTime interval must be integer');
    const unit = String(args[2]).toLowerCase();
    const units: Record<string, () => void> = {
      second: () => d.setUTCSeconds(d.getUTCSeconds() + interval),
      minute: () => d.setUTCMinutes(d.getUTCMinutes() + interval),
      hour: () => d.setUTCHours(d.getUTCHours() + interval),
      day: () => d.setUTCDate(d.getUTCDate() + interval),
      week: () => d.setUTCDate(d.getUTCDate() + interval * 7),
      month: () => d.setUTCMonth(d.getUTCMonth() + interval),
      year: () => d.setUTCFullYear(d.getUTCFullYear() + interval),
    };
    const fn = units[unit];
    if (!fn) throw new TypeError(`addToTime invalid timeUnit: ${args[2]}`);
    fn();
    return formatDate(d, args[3] ? String(args[3]) : 'o');
  },
  subtractFromTime: (args) => {
    /* c8 ignore next */
    if (args.length < 3) throw new TypeError('subtractFromTime expects at least 3 arguments');
    const d = parseTimestamp(String(args[0]));
    const interval = Number(args[1]);
    if (!Number.isInteger(interval)) throw new TypeError('subtractFromTime interval must be integer');
    const unit = String(args[2]).toLowerCase();
    const units: Record<string, () => void> = {
      second: () => d.setUTCSeconds(d.getUTCSeconds() - interval),
      minute: () => d.setUTCMinutes(d.getUTCMinutes() - interval),
      hour: () => d.setUTCHours(d.getUTCHours() - interval),
      day: () => d.setUTCDate(d.getUTCDate() - interval),
      week: () => d.setUTCDate(d.getUTCDate() - interval * 7),
      month: () => d.setUTCMonth(d.getUTCMonth() - interval),
      year: () => d.setUTCFullYear(d.getUTCFullYear() - interval),
    };
    const fn = units[unit];
    if (!fn) throw new TypeError(`subtractFromTime invalid timeUnit: ${args[2]}`);
    fn();
    return formatDate(d, args[3] ? String(args[3]) : 'o');
  },
  getFutureTime: (args) => {
    /* c8 ignore next */
    if (args.length < 2) throw new TypeError('getFutureTime expects at least 2 arguments');
    const interval = Number(args[0]);
    if (!Number.isInteger(interval)) throw new TypeError('getFutureTime interval must be integer');
    const unit = String(args[1]).toLowerCase();
    const d = new Date();
    const units: Record<string, () => void> = {
      second: () => d.setUTCSeconds(d.getUTCSeconds() + interval),
      minute: () => d.setUTCMinutes(d.getUTCMinutes() + interval),
      hour: () => d.setUTCHours(d.getUTCHours() + interval),
      day: () => d.setUTCDate(d.getUTCDate() + interval),
      week: () => d.setUTCDate(d.getUTCDate() + interval * 7),
      month: () => d.setUTCMonth(d.getUTCMonth() + interval),
      year: () => d.setUTCFullYear(d.getUTCFullYear() + interval),
    };
    const fn = units[unit];
    if (!fn) throw new TypeError(`getFutureTime invalid timeUnit: ${args[1]}`);
    fn();
    return formatDate(d, args[2] ? String(args[2]) : 'o');
  },
  getPastTime: (args) => {
    /* c8 ignore next */
    if (args.length < 2) throw new TypeError('getPastTime expects at least 2 arguments');
    const interval = Number(args[0]);
    if (!Number.isInteger(interval)) throw new TypeError('getPastTime interval must be integer');
    const unit = String(args[1]).toLowerCase();
    const d = new Date();
    const units: Record<string, () => void> = {
      second: () => d.setUTCSeconds(d.getUTCSeconds() - interval),
      minute: () => d.setUTCMinutes(d.getUTCMinutes() - interval),
      hour: () => d.setUTCHours(d.getUTCHours() - interval),
      day: () => d.setUTCDate(d.getUTCDate() - interval),
      week: () => d.setUTCDate(d.getUTCDate() - interval * 7),
      month: () => d.setUTCMonth(d.getUTCMonth() - interval),
      year: () => d.setUTCFullYear(d.getUTCFullYear() - interval),
    };
    const fn = units[unit];
    if (!fn) throw new TypeError(`getPastTime invalid timeUnit: ${args[1]}`);
    fn();
    return formatDate(d, args[2] ? String(args[2]) : 'o');
  },
  dateDifference: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError('dateDifference expects 2 arguments');
    const start = parseTimestamp(String(args[0])).getTime();
    const end = parseTimestamp(String(args[1])).getTime();
    let ms = end - start;
    const sign = ms < 0 ? -1 : 1;
    ms = Math.abs(ms);
    const secs = Math.floor(ms / 1000) % 60;
    const mins = Math.floor(ms / 60000) % 60;
    const hours = Math.floor(ms / 3600000) % 24;
    const days = Math.floor(ms / 86400000);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${sign * days}.${pad(hours)}:${pad(mins)}:${pad(secs)}`;
  },
  dayOfMonth: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('dayOfMonth expects 1 argument');
    return parseTimestamp(String(args[0])).getUTCDate();
  },
  dayOfWeek: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('dayOfWeek expects 1 argument');
    return parseTimestamp(String(args[0])).getUTCDay();
  },
  dayOfYear: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('dayOfYear expects 1 argument');
    const d = parseTimestamp(String(args[0]));
    const start = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const ms = d.getTime() - start.getTime();
    return Math.floor(ms / 86400000) + 1;
  },
  startOfHour: (args) => {
    /* c8 ignore next */
    if (args.length < 1) throw new TypeError('startOfHour expects at least 1 argument');
    const d = parseTimestamp(String(args[0]));
    d.setUTCMinutes(0, 0, 0);
    return formatDate(d, args[1] ? String(args[1]) : 'o');
  },
  startOfMonth: (args) => {
    /* c8 ignore next */
    if (args.length < 1) throw new TypeError('startOfMonth expects at least 1 argument');
    const d = parseTimestamp(String(args[0]));
    d.setUTCDate(1);
    d.setUTCHours(0, 0, 0, 0);
    return formatDate(d, args[1] ? String(args[1]) : 'o');
  },
  parseDateTime: (args) => {
    /* c8 ignore next */
    if (args.length < 1) throw new TypeError('parseDateTime expects at least 1 argument');
    const s = String(args[0]);
    const locale = args.length >= 2 ? String(args[1]) : 'en-US';
    const fmt = args.length >= 3 ? String(args[2]) : undefined;
    try {
      if (fmt) {
        const parts = fmt.match(/(d+|M+|y+|H+|m+|s+)/g) || [];
        const map: Record<string, number> = {};
        let i = 0;
        for (const p of parts) {
          if (/^d+$/.test(p)) map.d = i++;
          else if (/^M+$/.test(p)) map.M = i++;
          else if (/^y+$/.test(p)) map.y = i++;
          else if (/^H+$/.test(p)) map.H = i++;
          else if (/^m+$/.test(p)) map.m = i++;
          else if (/^s+$/.test(p)) map.s = i++;
        }
        const tokens = s.split(/[\/\-\s:,.T]+/);
        const d = new Date(2000, 0, 1, 0, 0, 0, 0);
        for (const [key, idx] of Object.entries(map)) {
          const v = parseInt(tokens[idx] || '0', 10);
          if (key === 'd') d.setUTCDate(v);
          else if (key === 'M') d.setUTCMonth(v - 1);
          else if (key === 'y') d.setUTCFullYear(v < 100 ? 2000 + v : v);
          else if (key === 'H') d.setUTCHours(v);
          else if (key === 'm') d.setUTCMinutes(v);
          else if (key === 's') d.setUTCSeconds(v);
        }
        return formatDate(d, 'o');
      }
      const d = new Date(s);
      if (isNaN(d.getTime())) throw new Error('Invalid');
      return formatDate(d, 'o');
    } catch {
      const formatter = new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const parts = formatter.formatToParts(new Date(2000, 0, 1));
      const order = parts.map((p) => String(p.type)).filter((t) => ['day', 'month', 'year'].includes(t));
      const sep = /[\/\-\.\s]+/;
      const tokens = s.split(sep);
      if (tokens.length >= 3) {
        const getIdx = (t: string) => order.indexOf(t);
        const di = getIdx('day');
        const mi = getIdx('month');
        const yi = getIdx('year');
        const d = new Date(
          parseInt(tokens[yi] || '2000', 10),
          parseInt(tokens[mi] || '1', 10) - 1,
          parseInt(tokens[di] || '1', 10),
        );
        return formatDate(d, 'o');
      }
      const d = new Date(s);
      if (isNaN(d.getTime())) throw new TypeError(`Invalid timestamp: ${s}`);
      return formatDate(d, 'o');
    }
  },
  ticks: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('ticks expects 1 argument');
    const d = parseTimestamp(String(args[0]));
    const epochTicks = 621355968000000000n;
    return BigInt(Math.floor(d.getTime())) * 10000n + epochTicks;
  },
  convertFromUtc: (args) => {
    /* c8 ignore next */
    if (args.length < 2) throw new TypeError('convertFromUtc expects at least 2 arguments');
    const d = parseTimestamp(String(args[0]));
    const tz = String(args[1]);
    const opts: Intl.DateTimeFormatOptions = {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const s = new Intl.DateTimeFormat('en-CA', opts).format(d);
    const parts = s.match(/(\d+)/g) || [];
    if (parts.length >= 6) {
      const y = parts[0];
      const m = parts[1];
      const day = parts[2];
      const h = parts[3];
      const min = parts[4];
      const sec = parts[5];
      const out = `${y}-${m}-${day}T${h}:${min}:${sec}.0000000`;
      return args[2] ? formatDate(new Date(`${y}-${m}-${day}T${h}:${min}:${sec}Z`), String(args[2])) : out;
    }
    return formatDate(d, args[2] ? String(args[2]) : 'o');
  },
  convertTimeZone: (args) => {
    /* c8 ignore next */
    if (args.length < 3) throw new TypeError('convertTimeZone expects at least 3 arguments');
    const d = parseTimestamp(String(args[0]));
    const destTz = String(args[2]);
    const opts: Intl.DateTimeFormatOptions = {
      timeZone: destTz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const s = new Intl.DateTimeFormat('en-CA', opts).format(d);
    const parts = s.match(/(\d+)/g) || [];
    if (parts.length >= 6) {
      const out = `${parts[0]}-${parts[1]}-${parts[2]}T${parts[3]}:${parts[4]}:${parts[5]}.0000000`;
      return args[3] ? formatDate(new Date(`${parts[0]}-${parts[1]}-${parts[2]}T${parts[3]}:${parts[4]}:${parts[5]}Z`), String(args[3])) : out;
    }
    return formatDate(d, args[3] ? String(args[3]) : 'o');
  },
  convertToUtc: (args) => {
    /* c8 ignore next */
    if (args.length < 2) throw new TypeError('convertToUtc expects at least 2 arguments');
    const d = parseTimestamp(String(args[0]));
    const srcTz = String(args[1]);
    const opts: Intl.DateTimeFormatOptions = {
      timeZone: srcTz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const s = new Intl.DateTimeFormat('en-CA', opts).format(d);
    const parts = s.match(/(\d+)/g) || [];
    if (parts.length >= 6) {
      const utc = new Date(Date.UTC(
        parseInt(parts[0] ?? '0', 10),
        parseInt(parts[1] ?? '1', 10) - 1,
        parseInt(parts[2] ?? '1', 10),
        parseInt(parts[3] ?? '0', 10),
        parseInt(parts[4] ?? '0', 10),
        parseInt(parts[5] ?? '0', 10),
      ));
      return formatDate(utc, args[2] ? String(args[2]) : 'o');
    }
    return formatDate(d, args[2] ? String(args[2]) : 'o');
  },
};

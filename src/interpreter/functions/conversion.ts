import type { EvaluationContext } from '../context';

function stringToBase64(s: string): string {
  if (typeof Buffer !== 'undefined')
    return Buffer.from(s, 'utf8').toString('base64');
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
function base64ToString(b64: string): string {
  if (typeof Buffer !== 'undefined')
    return Buffer.from(b64, 'base64').toString('utf8');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
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
  base64: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('base64 expects 1 argument');
    return stringToBase64(String(args[0]));
  },
  base64ToString: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('base64ToString expects 1 argument');
    return base64ToString(String(args[0]));
  },
  base64ToBinary: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('base64ToBinary expects 1 argument');
    return base64ToString(String(args[0]));
  },
  binary: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('binary expects 1 argument');
    return stringToBase64(String(args[0]));
  },
  decodeUriComponent: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('decodeUriComponent expects 1 argument');
    return decodeURIComponent(String(args[0]));
  },
  encodeUriComponent: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('encodeUriComponent expects 1 argument');
    return encodeURIComponent(String(args[0]));
  },
  uriComponent: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('uriComponent expects 1 argument');
    return encodeURIComponent(String(args[0]));
  },
  uriComponentToString: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('uriComponentToString expects 1 argument');
    return decodeURIComponent(String(args[0]));
  },
  uriComponentToBinary: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('uriComponentToBinary expects 1 argument');
    return stringToBase64(decodeURIComponent(String(args[0])));
  },
  dataUri: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('dataUri expects 1 argument');
    return 'data:text/plain;charset=utf-8;base64,' + stringToBase64(String(args[0]));
  },
  dataUriToString: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('dataUriToString expects 1 argument');
    const s = String(args[0]);
    const i = s.indexOf(',');
    if (i === -1) throw new TypeError('Invalid data URI');
    return base64ToString(s.slice(i + 1));
  },
  dataUriToBinary: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('dataUriToBinary expects 1 argument');
    const s = String(args[0]);
    const i = s.indexOf(',');
    if (i === -1) throw new TypeError('Invalid data URI');
    return base64ToString(s.slice(i + 1));
  },
  decodeDataUri: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('decodeDataUri expects 1 argument');
    const s = String(args[0]);
    const i = s.indexOf(',');
    if (i === -1) throw new TypeError('Invalid data URI');
    return base64ToString(s.slice(i + 1));
  },
  decimal: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('decimal expects 1 argument');
    const n = parseFloat(String(args[0]).replace(/,/g, ''));
    if (isNaN(n)) throw new TypeError(`Cannot convert '${args[0]}' to decimal`);
    return n;
  },
  uriHost: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('uriHost expects 1 argument');
    return new URL(String(args[0])).hostname;
  },
  uriPath: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('uriPath expects 1 argument');
    return new URL(String(args[0])).pathname;
  },
  uriPathAndQuery: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('uriPathAndQuery expects 1 argument');
    const u = new URL(String(args[0]));
    return u.pathname + (u.search || '');
  },
  uriPort: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('uriPort expects 1 argument');
    const u = new URL(String(args[0]));
    const p = u.port;
    return p ? parseInt(p, 10) : (u.protocol === 'https:' ? 443 : 80);
  },
  uriQuery: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('uriQuery expects 1 argument');
    return new URL(String(args[0])).search || '';
  },
  uriScheme: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('uriScheme expects 1 argument');
    return new URL(String(args[0])).protocol.replace(':', '');
  },
};

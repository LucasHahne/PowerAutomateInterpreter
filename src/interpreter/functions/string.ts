import type { EvaluationContext } from "../context";

function ensureString(val: unknown): string {
  if (typeof val === "string") return val;
  if (val === null || val === undefined) return "";
  return String(val);
}

const LOCALE_CURRENCY: Record<string, string> = {
  "en-US": "USD",
  "en-GB": "GBP",
  "is-IS": "ISK",
  "de-DE": "EUR",
  "de-AT": "EUR",
  "fr-FR": "EUR",
  "es-ES": "EUR",
  "it-IT": "EUR",
  "ja-JP": "JPY",
  "zh-CN": "CNY",
  "pt-BR": "BRL",
  "en-AU": "AUD",
  "en-CA": "CAD",
  "sv-SE": "SEK",
  "nb-NO": "NOK",
  "da-DK": "DKK",
  "nl-NL": "EUR",
  "pl-PL": "PLN",
  "tr-TR": "TRY",
  "ru-RU": "RUB",
  "ko-KR": "KRW",
  "hi-IN": "INR",
};

function localeToCurrency(locale: string): string {
  return LOCALE_CURRENCY[locale] ?? "USD";
}

export const stringFunctions: Record<
  string,
  (args: unknown[], ctx: EvaluationContext) => unknown
> = {
  concat: (args) => {
    /* c8 ignore next */
    if (args.length < 2)
      throw new TypeError("concat expects at least 2 arguments");
    return args.map(ensureString).join("");
  },
  toLower: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError("toLower expects 1 argument");
    return ensureString(args[0]).toLowerCase();
  },
  toUpper: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError("toUpper expects 1 argument");
    return ensureString(args[0]).toUpperCase();
  },
  length: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError("length expects 1 argument");
    const v = args[0];
    if (typeof v === "string") return v.length;
    if (Array.isArray(v)) return v.length;
    /* c8 ignore next */
    throw new TypeError("length expects string or array");
  },
  indexOf: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError("indexOf expects 2 arguments");
    const text = ensureString(args[0]);
    const search = ensureString(args[1]);
    if (text === "" && search === "") return 0;
    if (text === "") return -1;
    if (search === "") return 0;
    return text.toLowerCase().indexOf(search.toLowerCase());
  },
  slice: (args) => {
    /* c8 ignore next */
    if (args.length < 2 || args.length > 3)
      throw new TypeError("slice expects 2 or 3 arguments");
    const s = ensureString(args[0]);
    const start = Number(args[1]);
    if (!Number.isInteger(start))
      throw new TypeError("slice startIndex must be integer");
    if (args.length === 3) {
      const end = Number(args[2]);
      if (!Number.isInteger(end))
        throw new TypeError("slice endIndex must be integer");
      return s.slice(start, end);
    }
    return s.slice(start);
  },
  substring: (args) => {
    /* c8 ignore next */
    if (args.length < 2 || args.length > 3)
      throw new TypeError("substring expects 2 or 3 arguments");
    const s = ensureString(args[0]);
    const start = Number(args[1]);
    /* c8 ignore next */
    if (isNaN(start) || start < 0)
      throw new TypeError("substring startIndex must be non-negative integer");
    if (args.length === 3) {
      const len = Number(args[2]);
      /* c8 ignore next */
      if (isNaN(len) || len < 0)
        throw new TypeError("substring length must be non-negative integer");
      return s.substring(start, start + len);
    }
    return s.substring(start);
  },
  split: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError("split expects 2 arguments");
    const s = ensureString(args[0]);
    const delim = ensureString(args[1]);
    return s.split(delim);
  },
  replace: (args) => {
    /* c8 ignore next */
    if (args.length !== 3) throw new TypeError("replace expects 3 arguments");
    const s = ensureString(args[0]);
    const old = ensureString(args[1]);
    const repl = ensureString(args[2]);
    return s.split(old).join(repl);
  },
  trim: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError("trim expects 1 argument");
    return ensureString(args[0]).trim();
  },
  startsWith: (args) => {
    /* c8 ignore next */
    if (args.length !== 2)
      throw new TypeError("startsWith expects 2 arguments");
    return ensureString(args[0])
      .toLowerCase()
      .startsWith(ensureString(args[1]).toLowerCase());
  },
  endsWith: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError("endsWith expects 2 arguments");
    return ensureString(args[0])
      .toLowerCase()
      .endsWith(ensureString(args[1]).toLowerCase());
  },
  formatNumber: (args) => {
    /* c8 ignore next */
    if (args.length < 2) throw new TypeError("formatNumber expects at least 2 arguments");
    const num = Number(args[0]);
    if (isNaN(num)) throw new TypeError("formatNumber first arg must be a number");
    const fmt = String(args[1]);
    const locale = args.length >= 3 ? String(args[2]) : "en-US";
    if (fmt.startsWith("C") || fmt.startsWith("c")) {
      const decimals = fmt.length > 1 ? parseInt(fmt.slice(1), 10) : 2;
      const d = isNaN(decimals) ? 2 : decimals;
      const currency = localeToCurrency(locale);
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: d,
        maximumFractionDigits: d,
      }).format(num);
    }
    const hasGrouping = fmt.includes(",");
    const decMatch = fmt.match(/\.([0#]+)/);
    const decLen = decMatch ? decMatch[1].length : 0;
    return new Intl.NumberFormat(locale, {
      useGrouping: hasGrouping,
      minimumFractionDigits: decLen,
      maximumFractionDigits: decLen,
    }).format(num);
  },
  isFloat: (args) => {
    /* c8 ignore next */
    if (args.length < 1) throw new TypeError("isFloat expects at least 1 argument");
    const s = String(args[0]).trim();
    if (s === "") return false;
    const locale = args.length >= 2 ? String(args[1]) : "en-US";
    try {
      const n = new Intl.NumberFormat(locale).formatToParts(0);
      const sep = n.find((p) => p.type === "decimal")?.value ?? ".";
      const grp = n.find((p) => p.type === "group")?.value ?? ",";
      const normalized = s
        .replace(new RegExp(`[${grp.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]`, "g"), "")
        .replace(sep, ".");
      return !isNaN(parseFloat(normalized)) && isFinite(Number(normalized));
    } catch {
      return false;
    }
  },
  isInt: (args) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError("isInt expects 1 argument");
    const s = String(args[0]).trim();
    return /^-?\d+$/.test(s);
  },
  lastIndexOf: (args) => {
    /* c8 ignore next */
    if (args.length !== 2) throw new TypeError("lastIndexOf expects 2 arguments");
    const text = ensureString(args[0]);
    const search = ensureString(args[1]);
    if (text === "" && search === "") return 0;
    if (text === "") return -1;
    if (search === "") return text.length - 1;
    return text.toLowerCase().lastIndexOf(search.toLowerCase());
  },
  nthIndexOf: (args) => {
    /* c8 ignore next */
    if (args.length !== 3) throw new TypeError("nthIndexOf expects 3 arguments");
    const text = ensureString(args[0]);
    const search = ensureString(args[1]);
    const occ = Number(args[2]);
    if (!Number.isInteger(occ)) throw new TypeError("nthIndexOf occurrence must be integer");
    if (search === "" || occ === 0) return -1;
    const lowerText = text.toLowerCase();
    const lowerSearch = search.toLowerCase();
    if (occ > 0) {
      let pos = -1;
      for (let i = 0; i < occ; i++) {
        pos = lowerText.indexOf(lowerSearch, pos + 1);
        if (pos === -1) return -1;
      }
      return pos;
    }
    let pos = lowerText.length;
    for (let i = 0; i < -occ; i++) {
      pos = lowerText.lastIndexOf(lowerSearch, pos - 1);
      if (pos === -1) return -1;
    }
    return pos;
  },
  guid: (args) => {
    if (args.length !== 0) throw new TypeError("guid expects 0 arguments");
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
};

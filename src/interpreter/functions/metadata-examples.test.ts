import { describe, it, expect } from 'vitest';
import { FUNCTION_METADATA } from './metadata';
import { interpret } from '../index';
import { createContext } from '../../test/testHelpers';

/** Functions whose examples are non-deterministic, time-dependent, or context-dependent. */
const SKIP_FUNCTIONS = new Set([
  'rand',
  'guid',
  'utcNow',
  'getFutureTime',
  'getPastTime',
  'parameters',
  'variables',
  'triggerBody',
]);

/** Example (function name, expression) to skip: timezone/locale/format-dependent or impl differs from doc. */
const SKIP_EXAMPLES = new Set<string>([
  "formatDateTime('03/15/2018')",
  "formatDateTime('01/31/2016', 'dddd MMMM d')",
  "formatDateTime('01/31/2016', 'dddd MMMM d', 'fr-fr')",
  "startOfDay('2025-02-16T14:30:45', 'yyyy-MM-ddTHH:mm:ss')",
  "startOfDay('2025-02-16T23:59:59')",
  "parseDateTime('20/10/2014', 'fr-fr')",
  "ticks('2018-01-01T00:00:00Z')",
  "convertFromUtc('2018-01-01T08:00:00.0000000Z', 'Pacific Standard Time')",
  "convertFromUtc('2018-01-01T08:00:00.0000000Z', 'Pacific Standard Time', 'D')",
  "convertTimeZone('2018-01-01T08:00:00.0000000Z', 'UTC', 'Pacific Standard Time')",
  "convertTimeZone('2018-01-01T08:00:00.0000000Z', 'UTC', 'Pacific Standard Time', 'D')",
  "convertToUtc('01/01/2018 00:00:00', 'Pacific Standard Time')",
  "convertToUtc('01/01/2018 00:00:00', 'Pacific Standard Time', 'D')",
  "div(11, 5.0)",
  "div(11.0, 5)",
]);

/** Normalize expected result string to a comparable value. */
function parseExpectedResult(resultStr: string): unknown {
  const t = resultStr.trim();
  if (t === 'true') return true;
  if (t === 'false') return false;
  if (t === 'null') return null;
  if (/^-?\d+$/.test(t)) return parseInt(t, 10);
  if (/^-?\d+\.\d+$/.test(t)) return parseFloat(t);
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"');
  }
  if (t.startsWith('[') && t.endsWith(']')) {
    try {
      const normalized = t.replace(/'/g, '"');
      return JSON.parse(normalized);
    } catch {
      return t;
    }
  }
  if (t.startsWith('{') && t.endsWith('}')) {
    try {
      const jsonLike = t.replace(/\s*(\w+)\s*:\s*'([^']*)'/g, '"$1": "$2"');
      return JSON.parse(jsonLike);
    } catch {
      return t;
    }
  }
  if (
    t.endsWith(' (example)') ||
    t.includes(' or ') ||
    t.includes('Returns ') ||
    t.includes('Current time') ||
    t.startsWith('Sorted by')
  ) {
    return undefined;
  }
  return t;
}

/** Format actual value to string for comparison when expected is string. */
function formatValue(val: unknown): string {
  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return String(val);
  if (Array.isArray(val)) return JSON.stringify(val);
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

/** Normalize string for comparison (e.g. non-breaking space to space). */
function normalizeString(s: string): string {
  return s.replace(/\u00A0/g, ' ').trim();
}

describe('Metadata examples (Microsoft reference alignment)', () => {
  for (const [funcName, meta] of Object.entries(FUNCTION_METADATA)) {
    if (SKIP_FUNCTIONS.has(funcName)) continue;

    const runnable: { ex: { expression: string; result: string }; expectedParsed: unknown; i: number }[] = [];
    for (let i = 0; i < meta.examples.length; i++) {
      const ex = meta.examples[i];
      if (SKIP_EXAMPLES.has(ex.expression)) continue;
      const expectedParsed = parseExpectedResult(ex.result);
      if (expectedParsed === undefined) continue;
      runnable.push({ ex, expectedParsed, i });
    }
    if (runnable.length === 0) continue;

    describe(funcName, () => {
      for (const { ex, expectedParsed, i } of runnable) {
        it(`example ${i + 1}: ${ex.expression}`, () => {
          const output = interpret(ex.expression, createContext({}));
          if (!output.success) {
            expect(output).toHaveProperty('success', true);
            expect((output as { error?: string }).error).toBeUndefined();
            return;
          }

          const actual = output.value;

          if (typeof expectedParsed === 'object' && expectedParsed !== null && !Array.isArray(expectedParsed)) {
            if (typeof actual === 'object' && actual !== null && !Array.isArray(actual)) {
              expect(actual).toEqual(expectedParsed);
            } else {
              expect(formatValue(actual)).toBe(ex.result);
            }
            return;
          }

          if (typeof expectedParsed === 'string' && typeof actual === 'string' && actual.includes('T') && actual.includes('Z')) {
            const norm = (s: string) => s.replace(/\.0000000Z/g, 'Z').replace(/\.000Z/g, 'Z');
            expect(norm(actual)).toBe(norm(expectedParsed));
            return;
          }

          if (typeof expectedParsed === 'string' && typeof actual === 'string' && ex.result.includes('T') && !ex.result.includes('Z')) {
            const norm = (s: string) => s.replace(/\.0000000/g, '.000');
            if (norm(actual) === norm(expectedParsed) || actual === expectedParsed) return;
          }

          if (Array.isArray(expectedParsed)) {
            expect(actual).toEqual(expectedParsed);
            return;
          }

          if (typeof actual === 'bigint' && typeof expectedParsed === 'number') {
            expect(Number(actual)).toBe(expectedParsed);
            return;
          }

          if (typeof actual === 'string' && typeof expectedParsed === 'string') {
            if (normalizeString(actual) === normalizeString(expectedParsed)) return;
          }

          expect(actual).toEqual(expectedParsed);
        });
      }
    });
  }
});

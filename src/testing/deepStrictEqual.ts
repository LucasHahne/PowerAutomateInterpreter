export interface DeepStrictEqualResult {
  equal: boolean;
  /** Path to first difference (e.g. $.foo[0].bar) when not equal */
  diffPath?: string;
  expectedAtPath?: unknown;
  actualAtPath?: unknown;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function formatPathSegment(seg: string | number): string {
  return typeof seg === "number"
    ? `[${seg}]`
    : /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(seg)
      ? `.${seg}`
      : `[${JSON.stringify(seg)}]`;
}

export function deepStrictEqual(
  expected: unknown,
  actual: unknown,
): DeepStrictEqualResult {
  const seen = new WeakMap<object, WeakSet<object>>();

  const walk = (
    exp: unknown,
    act: unknown,
    path: Array<string | number>,
  ): DeepStrictEqualResult => {
    if (Object.is(exp, act)) return { equal: true };

    if (typeof exp !== typeof act) {
      return {
        equal: false,
        diffPath: "$" + path.map(formatPathSegment).join(""),
        expectedAtPath: exp,
        actualAtPath: act,
      };
    }

    if (exp === null || act === null) {
      return {
        equal: false,
        diffPath: "$" + path.map(formatPathSegment).join(""),
        expectedAtPath: exp,
        actualAtPath: act,
      };
    }

    if (Array.isArray(exp) || Array.isArray(act)) {
      if (!Array.isArray(exp) || !Array.isArray(act)) {
        return {
          equal: false,
          diffPath: "$" + path.map(formatPathSegment).join(""),
          expectedAtPath: exp,
          actualAtPath: act,
        };
      }
      if (exp.length !== act.length) {
        return {
          equal: false,
          diffPath: "$" + path.map(formatPathSegment).join("") + ".length",
          expectedAtPath: exp.length,
          actualAtPath: act.length,
        };
      }
      for (let i = 0; i < exp.length; i++) {
        const r = walk(exp[i], act[i], [...path, i]);
        if (!r.equal) return r;
      }
      return { equal: true };
    }

    if (typeof exp === "object" && typeof act === "object") {
      const expObj = exp as object;
      const actObj = act as object;

      if (!isPlainObject(exp) || !isPlainObject(act)) {
        return {
          equal: false,
          diffPath: "$" + path.map(formatPathSegment).join(""),
          expectedAtPath: exp,
          actualAtPath: act,
        };
      }

      const prior = seen.get(expObj);
      if (prior?.has(actObj)) return { equal: true };
      if (prior) prior.add(actObj);
      else seen.set(expObj, new WeakSet<object>([actObj]));

      const expKeys = Object.keys(exp);
      const actKeys = Object.keys(act);
      expKeys.sort();
      actKeys.sort();
      if (expKeys.length !== actKeys.length) {
        return {
          equal: false,
          diffPath: "$" + path.map(formatPathSegment).join("") + " (keys)",
          expectedAtPath: expKeys,
          actualAtPath: actKeys,
        };
      }
      for (let i = 0; i < expKeys.length; i++) {
        if (expKeys[i] !== actKeys[i]) {
          return {
            equal: false,
            diffPath: "$" + path.map(formatPathSegment).join("") + " (keys)",
            expectedAtPath: expKeys,
            actualAtPath: actKeys,
          };
        }
      }
      for (const k of expKeys) {
        const r = walk((exp as Record<string, unknown>)[k], (act as Record<string, unknown>)[k], [
          ...path,
          k,
        ]);
        if (!r.equal) return r;
      }
      return { equal: true };
    }

    return {
      equal: false,
      diffPath: "$" + path.map(formatPathSegment).join(""),
      expectedAtPath: exp,
      actualAtPath: act,
    };
  };

  return walk(expected, actual, []);
}


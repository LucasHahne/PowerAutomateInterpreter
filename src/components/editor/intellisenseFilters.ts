import { getAllFunctionNames } from "../../interpreter/functions/metadata";

export function filterFunctions(prefix: string, maxItems: number): string[] {
  const all = getAllFunctionNames();
  const sorted = [...all].sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase()),
  );
  const lower = prefix.toLowerCase();
  const filtered = lower
    ? sorted.filter((name) => name.toLowerCase().startsWith(lower))
    : sorted;
  return (lower ? filtered : sorted).slice(0, maxItems);
}

export function filterStringLiteralNames(
  all: string[],
  prefix: string,
  maxItems: number,
): string[] {
  const sorted = [...all].sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase()),
  );
  const lower = prefix.toLowerCase();
  const filtered = lower
    ? sorted.filter((name) => name.toLowerCase().startsWith(lower))
    : sorted;
  return filtered.slice(0, maxItems);
}


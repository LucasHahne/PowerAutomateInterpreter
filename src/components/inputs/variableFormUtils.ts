import type { InputType } from '../../interpreter/context';

export function parseValue(valueStr: string, type: InputType): unknown {
  const trimmed = valueStr.trim();
  if (type === 'string') return trimmed;
  if (type === 'integer') {
    const n = parseInt(trimmed, 10);
    if (isNaN(n)) return 0;
    return n;
  }
  if (type === 'float') {
    const n = parseFloat(trimmed);
    if (isNaN(n)) return 0;
    return n;
  }
  if (type === 'boolean') return trimmed === 'true';
  if (type === 'object' || type === 'array') {
    if (!trimmed) return type === 'object' ? {} : [];
    try {
      const parsed = JSON.parse(trimmed);
      return type === 'array' && !Array.isArray(parsed) ? [parsed] : parsed;
    } catch {
      try {
        const withDoubleQuotes = trimmed.replace(/'/g, '"');
        const parsed = JSON.parse(withDoubleQuotes);
        return type === 'array' && !Array.isArray(parsed) ? [parsed] : parsed;
      } catch {
        return type === 'object' ? {} : [];
      }
    }
  }
  return trimmed;
}

export function valueToString(val: unknown, type: InputType): string {
  if (val === undefined || val === null) return '';
  if (type === 'object' || type === 'array') {
    return typeof val === 'string' ? val : JSON.stringify(val, null, 2);
  }
  return String(val);
}

export function validateValue(valueStr: string, type: InputType): boolean {
  const trimmed = valueStr.trim();
  switch (type) {
    case 'string':
      return true;
    case 'integer':
      return /^-?\d+$/.test(trimmed);
    case 'float':
      return trimmed !== '' && !isNaN(parseFloat(trimmed)) && isFinite(Number(trimmed));
    case 'boolean':
      return trimmed === 'true' || trimmed === 'false';
    case 'object': {
      if (trimmed === '') return true;
      try {
        const parsed = JSON.parse(trimmed);
        return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
      } catch {
        return false;
      }
    }
    case 'array': {
      if (trimmed === '') return true;
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed);
      } catch {
        return false;
      }
    }
    default:
      return false;
  }
}

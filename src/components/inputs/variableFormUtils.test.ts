import { describe, it, expect } from 'vitest';
import { parseValue, valueToString, validateValue } from './variableFormUtils';

describe('variableFormUtils', () => {
  describe('parseValue', () => {
    it('parses string', () => {
      expect(parseValue('hello', 'string')).toBe('hello');
      expect(parseValue('  trim  ', 'string')).toBe('trim'); // parseValue trims
    });

    it('parses integer', () => {
      expect(parseValue('42', 'integer')).toBe(42);
      expect(parseValue('-10', 'integer')).toBe(-10);
      expect(parseValue('abc', 'integer')).toBe(0);
    });

    it('parses float', () => {
      expect(parseValue('3.14', 'float')).toBe(3.14);
      expect(parseValue('invalid', 'float')).toBe(0);
    });

    it('parses boolean', () => {
      expect(parseValue('true', 'boolean')).toBe(true);
      expect(parseValue('false', 'boolean')).toBe(false);
    });

    it('parses object', () => {
      expect(parseValue('{"a":1}', 'object')).toEqual({ a: 1 });
      expect(parseValue('', 'object')).toEqual({});
      expect(parseValue("{'a':1}", 'object')).toEqual({ a: 1 });
    });

    it('parses array', () => {
      expect(parseValue('[1,2,3]', 'array')).toEqual([1, 2, 3]);
      expect(parseValue('', 'array')).toEqual([]);
    });
  });

  describe('valueToString', () => {
    it('formats string', () => {
      expect(valueToString('hello', 'string')).toBe('hello');
    });

    it('formats null/undefined as empty', () => {
      expect(valueToString(null, 'string')).toBe('');
      expect(valueToString(undefined, 'string')).toBe('');
    });

    it('formats object as JSON', () => {
      expect(valueToString({ a: 1 }, 'object')).toContain('"a"');
    });
  });

  describe('validateValue', () => {
    it('accepts any string for string type', () => {
      expect(validateValue('anything', 'string')).toBe(true);
    });

    it('validates integer', () => {
      expect(validateValue('42', 'integer')).toBe(true);
      expect(validateValue('-5', 'integer')).toBe(true);
      expect(validateValue('3.14', 'integer')).toBe(false);
      expect(validateValue('abc', 'integer')).toBe(false);
    });

    it('validates float', () => {
      expect(validateValue('3.14', 'float')).toBe(true);
      expect(validateValue('1e5', 'float')).toBe(true);
      expect(validateValue('', 'float')).toBe(false);
    });

    it('validates boolean', () => {
      expect(validateValue('true', 'boolean')).toBe(true);
      expect(validateValue('false', 'boolean')).toBe(true);
      expect(validateValue('yes', 'boolean')).toBe(false);
    });

    it('validates object', () => {
      expect(validateValue('{}', 'object')).toBe(true);
      expect(validateValue('{"a":1}', 'object')).toBe(true);
      expect(validateValue('[1,2]', 'object')).toBe(false);
    });

    it('validates array', () => {
      expect(validateValue('[]', 'array')).toBe(true);
      expect(validateValue('[1,2,3]', 'array')).toBe(true);
      expect(validateValue('{}', 'array')).toBe(false);
    });

    it('validates empty string for object/array', () => {
      expect(validateValue('', 'object')).toBe(true);
      expect(validateValue('', 'array')).toBe(true);
    });
  });
});

import { describe, it, expect } from 'vitest';
import {
  createEmptyContext,
  getParameter,
  getVariable,
  hasParameter,
  hasVariable,
} from './context';

describe('Context', () => {
  describe('createEmptyContext', () => {
    it('returns empty parameters and variables', () => {
      const ctx = createEmptyContext();
      expect(ctx.parameters).toEqual({});
      expect(ctx.variables).toEqual({});
    });
  });

  describe('getParameter', () => {
    it('returns parameter value', () => {
      const ctx = createEmptyContext();
      ctx.parameters['x'] = { value: 'hello', type: 'string' };
      expect(getParameter(ctx, 'x')).toBe('hello');
    });

    it('returns undefined for missing parameter', () => {
      const ctx = createEmptyContext();
      expect(getParameter(ctx, 'missing')).toBeUndefined();
    });

    it('parses object from JSON string', () => {
      const ctx = createEmptyContext();
      ctx.parameters['obj'] = { value: '{"a":1}', type: 'object' };
      expect(getParameter(ctx, 'obj')).toEqual({ a: 1 });
    });

    it('parses array from JSON string', () => {
      const ctx = createEmptyContext();
      ctx.parameters['arr'] = { value: '[1,2,3]', type: 'array' };
      expect(getParameter(ctx, 'arr')).toEqual([1, 2, 3]);
    });

    it('parses object with single quotes (fallback)', () => {
      const ctx = createEmptyContext();
      ctx.parameters['obj'] = { value: "{'a':1}", type: 'object' };
      expect(getParameter(ctx, 'obj')).toEqual({ a: 1 });
    });

    it('returns non-string value as-is for object type', () => {
      const ctx = createEmptyContext();
      ctx.parameters['obj'] = { value: { a: 1 }, type: 'object' };
      expect(getParameter(ctx, 'obj')).toEqual({ a: 1 });
    });
  });

  describe('getVariable', () => {
    it('returns variable value', () => {
      const ctx = createEmptyContext();
      ctx.variables['v'] = { value: 42, type: 'integer' };
      expect(getVariable(ctx, 'v')).toBe(42);
    });

    it('returns undefined for missing variable', () => {
      const ctx = createEmptyContext();
      expect(getVariable(ctx, 'missing')).toBeUndefined();
    });
  });

  describe('hasParameter', () => {
    it('returns true when parameter exists', () => {
      const ctx = createEmptyContext();
      ctx.parameters['p'] = { value: 1, type: 'integer' };
      expect(hasParameter(ctx, 'p')).toBe(true);
    });

    it('returns false when parameter missing', () => {
      const ctx = createEmptyContext();
      expect(hasParameter(ctx, 'p')).toBe(false);
    });
  });

  describe('hasVariable', () => {
    it('returns true when variable exists', () => {
      const ctx = createEmptyContext();
      ctx.variables['v'] = { value: 1, type: 'integer' };
      expect(hasVariable(ctx, 'v')).toBe(true);
    });

    it('returns false when variable missing', () => {
      const ctx = createEmptyContext();
      expect(hasVariable(ctx, 'v')).toBe(false);
    });
  });
});

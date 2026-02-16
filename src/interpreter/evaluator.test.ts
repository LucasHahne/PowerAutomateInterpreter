import { describe, it, expect } from 'vitest';
import { evaluate, EvaluationError } from './evaluator';
import { parseExpression } from './parser/parser';
import { createContext } from '../test/testHelpers';

describe('Evaluator', () => {
  describe('literal', () => {
    it('returns string value', () => {
      const ast = parseExpression("'hello'");
      expect(evaluate(ast, createContext({}))).toBe('hello');
    });

    it('returns number value', () => {
      const ast = parseExpression('42');
      expect(evaluate(ast, createContext({}))).toBe(42);
    });

    it('returns boolean value', () => {
      const ast = parseExpression('true');
      expect(evaluate(ast, createContext({}))).toBe(true);
    });

    it('returns null', () => {
      const ast = parseExpression('null');
      expect(evaluate(ast, createContext({}))).toBe(null);
    });
  });

  describe('parametersCall', () => {
    it('returns parameter value', () => {
      const ast = parseExpression("parameters('x')");
      const ctx = createContext({ parameters: { x: 'value' } });
      expect(evaluate(ast, ctx)).toBe('value');
    });

    it('throws when parameter missing', () => {
      const ast = parseExpression("parameters('missing')");
      expect(() => evaluate(ast, createContext({}))).toThrow(EvaluationError);
      expect(() => evaluate(ast, createContext({}))).toThrow(/not defined/);
    });
  });

  describe('variablesCall', () => {
    it('returns variable value', () => {
      const ast = parseExpression("variables('arr')");
      const ctx = createContext({ variables: { arr: [1, 2, 3] } });
      expect(evaluate(ast, ctx)).toEqual([1, 2, 3]);
    });

    it('throws when variable missing', () => {
      const ast = parseExpression("variables('missing')");
      expect(() => evaluate(ast, createContext({}))).toThrow(EvaluationError);
    });
  });

  describe('functionCall', () => {
    it('evaluates add', () => {
      const ast = parseExpression('add(1, 2)');
      expect(evaluate(ast, createContext({}))).toBe(3);
    });

    it('throws on unknown function', () => {
      const ast = parseExpression('unknownFunc(1)');
      expect(() => evaluate(ast, createContext({}))).toThrow(EvaluationError);
      expect(() => evaluate(ast, createContext({}))).toThrow(/Unknown function/);
    });
  });

  describe('selection - array indexing', () => {
    it('indexes array with number literal', () => {
      const ast = parseExpression('createArray(1, 2, 3)[0]');
      expect(evaluate(ast, createContext({}))).toBe(1);
    });

    it('indexes array with last element', () => {
      const ast = parseExpression('createArray(1, 2, 3)[2]');
      expect(evaluate(ast, createContext({}))).toBe(3);
    });

    it('indexes array with expression', () => {
      const ast = parseExpression('createArray(1, 2, 3)[add(0, 1)]');
      expect(evaluate(ast, createContext({}))).toBe(2);
    });

    it('indexes variable array', () => {
      const ast = parseExpression("variables('arr')[0]");
      const ctx = createContext({ variables: { arr: ['a', 'b', 'c'] } });
      expect(evaluate(ast, ctx)).toBe('a');
    });

    it('indexes variable array with variable index', () => {
      const ast = parseExpression("variables('arr')[variables('i')]");
      const ctx = createContext({ variables: { arr: [10, 20, 30], i: 1 } });
      expect(evaluate(ast, ctx)).toBe(20);
    });
  });

  describe('selection - object property access', () => {
    it('accesses object property with string key', () => {
      const ast = parseExpression("json('{\"a\":1}')['a']");
      expect(evaluate(ast, createContext({}))).toBe(1);
    });

    it('accesses nested object', () => {
      const ast = parseExpression("json('{\"x\":{\"y\":42}}')['x']['y']");
      expect(evaluate(ast, createContext({}))).toBe(42);
    });

    it('accesses mixed array and object', () => {
      const ast = parseExpression("json('{\"a\":[1,2,3]}')['a'][1]");
      expect(evaluate(ast, createContext({}))).toBe(2);
    });

    it('returns undefined for missing key', () => {
      const ast = parseExpression("json('{\"a\":1}')['b']");
      expect(evaluate(ast, createContext({}))).toBeUndefined();
    });
  });

  describe('optional selection', () => {
    it('returns undefined when base is null', () => {
      const ast = parseExpression("variables('x')?[0]");
      const ctx = createContext({ variables: { x: null } });
      expect(evaluate(ast, ctx)).toBeUndefined();
    });

    it('returns undefined when base is undefined', () => {
      const ast = parseExpression("variables('x')?[0]");
      const ctx = createContext({ variables: { x: undefined } });
      expect(evaluate(ast, ctx)).toBeUndefined();
    });

    it('evaluates normally when base has value', () => {
      const ast = parseExpression("variables('arr')?[0]");
      const ctx = createContext({ variables: { arr: [1, 2, 3] } });
      expect(evaluate(ast, ctx)).toBe(1);
    });

    it('short-circuits on first optional step', () => {
      const ast = parseExpression("variables('x')?[0][1]");
      const ctx = createContext({ variables: { x: null } });
      expect(evaluate(ast, ctx)).toBeUndefined();
    });
  });

  describe('selection errors', () => {
    it('throws when indexing non-indexable value', () => {
      const ast = parseExpression("'hello'[0]");
      expect(() => evaluate(ast, createContext({}))).toThrow(EvaluationError);
      expect(() => evaluate(ast, createContext({}))).toThrow(/Cannot index/);
    });

    it('throws when indexing number', () => {
      const ast = parseExpression('1[0]');
      expect(() => evaluate(ast, createContext({}))).toThrow(/Cannot index/);
    });
  });

  describe('unknown node type', () => {
    it('throws for unknown node type', () => {
      const ast = { type: 'unknown' as const, value: 1 };
      expect(() => evaluate(ast as never, createContext({}))).toThrow(/Unknown node type/);
    });
  });
});

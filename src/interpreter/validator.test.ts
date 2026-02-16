import { describe, it, expect } from 'vitest';
import { validateArity } from './validator';
import { parseExpression } from './parser/parser';
import { EvaluationError } from './evaluator';

describe('Validator', () => {
  describe('passthrough nodes', () => {
    it('accepts literal', () => {
      const ast = parseExpression("'x'");
      expect(() => validateArity(ast)).not.toThrow();
    });

    it('accepts parametersCall', () => {
      const ast = parseExpression("parameters('x')");
      expect(() => validateArity(ast)).not.toThrow();
    });

    it('accepts variablesCall', () => {
      const ast = parseExpression("variables('x')");
      expect(() => validateArity(ast)).not.toThrow();
    });

    it('accepts selection', () => {
      const ast = parseExpression("createArray(1,2)[0]");
      expect(() => validateArity(ast)).not.toThrow();
    });
  });

  describe('arity validation', () => {
    it('accepts correct arity for add', () => {
      const ast = parseExpression('add(1, 2)');
      expect(() => validateArity(ast)).not.toThrow();
    });

    it('rejects too few args for add', () => {
      const ast = parseExpression('add(1)');
      expect(() => validateArity(ast)).toThrow(EvaluationError);
      expect(() => validateArity(ast)).toThrow(/expects.*2.*argument/);
    });

    it('rejects too many args for add', () => {
      const ast = parseExpression('add(1, 2, 3)');
      expect(() => validateArity(ast)).toThrow(EvaluationError);
    });

    it('accepts variadic concat with 2 args', () => {
      const ast = parseExpression("concat('a', 'b')");
      expect(() => validateArity(ast)).not.toThrow();
    });

    it('accepts variadic concat with many args', () => {
      const ast = parseExpression("concat('a', 'b', 'c', 'd')");
      expect(() => validateArity(ast)).not.toThrow();
    });

    it('rejects concat with 1 arg', () => {
      const ast = parseExpression("concat('a')");
      expect(() => validateArity(ast)).toThrow(EvaluationError);
    });

    it('accepts utcNow with no args', () => {
      const ast = parseExpression('utcNow()');
      expect(() => validateArity(ast)).not.toThrow();
    });
  });

  describe('nested calls', () => {
    it('reports innermost arity error', () => {
      const ast = parseExpression('add(add(1), 3)');
      expect(() => validateArity(ast)).toThrow(/add.*expects.*2/);
    });
  });

  describe('unknown node type', () => {
    it('throws for unknown node type', () => {
      const ast = { type: 'unknown' as const };
      expect(() => validateArity(ast as never)).toThrow(/Unknown node type/);
    });
  });
});

import { describe, it, expect } from 'vitest';
import { parseExpression, ParseError } from './parser';

describe('Parser', () => {
  describe('literals', () => {
    it('parses string literal', () => {
      const ast = parseExpression("'hello'");
      expect(ast).toMatchObject({ type: 'literal', value: 'hello' });
    });

    it('parses number literal', () => {
      const ast = parseExpression('42');
      expect(ast).toMatchObject({ type: 'literal', value: 42 });
    });

    it('parses boolean true', () => {
      const ast = parseExpression('true');
      expect(ast).toMatchObject({ type: 'literal', value: true });
    });

    it('parses boolean false', () => {
      const ast = parseExpression('false');
      expect(ast).toMatchObject({ type: 'literal', value: false });
    });

    it('parses null', () => {
      const ast = parseExpression('null');
      expect(ast).toMatchObject({ type: 'literal', value: null });
    });
  });

  describe('function calls', () => {
    it('parses simple function call', () => {
      const ast = parseExpression('add(1, 2)');
      expect(ast).toMatchObject({ type: 'functionCall', name: 'add', args: expect.any(Array) });
      expect((ast as { args: unknown[] }).args).toHaveLength(2);
    });

    it('parses nested function calls', () => {
      const ast = parseExpression('add(add(1, 2), 3)');
      expect(ast.type).toBe('functionCall');
      const inner = (ast as { args: unknown[] }).args[0];
      expect(inner).toMatchObject({ type: 'functionCall', name: 'add' });
    });

    it('parses function with no args', () => {
      const ast = parseExpression('utcNow()');
      expect(ast).toMatchObject({ type: 'functionCall', name: 'utcNow', args: [] });
    });

    it('parses variadic function', () => {
      const ast = parseExpression("concat('a', 'b', 'c')");
      expect((ast as { args: unknown[] }).args).toHaveLength(3);
    });
  });

  describe('parameters and variables', () => {
    it('parses parameters() as ParametersCallNode', () => {
      const ast = parseExpression("parameters('firstName')");
      expect(ast).toMatchObject({ type: 'parametersCall', paramName: 'firstName' });
    });

    it('parses variables() as VariablesCallNode', () => {
      const ast = parseExpression("variables('counter')");
      expect(ast).toMatchObject({ type: 'variablesCall', varName: 'counter' });
    });

    it('rejects parameters with non-string literal', () => {
      expect(() => parseExpression('parameters(123)')).toThrow(ParseError);
      expect(() => parseExpression('parameters(123)')).toThrow(/string literal/);
    });

    it('rejects parameters with variable as arg', () => {
      expect(() => parseExpression("parameters(variables('x'))")).toThrow(/string literal/);
    });

    it('rejects variables with non-string literal', () => {
      expect(() => parseExpression('variables(true)')).toThrow(/string literal/);
    });

    it('rejects parameters with wrong arity', () => {
      expect(() => parseExpression("parameters('a', 'b')")).toThrow(/exactly one/);
      expect(() => parseExpression('parameters()')).toThrow(/exactly one/);
    });
  });

  describe('selection', () => {
    it('parses array index selection', () => {
      const ast = parseExpression('createArray(1, 2, 3)[0]');
      expect(ast).toMatchObject({ type: 'selection', base: expect.anything(), steps: expect.any(Array) });
      const steps = (ast as { steps: { index: { value: unknown }; optional: boolean }[] }).steps;
      expect(steps).toHaveLength(1);
      expect(steps[0].index).toMatchObject({ type: 'literal', value: 0 });
      expect(steps[0].optional).toBe(false);
    });

    it('parses object property selection', () => {
      const ast = parseExpression("json('{\"a\":1}')['a']");
      expect(ast.type).toBe('selection');
      const steps = (ast as { steps: { index: { value: unknown } }[] }).steps;
      expect(steps[0].index).toMatchObject({ type: 'literal', value: 'a' });
    });

    it('parses chained selection', () => {
      const ast = parseExpression("variables('obj')['a'][0]");
      expect(ast.type).toBe('selection');
      const steps = (ast as { steps: unknown[] }).steps;
      expect(steps).toHaveLength(2);
    });

    it('parses selection with expression as index', () => {
      const ast = parseExpression('createArray(1, 2, 3)[add(0, 1)]');
      expect(ast.type).toBe('selection');
      const steps = (ast as { steps: { index: { type: string; name?: string } }[] }).steps;
      expect(steps[0].index).toMatchObject({ type: 'functionCall', name: 'add' });
    });
  });

  describe('optional selection', () => {
    it('parses optional selection with ?', () => {
      const ast = parseExpression("variables('maybe')?[0]");
      expect(ast.type).toBe('selection');
      const steps = (ast as { steps: { optional: boolean }[] }).steps;
      expect(steps[0].optional).toBe(true);
    });

    it('parses mixed optional and required selection', () => {
      const ast = parseExpression("variables('x')?[0][1]");
      const steps = (ast as { steps: { optional: boolean }[] }).steps;
      expect(steps[0].optional).toBe(true);
      expect(steps[1].optional).toBe(false);
    });
  });

  describe('errors', () => {
    it('throws on unclosed parenthesis', () => {
      expect(() => parseExpression('add(1, 2')).toThrow(ParseError);
      expect(() => parseExpression('add(1, 2')).toThrow(/Unclosed/);
    });

    it('throws on trailing comma', () => {
      expect(() => parseExpression('add(1, 2,)')).toThrow(ParseError);
      expect(() => parseExpression('add(1, 2,)')).toThrow(/Trailing comma/);
    });

    it('throws on bare identifier', () => {
      expect(() => parseExpression('foo')).toThrow(ParseError);
      expect(() => parseExpression('foo')).toThrow(/Unexpected identifier/);
    });

    it('throws on extra tokens', () => {
      expect(() => parseExpression("'a' 'b'")).toThrow();
    });
  });

  describe('with @ prefix', () => {
    it('parses expression with leading @', () => {
      const ast = parseExpression('@add(1, 2)');
      expect(ast).toMatchObject({ type: 'functionCall', name: 'add' });
    });
  });
});

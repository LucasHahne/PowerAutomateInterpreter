import { describe, it, expect } from 'vitest';
import { Tokenizer } from './tokenizer';

function tokenTypes(tokens: ReturnType<Tokenizer['tokenize']>) {
  return tokens.map((t) => t.type);
}

function tokenValues(tokens: ReturnType<Tokenizer['tokenize']>) {
  return tokens.map((t) => t.value);
}

describe('Tokenizer', () => {
  describe('literals', () => {
    it('parses string literals', () => {
      const t = new Tokenizer("'hello'").tokenize();
      expect(t[0]).toMatchObject({ type: 'string', value: 'hello' });
    });

    it('parses empty string', () => {
      const t = new Tokenizer("''").tokenize();
      expect(t[0]).toMatchObject({ type: 'string', value: '' });
    });

    it('parses string with escape sequences', () => {
      const t = new Tokenizer("'it\\'s'").tokenize();
      expect(t[0]).toMatchObject({ type: 'string', value: "it's" });
    });

    it('parses string with backslash escape', () => {
      const t = new Tokenizer("'path\\\\to'").tokenize();
      expect(t[0]).toMatchObject({ type: 'string', value: 'path\\to' });
    });

    it('parses string with \\n', () => {
      const t = new Tokenizer("'line1\\nline2'").tokenize();
      expect(t[0]).toMatchObject({ type: 'string', value: 'line1\nline2' });
    });

    it('parses string with \\t', () => {
      const t = new Tokenizer("'a\\tb'").tokenize();
      expect(t[0]).toMatchObject({ type: 'string', value: 'a\tb' });
    });

    it('parses integer', () => {
      const t = new Tokenizer('42').tokenize();
      expect(t[0]).toMatchObject({ type: 'number', value: 42 });
    });

    it('parses float', () => {
      const t = new Tokenizer('3.14').tokenize();
      expect(t[0]).toMatchObject({ type: 'number', value: 3.14 });
    });

    it('parses negative number', () => {
      const t = new Tokenizer('-10').tokenize();
      expect(t[0]).toMatchObject({ type: 'number', value: -10 });
    });

    it('parses negative float', () => {
      const t = new Tokenizer('-2.5').tokenize();
      expect(t[0]).toMatchObject({ type: 'number', value: -2.5 });
    });

    it('parses true', () => {
      const t = new Tokenizer('true').tokenize();
      expect(t[0]).toMatchObject({ type: 'boolean', value: true });
    });

    it('parses false', () => {
      const t = new Tokenizer('false').tokenize();
      expect(t[0]).toMatchObject({ type: 'boolean', value: false });
    });

    it('parses null', () => {
      const t = new Tokenizer('null').tokenize();
      expect(t[0]).toMatchObject({ type: 'null', value: null });
    });
  });

  describe('identifiers', () => {
    it('parses function name', () => {
      const t = new Tokenizer('concat').tokenize();
      expect(t[0]).toMatchObject({ type: 'identifier', value: 'concat' });
    });

    it('parses parameters', () => {
      const t = new Tokenizer('parameters').tokenize();
      expect(t[0]).toMatchObject({ type: 'identifier', value: 'parameters' });
    });

    it('parses identifier with underscore', () => {
      const t = new Tokenizer('add_days').tokenize();
      expect(t[0]).toMatchObject({ type: 'identifier', value: 'add_days' });
    });

    it('parses mixed case identifier', () => {
      const t = new Tokenizer('createArray').tokenize();
      expect(t[0]).toMatchObject({ type: 'identifier', value: 'createArray' });
    });
  });

  describe('punctuation', () => {
    it('parses parentheses', () => {
      const t = new Tokenizer('()').tokenize();
      expect(tokenTypes(t)).toEqual(['lparen', 'rparen', 'eof']);
    });

    it('parses comma', () => {
      const t = new Tokenizer(',').tokenize();
      expect(t[0].type).toBe('comma');
    });

    it('parses brackets', () => {
      const t = new Tokenizer('[]').tokenize();
      expect(tokenTypes(t)).toEqual(['lbracket', 'rbracket', 'eof']);
    });

    it('parses question mark', () => {
      const t = new Tokenizer('?').tokenize();
      expect(t[0].type).toBe('question');
    });

    it('parses at sign in middle of expression', () => {
      const t = new Tokenizer('x@y').tokenize();
      expect(tokenTypes(t).filter((x) => x !== 'eof')).toContain('at');
    });
  });

  describe('@ prefix', () => {
    it('strips optional leading @', () => {
      const t = new Tokenizer('@add(1,2)').tokenize();
      expect(tokenTypes(t)).toEqual(['identifier', 'lparen', 'number', 'comma', 'number', 'rparen', 'eof']);
    });

    it('strips @ with whitespace', () => {
      const t = new Tokenizer('@  add(1,2)').tokenize();
      expect(t[0]).toMatchObject({ type: 'identifier', value: 'add' });
    });
  });

  describe('whitespace', () => {
    it('handles spaces between tokens', () => {
      const t = new Tokenizer("add( 1 , 2 )").tokenize();
      expect(tokenValues(t).filter((v) => v !== '')).toContain(1);
      expect(tokenValues(t).filter((v) => v !== '')).toContain(2);
    });

    it('handles leading whitespace', () => {
      const t = new Tokenizer('  42').tokenize();
      expect(t[0]).toMatchObject({ type: 'number', value: 42 });
    });

    it('handles tabs', () => {
      const t = new Tokenizer('\tadd\t(\t1\t,\t2\t)').tokenize();
      expect(tokenTypes(t)).toContain('identifier');
    });
  });

  describe('complex expressions', () => {
    it('tokenizes concat with strings', () => {
      const t = new Tokenizer("concat('a','b')").tokenize();
      expect(tokenTypes(t)).toEqual([
        'identifier',
        'lparen',
        'string',
        'comma',
        'string',
        'rparen',
        'eof',
      ]);
    });

    it('tokenizes selection expression', () => {
      const t = new Tokenizer("variables('arr')[0]").tokenize();
      expect(tokenTypes(t)).toContain('lbracket');
      expect(tokenTypes(t)).toContain('rbracket');
      expect(t.find((x) => x.type === 'number')?.value).toBe(0);
    });

    it('tokenizes optional selection', () => {
      const t = new Tokenizer("variables('x')?[0]").tokenize();
      expect(tokenTypes(t)).toContain('question');
    });
  });

  describe('errors', () => {
    it('throws on double quotes', () => {
      expect(() => new Tokenizer('"hello"').tokenize()).toThrow(/single quotes|Double quotes/);
    });

    it('throws on unterminated string', () => {
      expect(() => new Tokenizer("'hello").tokenize()).toThrow(/Unterminated/);
    });

    it('throws on invalid character', () => {
      expect(() => new Tokenizer('#').tokenize()).toThrow(/Unexpected character/);
    });

    it('throws on lone minus sign', () => {
      expect(() => new Tokenizer('1+2').tokenize()).toThrow(/Unexpected character.*\+/);
    });
  });

  describe('token positions', () => {
    it('tracks start and end positions', () => {
      const t = new Tokenizer("'hi'").tokenize();
      expect(t[0]).toMatchObject({ start: 0, end: 4 });
    });

    it('tracks positions for numbers', () => {
      const t = new Tokenizer('123').tokenize();
      expect(t[0]).toMatchObject({ start: 0, end: 3 });
    });
  });
});

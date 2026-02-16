import { describe, it, expect } from 'vitest';
import { interpret } from './index';
import { createContext } from '../test/testHelpers';

describe('interpret', () => {
  it('returns error for empty expression', () => {
    const r = interpret('', createContext({}));
    expect(r).toMatchObject({ success: false, error: expect.stringContaining('empty'), kind: 'ParseError' });
  });

  it('returns error for whitespace-only expression', () => {
    const r = interpret('   ', createContext({}));
    expect(r.success).toBe(false);
  });

  it('evaluates simple expression', () => {
    const r = interpret("concat('a', 'b')", createContext({}));
    expect(r).toMatchObject({ success: true, value: 'ab' });
  });

  it('evaluates with parameters', () => {
    const ctx = createContext({ parameters: { name: 'World' } });
    const r = interpret("concat('Hello ', parameters('name'))", ctx);
    expect(r).toMatchObject({ success: true, value: 'Hello World' });
  });

  it('evaluates with variables', () => {
    const ctx = createContext({ variables: { items: [1, 2, 3] } });
    const r = interpret("variables('items')[0]", ctx);
    expect(r).toMatchObject({ success: true, value: 1 });
  });

  it('returns MissingParameter when parameter not defined', () => {
    const r = interpret("parameters('missing')", createContext({}));
    expect(r).toMatchObject({ success: false, kind: 'MissingParameter' });
  });

  it('returns MissingParameter when variable not defined', () => {
    const r = interpret("variables('missing')", createContext({}));
    expect(r).toMatchObject({ success: false, kind: 'MissingParameter' });
  });

  it('returns ParseError on invalid syntax', () => {
    const r = interpret('add(1, 2', createContext({}));
    expect(r).toMatchObject({ success: false, kind: 'ParseError' });
  });

  it('returns UnknownFunction for unknown function', () => {
    const r = interpret('unknownFunc(1)', createContext({}));
    expect(r.success).toBe(false);
    expect((r as { kind?: string }).kind).toBe('UnknownFunction');
  });

  it('returns TypeError for invalid operation', () => {
    const r = interpret("'hello'[0]", createContext({}));
    expect(r.success).toBe(false);
    expect((r as { kind?: string }).kind).toBe('TypeError');
  });

  it('returns RuntimeError for generic errors', () => {
    const r = interpret('div(1, 0)', createContext({}));
    expect(r.success).toBe(false);
    expect((r as { error: string }).error).toContain('zero');
  });
});

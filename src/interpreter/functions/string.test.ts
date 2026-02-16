import { describe, it, expect } from 'vitest';
import { interpret } from '../index';
import { createContext } from '../../test/testHelpers';

describe('String functions', () => {
  const ctx = createContext({});

  it('concat', () => {
    expect(interpret("concat('Hello', ' ', 'World')", ctx)).toMatchObject({ success: true, value: 'Hello World' });
    expect(interpret("concat('a', 'b', 'c')", ctx)).toMatchObject({ success: true, value: 'abc' });
  });

  it('toLower', () => {
    expect(interpret("toLower('Hello World')", ctx)).toMatchObject({ success: true, value: 'hello world' });
    expect(interpret("toLower('POWER')", ctx)).toMatchObject({ success: true, value: 'power' });
  });

  it('toUpper', () => {
    expect(interpret("toUpper('hello')", ctx)).toMatchObject({ success: true, value: 'HELLO' });
  });

  it('length on string', () => {
    expect(interpret("length('hello')", ctx)).toMatchObject({ success: true, value: 5 });
  });

  it('length on array', () => {
    expect(interpret("length(createArray('a', 'b', 'c'))", ctx)).toMatchObject({ success: true, value: 3 });
  });

  it('substring with length', () => {
    expect(interpret("substring('hello', 1, 3)", ctx)).toMatchObject({ success: true, value: 'ell' });
    expect(interpret("substring('hello', 0, 2)", ctx)).toMatchObject({ success: true, value: 'he' });
  });

  it('substring without length', () => {
    expect(interpret("substring('hello', 2)", ctx)).toMatchObject({ success: true, value: 'llo' });
  });

  it('split', () => {
    expect(interpret("split('a,b,c', ',')", ctx)).toMatchObject({ success: true, value: ['a', 'b', 'c'] });
    expect(interpret("split('one-two-three', '-')", ctx)).toMatchObject({ success: true, value: ['one', 'two', 'three'] });
  });

  it('replace', () => {
    expect(interpret("replace('hello world', 'world', 'there')", ctx)).toMatchObject({
      success: true,
      value: 'hello there',
    });
    expect(interpret("replace('foo bar foo', 'foo', 'baz')", ctx)).toMatchObject({
      success: true,
      value: 'baz bar baz',
    });
  });

  it('trim', () => {
    expect(interpret("trim('  hello  ')", ctx)).toMatchObject({ success: true, value: 'hello' });
  });

  it('startsWith', () => {
    expect(interpret("startsWith('hello', 'he')", ctx)).toMatchObject({ success: true, value: true });
    expect(interpret("startsWith('hello', 'lo')", ctx)).toMatchObject({ success: true, value: false });
    expect(interpret("startsWith('Hello', 'he')", ctx)).toMatchObject({ success: true, value: true });
  });

  it('endsWith', () => {
    expect(interpret("endsWith('hello', 'lo')", ctx)).toMatchObject({ success: true, value: true });
    expect(interpret("endsWith('hello', 'he')", ctx)).toMatchObject({ success: true, value: false });
  });

  it('coerces null/undefined to empty string', () => {
    expect(interpret("concat(null, 'x')", ctx)).toMatchObject({ success: true, value: 'x' });
  });
});

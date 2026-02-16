import { describe, it, expect } from 'vitest';
import { interpret } from '../index';
import { createContext } from '../../test/testHelpers';

describe('Collection functions', () => {
  const ctx = createContext({});

  it('first on array', () => {
    expect(interpret("first(createArray('a', 'b', 'c'))", ctx)).toMatchObject({ success: true, value: 'a' });
  });

  it('first on string', () => {
    expect(interpret("first('hello')", ctx)).toMatchObject({ success: true, value: 'h' });
  });

  it('last on array', () => {
    expect(interpret("last(createArray('a', 'b', 'c'))", ctx)).toMatchObject({ success: true, value: 'c' });
  });

  it('last on string', () => {
    expect(interpret("last('hello')", ctx)).toMatchObject({ success: true, value: 'o' });
  });

  it('join', () => {
    expect(interpret("join(createArray('a', 'b', 'c'), ',')", ctx)).toMatchObject({
      success: true,
      value: 'a,b,c',
    });
    expect(interpret("join(createArray(1, 2, 3), '-')", ctx)).toMatchObject({ success: true, value: '1-2-3' });
  });

  it('take', () => {
    expect(interpret("take('hello', 2)", ctx)).toMatchObject({ success: true, value: 'he' });
    expect(interpret('take(createArray(1, 2, 3), 2)', ctx)).toMatchObject({ success: true, value: [1, 2] });
  });

  it('skip', () => {
    expect(interpret("skip('hello', 2)", ctx)).toMatchObject({ success: true, value: 'llo' });
    expect(interpret('skip(createArray(1, 2, 3), 1)', ctx)).toMatchObject({ success: true, value: [2, 3] });
  });

  it('contains string', () => {
    expect(interpret("contains('hello', 'ell')", ctx)).toMatchObject({ success: true, value: true });
    expect(interpret("contains('hello', 'xyz')", ctx)).toMatchObject({ success: true, value: false });
  });

  it('contains array', () => {
    expect(interpret('contains(createArray(1, 2, 3), 2)', ctx)).toMatchObject({ success: true, value: true });
    expect(interpret('contains(createArray(1, 2, 3), 9)', ctx)).toMatchObject({ success: true, value: false });
  });

  it('contains object', () => {
    expect(interpret("contains(json('{\"a\":1}'), 'a')", ctx)).toMatchObject({ success: true, value: true });
    expect(interpret("contains(json('{\"a\":1}'), 'b')", ctx)).toMatchObject({ success: true, value: false });
  });

  it('empty', () => {
    expect(interpret("empty('')", ctx)).toMatchObject({ success: true, value: true });
    expect(interpret("empty('x')", ctx)).toMatchObject({ success: true, value: false });
    expect(interpret('empty(createArray())', ctx)).toMatchObject({ success: true, value: true });
    expect(interpret("empty(json('{}'))", ctx)).toMatchObject({ success: true, value: true });
  });

  it('union', () => {
    expect(interpret("union(createArray(1, 2), createArray(2, 3))", ctx)).toMatchObject({
      success: true,
      value: [1, 2, 3],
    });
  });

  it('intersection', () => {
    expect(interpret("intersection(createArray(1, 2, 3), createArray(2, 3, 4))", ctx)).toMatchObject({
      success: true,
      value: [2, 3],
    });
  });

  it('first on empty array', () => {
    const r = interpret('first(createArray())', ctx);
    expect(r).toMatchObject({ success: true, value: undefined });
  });

  it('last on empty string', () => {
    const r = interpret("last('')", ctx);
    expect(r).toMatchObject({ success: true, value: '' });
  });
});

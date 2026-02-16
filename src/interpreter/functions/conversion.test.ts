import { describe, it, expect } from 'vitest';
import { interpret } from '../index';
import { createContext } from '../../test/testHelpers';

describe('Conversion functions', () => {
  const ctx = createContext({});

  it('int', () => {
    expect(interpret('int(3.7)', ctx)).toMatchObject({ success: true, value: 3 });
    expect(interpret("int('42')", ctx)).toMatchObject({ success: true, value: 42 });
    expect(interpret('int(-2.9)', ctx)).toMatchObject({ success: true, value: -2 });
  });

  it('float', () => {
    expect(interpret('float(3)', ctx)).toMatchObject({ success: true, value: 3 });
    expect(interpret("float('3.14')", ctx)).toMatchObject({ success: true, value: 3.14 });
  });

  it('string', () => {
    expect(interpret('string(42)', ctx)).toMatchObject({ success: true, value: '42' });
    expect(interpret('string(true)', ctx)).toMatchObject({ success: true, value: 'true' });
    expect(interpret('string(null)', ctx)).toMatchObject({ success: true, value: '' });
  });

  it('bool', () => {
    expect(interpret('bool(true)', ctx)).toMatchObject({ success: true, value: true });
    expect(interpret('bool(1)', ctx)).toMatchObject({ success: true, value: true });
    expect(interpret("bool('true')", ctx)).toMatchObject({ success: true, value: true });
    expect(interpret('bool(0)', ctx)).toMatchObject({ success: true, value: false });
    expect(interpret("bool('false')", ctx)).toMatchObject({ success: true, value: false });
  });

  it('json', () => {
    expect(interpret("json('{\"a\":1}')", ctx)).toMatchObject({ success: true, value: { a: 1 } });
    expect(interpret("json('[1,2,3]')", ctx)).toMatchObject({ success: true, value: [1, 2, 3] });
  });

  it('json invalid throws', () => {
    const r = interpret("json('invalid')", ctx);
    expect(r.success).toBe(false);
  });

  it('array', () => {
    expect(interpret('array(42)', ctx)).toMatchObject({ success: true, value: [42] });
    expect(interpret("array('x')", ctx)).toMatchObject({ success: true, value: ['x'] });
  });

  it('createArray', () => {
    expect(interpret("createArray('a', 'b', 'c')", ctx)).toMatchObject({ success: true, value: ['a', 'b', 'c'] });
    expect(interpret('createArray(1, 2, 3)', ctx)).toMatchObject({ success: true, value: [1, 2, 3] });
  });
});

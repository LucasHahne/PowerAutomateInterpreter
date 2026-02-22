import { describe, it, expect } from 'vitest';
import { interpret } from '../index';
import { createContext } from '../../test/testHelpers';

describe('Logical functions', () => {
  const ctx = createContext({});

  it('and', () => {
    expect(interpret('and(true, true)', ctx)).toMatchObject({ success: true, value: true });
    expect(interpret('and(true, false)', ctx)).toMatchObject({ success: true, value: false });
    expect(interpret('and(false, false)', ctx)).toMatchObject({ success: true, value: false });
    expect(interpret('and(true, true, true)', ctx)).toMatchObject({ success: true, value: true });
  });

  it('or', () => {
    expect(interpret('or(false, true)', ctx)).toMatchObject({ success: true, value: true });
    expect(interpret('or(false, false)', ctx)).toMatchObject({ success: true, value: false });
  });

  it('not', () => {
    expect(interpret('not(true)', ctx)).toMatchObject({ success: true, value: false });
    expect(interpret('not(false)', ctx)).toMatchObject({ success: true, value: true });
  });

  it('equals numbers', () => {
    expect(interpret('equals(1, 1)', ctx)).toMatchObject({ success: true, value: true });
    expect(interpret('equals(1, 2)', ctx)).toMatchObject({ success: true, value: false });
  });

  it('equals strings', () => {
    expect(interpret("equals('a', 'a')", ctx)).toMatchObject({ success: true, value: true });
    expect(interpret("equals('1', 1)", ctx)).toMatchObject({ success: true, value: true });
  });

  it('if', () => {
    expect(interpret("if(true, 'yes', 'no')", ctx)).toMatchObject({ success: true, value: 'yes' });
    expect(interpret("if(false, 'yes', 'no')", ctx)).toMatchObject({ success: true, value: 'no' });
    expect(interpret('if(1, 100, 200)', ctx)).toMatchObject({ success: true, value: 100 });
    expect(interpret('if(0, 100, 200)', ctx)).toMatchObject({ success: true, value: 200 });
  });

  it('greater', () => {
    expect(interpret('greater(5, 3)', ctx)).toMatchObject({ success: true, value: true });
    expect(interpret('greater(3, 5)', ctx)).toMatchObject({ success: true, value: false });
  });

  it('less', () => {
    expect(interpret('less(2, 5)', ctx)).toMatchObject({ success: true, value: true });
    expect(interpret('less(5, 2)', ctx)).toMatchObject({ success: true, value: false });
  });

  it('greaterOrEquals', () => {
    expect(interpret('greaterOrEquals(5, 5)', ctx)).toMatchObject({ success: true, value: true });
    expect(interpret('greaterOrEquals(4, 5)', ctx)).toMatchObject({ success: true, value: false });
  });

  it('lessOrEquals', () => {
    expect(interpret('lessOrEquals(5, 5)', ctx)).toMatchObject({ success: true, value: true });
    expect(interpret('lessOrEquals(6, 5)', ctx)).toMatchObject({ success: true, value: false });
  });

  it('coalesce', () => {
    expect(interpret('coalesce(null, true, false)', ctx)).toMatchObject({ success: true, value: true });
    expect(interpret('coalesce(null, null, null)', ctx)).toMatchObject({ success: true, value: null });
    expect(interpret("coalesce(null, null, 'fallback')", ctx)).toMatchObject({ success: true, value: 'fallback' });
  });
});

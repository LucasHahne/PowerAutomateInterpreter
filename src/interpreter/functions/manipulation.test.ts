import { describe, it, expect } from 'vitest';
import { interpret } from '../index';
import { createContext } from '../../test/testHelpers';

describe('Manipulation functions', () => {
  const ctx = createContext({});

  it('addProperty', () => {
    const r = interpret(
      "addProperty(json('{\"firstName\": \"Sophia\", \"lastName\": \"Owen\"}'), 'middleName', 'Anne')",
      ctx,
    );
    expect(r.success).toBe(true);
    expect((r as { value: Record<string, string> }).value).toEqual({
      firstName: 'Sophia',
      lastName: 'Owen',
      middleName: 'Anne',
    });
  });

  it('removeProperty', () => {
    const r = interpret("removeProperty(json('{\"a\": 1, \"b\": 2}'), 'b')", ctx);
    expect(r.success).toBe(true);
    expect((r as { value: Record<string, number> }).value).toEqual({ a: 1 });
  });

  it('setProperty', () => {
    const r = interpret(
      "setProperty(json('{\"firstName\": \"Sophia\", \"surName\": \"Owen\"}'), 'surName', 'Hartnett')",
      ctx,
    );
    expect(r.success).toBe(true);
    expect((r as { value: Record<string, string> }).value).toEqual({
      firstName: 'Sophia',
      surName: 'Hartnett',
    });
  });
});

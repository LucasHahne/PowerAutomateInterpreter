import { describe, it, expect } from 'vitest';
import { interpret } from '../index';
import { createContext } from '../../test/testHelpers';

describe('DateTime functions', () => {
  const ctx = createContext({});

  it('utcNow returns ISO string', () => {
    const r = interpret('utcNow()', ctx);
    expect(r.success).toBe(true);
    expect(typeof (r as { value: string }).value).toBe('string');
    expect((r as { value: string }).value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('utcNow with format', () => {
    const r = interpret("utcNow('yyyy-MM-dd')", ctx);
    expect(r.success).toBe(true);
    expect((r as { value: string }).value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('addDays', () => {
    const r = interpret("addDays('2024-01-15T00:00:00Z', 5)", ctx);
    expect(r.success).toBe(true);
    expect((r as { value: string }).value).toContain('2024-01-20');
  });

  it('addHours', () => {
    const r = interpret("addHours('2024-01-15T10:00:00Z', 3)", ctx);
    expect(r.success).toBe(true);
    expect((r as { value: string }).value).toContain('13:00');
  });

  it('formatDateTime', () => {
    const r = interpret("formatDateTime('2024-01-15T14:30:00Z', 'yyyy-MM-dd')", ctx);
    expect(r.success).toBe(true);
    expect((r as { value: string }).value).toBe('2024-01-15');
  });

  it('startOfDay', () => {
    const r = interpret("startOfDay('2024-01-15T14:30:45Z')", ctx);
    expect(r.success).toBe(true);
    expect((r as { value: string }).value).toMatch(/00:00:00/);
  });

  it('invalid timestamp throws', () => {
    const r = interpret("addDays('not-a-date', 1)", ctx);
    expect(r.success).toBe(false);
  });
});

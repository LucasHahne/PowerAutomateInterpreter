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

  it('addMinutes', () => {
    const r = interpret("addMinutes('2018-03-15T00:10:00Z', 10)", ctx);
    expect(r.success).toBe(true);
    expect((r as { value: string }).value).toContain('00:20');
  });
  it('addSeconds', () => {
    const r = interpret("addSeconds('2018-03-15T00:00:00Z', 10)", ctx);
    expect(r.success).toBe(true);
    expect((r as { value: string }).value).toContain('00:00:10');
  });
  it('addToTime', () => {
    const r = interpret("addToTime('2018-01-01T00:00:00Z', 1, 'Day')", ctx);
    expect(r.success).toBe(true);
    expect((r as { value: string }).value).toContain('2018-01-02');
  });
  it('subtractFromTime', () => {
    const r = interpret("subtractFromTime('2018-01-02T00:00:00Z', 1, 'Day')", ctx);
    expect(r.success).toBe(true);
    expect((r as { value: string }).value).toContain('2018-01-01');
  });
  it('getFutureTime', () => {
    const r = interpret("getFutureTime(1, 'Day')", ctx);
    expect(r.success).toBe(true);
    expect(typeof (r as { value: string }).value).toBe('string');
  });
  it('getPastTime', () => {
    const r = interpret("getPastTime(1, 'Day')", ctx);
    expect(r.success).toBe(true);
    expect(typeof (r as { value: string }).value).toBe('string');
  });
  it('dateDifference', () => {
    const r = interpret("dateDifference('2015-02-08', '2018-07-30')", ctx);
    expect(r.success).toBe(true);
    expect((r as { value: string }).value).toBe('1268.00:00:00');
  });
  it('dayOfMonth', () => {
    const r = interpret("dayOfMonth('2018-03-15T13:27:36Z')", ctx);
    expect(r.success).toBe(true);
    expect((r as { value: number }).value).toBe(15);
  });
  it('dayOfWeek', () => {
    const r = interpret("dayOfWeek('2018-03-15T13:27:36Z')", ctx);
    expect(r.success).toBe(true);
    expect((r as { value: number }).value).toBe(4);
  });
  it('dayOfYear', () => {
    const r = interpret("dayOfYear('2018-03-15T13:27:36Z')", ctx);
    expect(r.success).toBe(true);
    expect((r as { value: number }).value).toBe(74);
  });
  it('startOfHour', () => {
    const r = interpret("startOfHour('2018-03-15T13:30:30Z')", ctx);
    expect(r.success).toBe(true);
    expect((r as { value: string }).value).toContain('13:00:00');
  });
  it('startOfMonth', () => {
    const r = interpret("startOfMonth('2018-03-15T13:30:30Z')", ctx);
    expect(r.success).toBe(true);
    expect((r as { value: string }).value).toContain('2018-03-01');
  });
  it('ticks', () => {
    const r = interpret("ticks('1970-01-01T00:00:00Z')", ctx);
    expect(r.success).toBe(true);
    expect((r as { value: bigint }).value).toBe(621355968000000000n);
  });
});

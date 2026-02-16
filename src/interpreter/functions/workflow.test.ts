import { describe, it, expect } from 'vitest';
import { interpret } from '../index';
import { createContext } from '../../test/testHelpers';
import { getFunction } from '../functions';

describe('Workflow functions', () => {
  it('triggerBody returns value when defined', () => {
    const ctx = createContext({ triggerBody: { id: 1, name: 'test' } });
    const r = interpret('triggerBody()', ctx);
    expect(r).toMatchObject({ success: true, value: { id: 1, name: 'test' } });
  });

  it('triggerBody throws when undefined', () => {
    const ctx = createContext({});
    const r = interpret('triggerBody()', ctx);
    expect(r.success).toBe(false);
    expect((r as { error: string }).error).toContain('not defined');
  });

  it('parameters via parser (parametersCall) returns value', () => {
    const ctx = createContext({ parameters: { p1: 'value' } });
    const r = interpret("parameters('p1')", ctx);
    expect(r).toMatchObject({ success: true, value: 'value' });
  });

  it('variables via parser (variablesCall) returns value', () => {
    const ctx = createContext({ variables: { v1: [1, 2, 3] } });
    const r = interpret("variables('v1')", ctx);
    expect(r).toMatchObject({ success: true, value: [1, 2, 3] });
  });

  it('workflow parameters() handler when called directly', () => {
    const ctx = createContext({ parameters: { p: 'val' } });
    const fn = getFunction('parameters');
    expect(fn).toBeDefined();
    expect(fn!(['p'], ctx)).toBe('val');
  });

  it('workflow variables() handler when called directly', () => {
    const ctx = createContext({ variables: { v: 42 } });
    const fn = getFunction('variables');
    expect(fn).toBeDefined();
    expect(fn!(['v'], ctx)).toBe(42);
  });

  it('workflow parameters() throws when missing', () => {
    const ctx = createContext({});
    const fn = getFunction('parameters');
    expect(() => fn!(['missing'], ctx)).toThrow(/not defined/);
  });

  it('workflow variables() throws when missing', () => {
    const ctx = createContext({});
    const fn = getFunction('variables');
    expect(() => fn!(['missing'], ctx)).toThrow(/not defined/);
  });
});

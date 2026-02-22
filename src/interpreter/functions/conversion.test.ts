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

  it('base64', () => {
    expect(interpret("base64('hello')", ctx)).toMatchObject({ success: true, value: 'aGVsbG8=' });
  });
  it('base64ToString', () => {
    expect(interpret("base64ToString('aGVsbG8=')", ctx)).toMatchObject({ success: true, value: 'hello' });
  });
  it('base64ToBinary', () => {
    expect(interpret("base64ToBinary('aGVsbG8=')", ctx)).toMatchObject({ success: true, value: 'hello' });
  });
  it('binary', () => {
    expect(interpret("binary('hello')", ctx)).toMatchObject({ success: true, value: 'aGVsbG8=' });
  });
  it('decodeUriComponent', () => {
    expect(interpret("decodeUriComponent('https%3A%2F%2Fcontoso.com')", ctx)).toMatchObject({
      success: true,
      value: 'https://contoso.com',
    });
  });
  it('encodeUriComponent', () => {
    expect(interpret("encodeUriComponent('https://contoso.com')", ctx)).toMatchObject({
      success: true,
      value: 'https%3A%2F%2Fcontoso.com',
    });
  });
  it('uriComponent', () => {
    expect(interpret("uriComponent('https://contoso.com')", ctx)).toMatchObject({
      success: true,
      value: 'https%3A%2F%2Fcontoso.com',
    });
  });
  it('uriComponentToString', () => {
    expect(interpret("uriComponentToString('https%3A%2F%2Fcontoso.com')", ctx)).toMatchObject({
      success: true,
      value: 'https://contoso.com',
    });
  });
  it('uriComponentToBinary', () => {
    expect(interpret("uriComponentToBinary('https%3A%2F%2Fcontoso.com')", ctx)).toMatchObject({
      success: true,
      value: 'aHR0cHM6Ly9jb250b3NvLmNvbQ==',
    });
  });
  it('dataUri', () => {
    expect(interpret("dataUri('hello')", ctx)).toMatchObject({
      success: true,
      value: 'data:text/plain;charset=utf-8;base64,aGVsbG8=',
    });
  });
  it('dataUriToString', () => {
    expect(
      interpret("dataUriToString('data:text/plain;charset=utf-8;base64,aGVsbG8=')", ctx),
    ).toMatchObject({ success: true, value: 'hello' });
  });
  it('dataUriToBinary', () => {
    expect(
      interpret("dataUriToBinary('data:text/plain;charset=utf-8;base64,aGVsbG8=')", ctx),
    ).toMatchObject({ success: true, value: 'hello' });
  });
  it('decodeDataUri', () => {
    expect(
      interpret("decodeDataUri('data:text/plain;charset=utf-8;base64,aGVsbG8=')", ctx),
    ).toMatchObject({ success: true, value: 'hello' });
  });
  it('decimal', () => {
    expect(interpret("decimal('1.2345678912312131')", ctx)).toMatchObject({
      success: true,
      value: 1.234567891231213,
    });
  });
  it('uriHost', () => {
    expect(interpret("uriHost('https://www.localhost.com:8080')", ctx)).toMatchObject({
      success: true,
      value: 'www.localhost.com',
    });
  });
  it('uriPath', () => {
    expect(
      interpret("uriPath('https://www.contoso.com/catalog/shownew.htm?date=today')", ctx),
    ).toMatchObject({ success: true, value: '/catalog/shownew.htm' });
  });
  it('uriPathAndQuery', () => {
    expect(
      interpret("uriPathAndQuery('https://www.contoso.com/catalog/shownew.htm?date=today')", ctx),
    ).toMatchObject({ success: true, value: '/catalog/shownew.htm?date=today' });
  });
  it('uriPort', () => {
    expect(interpret("uriPort('https://www.localhost.com:8080')", ctx)).toMatchObject({
      success: true,
      value: 8080,
    });
  });
  it('uriQuery', () => {
    expect(
      interpret("uriQuery('https://www.contoso.com/catalog/shownew.htm?date=today')", ctx),
    ).toMatchObject({ success: true, value: '?date=today' });
  });
  it('uriScheme', () => {
    expect(interpret("uriScheme('https://www.contoso.com')", ctx)).toMatchObject({
      success: true,
      value: 'https',
    });
  });
});

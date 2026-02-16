export interface FunctionParameter {
  name: string;
  type: string;
  required?: boolean;
}

export interface FunctionExample {
  expression: string;
  result: string;
}

export interface FunctionMetadata {
  name: string;
  category: string;
  description: string;
  signature: string;
  parameters: FunctionParameter[];
  returns: string;
  examples: FunctionExample[];
  docsUrl: string;
}

const BASE = 'https://learn.microsoft.com/en-us/azure/logic-apps/workflow-definition-language-functions-reference';

export const FUNCTION_METADATA: Record<string, FunctionMetadata> = {
  // String functions
  concat: {
    name: 'concat',
    category: 'String',
    description: 'Combine two or more strings and return the combined string.',
    signature: "concat(text1, text2, ...)",
    parameters: [
      { name: 'text1', type: 'string', required: true },
      { name: 'text2', type: 'string', required: true },
      { name: '...', type: 'string', required: false },
    ],
    returns: 'string',
    examples: [
      { expression: "concat('Hello', ' ', 'World')", result: "'Hello World'" },
      { expression: "concat('a', 'b', 'c')", result: "'abc'" },
    ],
    docsUrl: `${BASE}#concat`,
  },
  toLower: {
    name: 'toLower',
    category: 'String',
    description: 'Return a string in lowercase format.',
    signature: 'toLower(text)',
    parameters: [{ name: 'text', type: 'string', required: true }],
    returns: 'string',
    examples: [
      { expression: "toLower('Hello World')", result: "'hello world'" },
      { expression: "toLower('POWER AUTOMATE')", result: "'power automate'" },
    ],
    docsUrl: `${BASE}#toLower`,
  },
  toUpper: {
    name: 'toUpper',
    category: 'String',
    description: 'Return a string in uppercase format.',
    signature: 'toUpper(text)',
    parameters: [{ name: 'text', type: 'string', required: true }],
    returns: 'string',
    examples: [
      { expression: "toUpper('hello')", result: "'HELLO'" },
      { expression: "toUpper('yes')", result: "'YES'" },
    ],
    docsUrl: `${BASE}#toUpper`,
  },
  length: {
    name: 'length',
    category: 'String',
    description: 'Return the number of items in a string or array.',
    signature: 'length(collection)',
    parameters: [{ name: 'collection', type: 'string | array', required: true }],
    returns: 'integer',
    examples: [
      { expression: "length('hello')", result: '5' },
      { expression: "length(createArray('a', 'b', 'c'))", result: '3' },
    ],
    docsUrl: `${BASE}#length`,
  },
  substring: {
    name: 'substring',
    category: 'String',
    description: 'Return characters from a string, starting from the specified position.',
    signature: 'substring(text, startIndex, length?)',
    parameters: [
      { name: 'text', type: 'string', required: true },
      { name: 'startIndex', type: 'integer', required: true },
      { name: 'length', type: 'integer', required: false },
    ],
    returns: 'string',
    examples: [
      { expression: "substring('hello', 1, 3)", result: "'ell'" },
      { expression: "substring('hello', 0, 2)", result: "'he'" },
    ],
    docsUrl: `${BASE}#substring`,
  },
  split: {
    name: 'split',
    category: 'String',
    description: 'Return an array containing substrings separated by the specified delimiter.',
    signature: 'split(text, delimiter)',
    parameters: [
      { name: 'text', type: 'string', required: true },
      { name: 'delimiter', type: 'string', required: true },
    ],
    returns: 'array',
    examples: [
      { expression: "split('a,b,c', ',')", result: "['a', 'b', 'c']" },
      { expression: "split('one-two-three', '-')", result: "['one', 'two', 'three']" },
    ],
    docsUrl: `${BASE}#split`,
  },
  replace: {
    name: 'replace',
    category: 'String',
    description: 'Replace a substring with the specified string and return the updated string.',
    signature: 'replace(text, oldString, newString)',
    parameters: [
      { name: 'text', type: 'string', required: true },
      { name: 'oldString', type: 'string', required: true },
      { name: 'newString', type: 'string', required: true },
    ],
    returns: 'string',
    examples: [
      { expression: "replace('hello world', 'world', 'there')", result: "'hello there'" },
      { expression: "replace('foo bar foo', 'foo', 'baz')", result: "'baz bar baz'" },
    ],
    docsUrl: `${BASE}#replace`,
  },
  trim: {
    name: 'trim',
    category: 'String',
    description: 'Remove leading and trailing whitespace from a string and return the updated string.',
    signature: 'trim(text)',
    parameters: [{ name: 'text', type: 'string', required: true }],
    returns: 'string',
    examples: [
      { expression: "trim('  hello  ')", result: "'hello'" },
      { expression: "trim('\\t  spaces  \\t')", result: "'spaces'" },
    ],
    docsUrl: `${BASE}#trim`,
  },
  startsWith: {
    name: 'startsWith',
    category: 'String',
    description: 'Check whether a string starts with the specified substring (case-insensitive).',
    signature: 'startsWith(text, searchText)',
    parameters: [
      { name: 'text', type: 'string', required: true },
      { name: 'searchText', type: 'string', required: true },
    ],
    returns: 'boolean',
    examples: [
      { expression: "startsWith('hello', 'he')", result: 'true' },
      { expression: "startsWith('hello', 'lo')", result: 'false' },
    ],
    docsUrl: `${BASE}#startswith`,
  },
  endsWith: {
    name: 'endsWith',
    category: 'String',
    description: 'Check whether a string ends with the specified substring (case-insensitive).',
    signature: 'endsWith(text, searchText)',
    parameters: [
      { name: 'text', type: 'string', required: true },
      { name: 'searchText', type: 'string', required: true },
    ],
    returns: 'boolean',
    examples: [
      { expression: "endsWith('hello', 'lo')", result: 'true' },
      { expression: "endsWith('hello', 'he')", result: 'false' },
    ],
    docsUrl: `${BASE}#endswith`,
  },
  // Math functions
  add: {
    name: 'add',
    category: 'Math',
    description: 'Return the result from adding two numbers.',
    signature: 'add(summand1, summand2)',
    parameters: [
      { name: 'summand1', type: 'number', required: true },
      { name: 'summand2', type: 'number', required: true },
    ],
    returns: 'number',
    examples: [
      { expression: 'add(1, 2)', result: '3' },
      { expression: 'add(10, -3)', result: '7' },
    ],
    docsUrl: `${BASE}#add`,
  },
  sub: {
    name: 'sub',
    category: 'Math',
    description: 'Return the result from subtracting the second number from the first.',
    signature: 'sub(minuend, subtrahend)',
    parameters: [
      { name: 'minuend', type: 'number', required: true },
      { name: 'subtrahend', type: 'number', required: true },
    ],
    returns: 'number',
    examples: [
      { expression: 'sub(10, 3)', result: '7' },
      { expression: 'sub(0, 5)', result: '-5' },
    ],
    docsUrl: `${BASE}#sub`,
  },
  mul: {
    name: 'mul',
    category: 'Math',
    description: 'Return the product from multiplying two numbers.',
    signature: 'mul(multiplicand1, multiplicand2)',
    parameters: [
      { name: 'multiplicand1', type: 'number', required: true },
      { name: 'multiplicand2', type: 'number', required: true },
    ],
    returns: 'number',
    examples: [
      { expression: 'mul(4, 5)', result: '20' },
      { expression: 'mul(-2, 3)', result: '-6' },
    ],
    docsUrl: `${BASE}#mul`,
  },
  div: {
    name: 'div',
    category: 'Math',
    description: 'Return the result from dividing two numbers.',
    signature: 'div(dividend, divisor)',
    parameters: [
      { name: 'dividend', type: 'number', required: true },
      { name: 'divisor', type: 'number', required: true },
    ],
    returns: 'number',
    examples: [
      { expression: 'div(10, 2)', result: '5' },
      { expression: 'div(7, 2)', result: '3.5' },
    ],
    docsUrl: `${BASE}#div`,
  },
  mod: {
    name: 'mod',
    category: 'Math',
    description: 'Return the remainder from dividing two numbers.',
    signature: 'mod(dividend, divisor)',
    parameters: [
      { name: 'dividend', type: 'number', required: true },
      { name: 'divisor', type: 'number', required: true },
    ],
    returns: 'number',
    examples: [
      { expression: 'mod(10, 3)', result: '1' },
      { expression: 'mod(8, 4)', result: '0' },
    ],
    docsUrl: `${BASE}#mod`,
  },
  min: {
    name: 'min',
    category: 'Math',
    description: 'Return the lowest value from a set of numbers or an array.',
    signature: 'min(number1, number2, ...) or min(array)',
    parameters: [
      { name: 'numbers or array', type: 'number | array', required: true },
    ],
    returns: 'number',
    examples: [
      { expression: 'min(1, 5, 3)', result: '1' },
      { expression: 'min(createArray(10, 2, 8))', result: '2' },
    ],
    docsUrl: `${BASE}#min`,
  },
  max: {
    name: 'max',
    category: 'Math',
    description: 'Return the highest value from a set of numbers or an array.',
    signature: 'max(number1, number2, ...) or max(array)',
    parameters: [
      { name: 'numbers or array', type: 'number | array', required: true },
    ],
    returns: 'number',
    examples: [
      { expression: 'max(1, 5, 3)', result: '5' },
      { expression: 'max(createArray(10, 2, 8))', result: '10' },
    ],
    docsUrl: `${BASE}#max`,
  },
  // Logical functions
  and: {
    name: 'and',
    category: 'Logical',
    description: 'Check whether all expressions are true.',
    signature: 'and(expression1, expression2, ...)',
    parameters: [
      { name: 'expression1', type: 'boolean', required: true },
      { name: 'expression2', type: 'boolean', required: true },
      { name: '...', type: 'boolean', required: false },
    ],
    returns: 'boolean',
    examples: [
      { expression: 'and(equals(1, 1), equals(2, 2))', result: 'true' },
      { expression: 'and(equals(1, 2), equals(2, 2))', result: 'false' },
    ],
    docsUrl: `${BASE}#and`,
  },
  or: {
    name: 'or',
    category: 'Logical',
    description: 'Check whether at least one expression is true.',
    signature: 'or(expression1, expression2, ...)',
    parameters: [
      { name: 'expression1', type: 'boolean', required: true },
      { name: 'expression2', type: 'boolean', required: true },
      { name: '...', type: 'boolean', required: false },
    ],
    returns: 'boolean',
    examples: [
      { expression: 'or(equals(1, 2), equals(2, 2))', result: 'true' },
      { expression: 'or(equals(1, 2), equals(2, 3))', result: 'false' },
    ],
    docsUrl: `${BASE}#or`,
  },
  not: {
    name: 'not',
    category: 'Logical',
    description: 'Check whether an expression is false.',
    signature: 'not(expression)',
    parameters: [{ name: 'expression', type: 'boolean', required: true }],
    returns: 'boolean',
    examples: [
      { expression: 'not(equals(1, 2))', result: 'true' },
      { expression: 'not(equals(1, 1))', result: 'false' },
    ],
    docsUrl: `${BASE}#not`,
  },
  equals: {
    name: 'equals',
    category: 'Logical',
    description: 'Check whether both values are equivalent.',
    signature: 'equals(object1, object2)',
    parameters: [
      { name: 'object1', type: 'any', required: true },
      { name: 'object2', type: 'any', required: true },
    ],
    returns: 'boolean',
    examples: [
      { expression: "equals('hello', 'hello')", result: 'true' },
      { expression: "equals(1, '1')", result: 'false' },
    ],
    docsUrl: `${BASE}#equals`,
  },
  if: {
    name: 'if',
    category: 'Logical',
    description: 'Check whether an expression is true or false. Return a specified value based on the result.',
    signature: 'if(expression, valueIfTrue, valueIfFalse)',
    parameters: [
      { name: 'expression', type: 'boolean', required: true },
      { name: 'valueIfTrue', type: 'any', required: true },
      { name: 'valueIfFalse', type: 'any', required: true },
    ],
    returns: 'any',
    examples: [
      { expression: "if(equals(1, 1), 'yes', 'no')", result: "'yes'" },
      { expression: "if(greater(5, 10), 'big', 'small')", result: "'small'" },
    ],
    docsUrl: `${BASE}#if`,
  },
  greater: {
    name: 'greater',
    category: 'Logical',
    description: 'Check whether the first value is greater than the second.',
    signature: 'greater(value1, value2)',
    parameters: [
      { name: 'value1', type: 'number | string', required: true },
      { name: 'value2', type: 'number | string', required: true },
    ],
    returns: 'boolean',
    examples: [
      { expression: 'greater(10, 5)', result: 'true' },
      { expression: "greater('b', 'a')", result: 'true' },
    ],
    docsUrl: `${BASE}#greater`,
  },
  less: {
    name: 'less',
    category: 'Logical',
    description: 'Check whether the first value is less than the second.',
    signature: 'less(value1, value2)',
    parameters: [
      { name: 'value1', type: 'number | string', required: true },
      { name: 'value2', type: 'number | string', required: true },
    ],
    returns: 'boolean',
    examples: [
      { expression: 'less(5, 10)', result: 'true' },
      { expression: 'less(10, 5)', result: 'false' },
    ],
    docsUrl: `${BASE}#less`,
  },
  greaterOrEquals: {
    name: 'greaterOrEquals',
    category: 'Logical',
    description: 'Check whether the first value is greater than or equal to the second.',
    signature: 'greaterOrEquals(value1, value2)',
    parameters: [
      { name: 'value1', type: 'number | string', required: true },
      { name: 'value2', type: 'number | string', required: true },
    ],
    returns: 'boolean',
    examples: [
      { expression: 'greaterOrEquals(5, 5)', result: 'true' },
      { expression: 'greaterOrEquals(3, 5)', result: 'false' },
    ],
    docsUrl: `${BASE}#greaterOrEquals`,
  },
  lessOrEquals: {
    name: 'lessOrEquals',
    category: 'Logical',
    description: 'Check whether the first value is less than or equal to the second.',
    signature: 'lessOrEquals(value1, value2)',
    parameters: [
      { name: 'value1', type: 'number | string', required: true },
      { name: 'value2', type: 'number | string', required: true },
    ],
    returns: 'boolean',
    examples: [
      { expression: 'lessOrEquals(5, 10)', result: 'true' },
      { expression: 'lessOrEquals(5, 5)', result: 'true' },
    ],
    docsUrl: `${BASE}#lessOrEquals`,
  },
  // Conversion functions
  int: {
    name: 'int',
    category: 'Conversion',
    description: 'Return the integer version for a string.',
    signature: 'int(value)',
    parameters: [{ name: 'value', type: 'string | number', required: true }],
    returns: 'integer',
    examples: [
      { expression: "int('123')", result: '123' },
      { expression: 'int(45.9)', result: '45' },
    ],
    docsUrl: `${BASE}#int`,
  },
  float: {
    name: 'float',
    category: 'Conversion',
    description: 'Return the floating-point number for an input value.',
    signature: 'float(value)',
    parameters: [{ name: 'value', type: 'string | number', required: true }],
    returns: 'number',
    examples: [
      { expression: "float('3.14')", result: '3.14' },
      { expression: "float('42')", result: '42' },
    ],
    docsUrl: `${BASE}#float`,
  },
  string: {
    name: 'string',
    category: 'Conversion',
    description: 'Return the string version for an input value.',
    signature: 'string(value)',
    parameters: [{ name: 'value', type: 'any', required: true }],
    returns: 'string',
    examples: [
      { expression: 'string(42)', result: "'42'" },
      { expression: 'string(true)', result: "'true'" },
    ],
    docsUrl: `${BASE}#string`,
  },
  bool: {
    name: 'bool',
    category: 'Conversion',
    description: 'Return the Boolean version for an input value.',
    signature: 'bool(value)',
    parameters: [{ name: 'value', type: 'any', required: true }],
    returns: 'boolean',
    examples: [
      { expression: "bool('true')", result: 'true' },
      { expression: 'bool(1)', result: 'true' },
    ],
    docsUrl: `${BASE}#bool`,
  },
  json: {
    name: 'json',
    category: 'Conversion',
    description: 'Return the JSON object or value for a string.',
    signature: 'json(string)',
    parameters: [{ name: 'string', type: 'string', required: true }],
    returns: 'object | array',
    examples: [
      { expression: "json('{\"a\": 1}')", result: "{ a: 1 }" },
      { expression: "json('[\"x\", \"y\"]')", result: "['x', 'y']" },
    ],
    docsUrl: `${BASE}#json`,
  },
  array: {
    name: 'array',
    category: 'Conversion',
    description: 'Return an array from a single specified input.',
    signature: 'array(value)',
    parameters: [{ name: 'value', type: 'any', required: true }],
    returns: 'array',
    examples: [
      { expression: "array('hello')", result: "['hello']" },
      { expression: 'array(42)', result: '[42]' },
    ],
    docsUrl: `${BASE}#array`,
  },
  createArray: {
    name: 'createArray',
    category: 'Conversion',
    description: 'Return an array from multiple inputs.',
    signature: 'createArray(value1, value2, ...)',
    parameters: [{ name: '...', type: 'any', required: false }],
    returns: 'array',
    examples: [
      { expression: "createArray('a', 'b', 'c')", result: "['a', 'b', 'c']" },
      { expression: 'createArray(1, 2, 3)', result: '[1, 2, 3]' },
    ],
    docsUrl: `${BASE}#createArray`,
  },
  // Collection functions
  first: {
    name: 'first',
    category: 'Collection',
    description: 'Return the first item from a string or array.',
    signature: 'first(collection)',
    parameters: [{ name: 'collection', type: 'string | array', required: true }],
    returns: 'string | any',
    examples: [
      { expression: "first('hello')", result: "'h'" },
      { expression: "first(createArray('a', 'b', 'c'))", result: "'a'" },
    ],
    docsUrl: `${BASE}#first`,
  },
  last: {
    name: 'last',
    category: 'Collection',
    description: 'Return the last item from a string or array.',
    signature: 'last(collection)',
    parameters: [{ name: 'collection', type: 'string | array', required: true }],
    returns: 'string | any',
    examples: [
      { expression: "last('hello')", result: "'o'" },
      { expression: "last(createArray('a', 'b', 'c'))", result: "'c'" },
    ],
    docsUrl: `${BASE}#last`,
  },
  join: {
    name: 'join',
    category: 'Collection',
    description: 'Return a string that has all items from an array, separated by the specified delimiter.',
    signature: 'join(array, delimiter)',
    parameters: [
      { name: 'array', type: 'array', required: true },
      { name: 'delimiter', type: 'string', required: true },
    ],
    returns: 'string',
    examples: [
      { expression: "join(createArray('a', 'b', 'c'), ', ')", result: "'a, b, c'" },
      { expression: "join(createArray(1, 2, 3), '-')", result: "'1-2-3'" },
    ],
    docsUrl: `${BASE}#join`,
  },
  take: {
    name: 'take',
    category: 'Collection',
    description: 'Return items from the front of a collection.',
    signature: 'take(collection, count)',
    parameters: [
      { name: 'collection', type: 'string | array', required: true },
      { name: 'count', type: 'integer', required: true },
    ],
    returns: 'string | array',
    examples: [
      { expression: "take('hello', 2)", result: "'he'" },
      { expression: "take(createArray('a', 'b', 'c'), 2)", result: "['a', 'b']" },
    ],
    docsUrl: `${BASE}#take`,
  },
  skip: {
    name: 'skip',
    category: 'Collection',
    description: 'Remove items from the front of a collection and return all the other items.',
    signature: 'skip(collection, count)',
    parameters: [
      { name: 'collection', type: 'string | array', required: true },
      { name: 'count', type: 'integer', required: true },
    ],
    returns: 'string | array',
    examples: [
      { expression: "skip('hello', 2)", result: "'llo'" },
      { expression: "skip(createArray('a', 'b', 'c'), 2)", result: "['c']" },
    ],
    docsUrl: `${BASE}#skip`,
  },
  contains: {
    name: 'contains',
    category: 'Collection',
    description: 'Check whether a collection has a specific item.',
    signature: 'contains(collection, value)',
    parameters: [
      { name: 'collection', type: 'string | array | object', required: true },
      { name: 'value', type: 'any', required: true },
    ],
    returns: 'boolean',
    examples: [
      { expression: "contains('hello', 'ell')", result: 'true' },
      { expression: "contains(createArray('a', 'b'), 'a')", result: 'true' },
    ],
    docsUrl: `${BASE}#contains`,
  },
  empty: {
    name: 'empty',
    category: 'Collection',
    description: 'Check whether a collection is empty.',
    signature: 'empty(collection)',
    parameters: [{ name: 'collection', type: 'string | array | object', required: true }],
    returns: 'boolean',
    examples: [
      { expression: "empty('')", result: 'true' },
      { expression: "empty('hello')", result: 'false' },
    ],
    docsUrl: `${BASE}#empty`,
  },
  union: {
    name: 'union',
    category: 'Collection',
    description: 'Return a collection that has all items from the specified collections.',
    signature: 'union(collection1, collection2, ...)',
    parameters: [
      { name: 'collection1', type: 'array', required: true },
      { name: 'collection2', type: 'array', required: true },
      { name: '...', type: 'array', required: false },
    ],
    returns: 'array',
    examples: [
      { expression: 'union(createArray(1, 2), createArray(2, 3))', result: '[1, 2, 3]' },
      { expression: "union(createArray('a'), createArray('b'))", result: "['a', 'b']" },
    ],
    docsUrl: `${BASE}#union`,
  },
  intersection: {
    name: 'intersection',
    category: 'Collection',
    description: 'Return a collection that has only the common items across the specified collections.',
    signature: 'intersection(collection1, collection2, ...)',
    parameters: [
      { name: 'collection1', type: 'array', required: true },
      { name: 'collection2', type: 'array', required: true },
      { name: '...', type: 'array', required: false },
    ],
    returns: 'array',
    examples: [
      { expression: 'intersection(createArray(1, 2), createArray(2, 3))', result: '[2]' },
      { expression: "intersection(createArray('a', 'b'), createArray('b', 'c'))", result: "['b']" },
    ],
    docsUrl: `${BASE}#intersection`,
  },
  // DateTime functions
  utcNow: {
    name: 'utcNow',
    category: 'DateTime',
    description: 'Return the current timestamp as a string.',
    signature: 'utcNow(format?)',
    parameters: [{ name: 'format', type: 'string', required: false }],
    returns: 'string',
    examples: [
      { expression: "utcNow('yyyy-MM-dd')", result: "'2025-02-16' (current date)" },
      { expression: 'utcNow()', result: "'2025-02-16T14:30:00Z' (ISO timestamp)" },
    ],
    docsUrl: `${BASE}#utcNow`,
  },
  addDays: {
    name: 'addDays',
    category: 'DateTime',
    description: 'Add a number of days to a timestamp.',
    signature: 'addDays(timestamp, days, format?)',
    parameters: [
      { name: 'timestamp', type: 'string', required: true },
      { name: 'days', type: 'integer', required: true },
      { name: 'format', type: 'string', required: false },
    ],
    returns: 'string',
    examples: [
      { expression: "addDays('2025-02-16', 7, 'yyyy-MM-dd')", result: "'2025-02-23'" },
      { expression: "addDays('2025-01-31', 3, 'yyyy-MM-dd')", result: "'2025-02-03'" },
    ],
    docsUrl: `${BASE}#addDays`,
  },
  addHours: {
    name: 'addHours',
    category: 'DateTime',
    description: 'Add a number of hours to a timestamp.',
    signature: 'addHours(timestamp, hours, format?)',
    parameters: [
      { name: 'timestamp', type: 'string', required: true },
      { name: 'hours', type: 'integer', required: true },
      { name: 'format', type: 'string', required: false },
    ],
    returns: 'string',
    examples: [
      { expression: "addHours('2025-02-16T10:00:00', 2, 'yyyy-MM-ddTHH:mm:ss')", result: "'2025-02-16T12:00:00'" },
      { expression: "addHours('2025-02-16T23:00:00', 3)", result: "'2025-02-17T02:00:00'" },
    ],
    docsUrl: `${BASE}#addHours`,
  },
  formatDateTime: {
    name: 'formatDateTime',
    category: 'DateTime',
    description: 'Return the date from a timestamp in the specified format.',
    signature: 'formatDateTime(timestamp, format?)',
    parameters: [
      { name: 'timestamp', type: 'string', required: true },
      { name: 'format', type: 'string', required: false },
    ],
    returns: 'string',
    examples: [
      { expression: "formatDateTime('2025-02-16T14:30:00', 'yyyy-MM-dd')", result: "'2025-02-16'" },
      { expression: "formatDateTime('2025-02-16T14:30:00', 'HH:mm')", result: "'14:30'" },
    ],
    docsUrl: `${BASE}#formatDateTime`,
  },
  startOfDay: {
    name: 'startOfDay',
    category: 'DateTime',
    description: 'Return the start of the day for a timestamp.',
    signature: 'startOfDay(timestamp, format?)',
    parameters: [
      { name: 'timestamp', type: 'string', required: true },
      { name: 'format', type: 'string', required: false },
    ],
    returns: 'string',
    examples: [
      { expression: "startOfDay('2025-02-16T14:30:45', 'yyyy-MM-ddTHH:mm:ss')", result: "'2025-02-16T00:00:00'" },
      { expression: "startOfDay('2025-02-16T23:59:59')", result: "'2025-02-16T00:00:00'" },
    ],
    docsUrl: `${BASE}#startOfDay`,
  },
  // Workflow functions
  parameters: {
    name: 'parameters',
    category: 'Workflow',
    description: 'Return the value for a parameter that is defined in your workflow.',
    signature: "parameters(parameterName)",
    parameters: [{ name: 'parameterName', type: 'string', required: true }],
    returns: 'any',
    examples: [
      { expression: "parameters('firstName')", result: "Returns workflow parameter 'firstName' value" },
      { expression: "parameters('limit')", result: "Returns workflow parameter 'limit' value" },
    ],
    docsUrl: `${BASE}#parameters`,
  },
  variables: {
    name: 'variables',
    category: 'Workflow',
    description: 'Return the value for a specified variable.',
    signature: "variables(variableName)",
    parameters: [{ name: 'variableName', type: 'string', required: true }],
    returns: 'any',
    examples: [
      { expression: "variables('counter')", result: "Returns workflow variable 'counter' value" },
      { expression: "variables('items')", result: "Returns workflow variable 'items' value" },
    ],
    docsUrl: `${BASE}#variables`,
  },
  triggerBody: {
    name: 'triggerBody',
    category: 'Workflow',
    description: 'Return the trigger\'s body output at runtime.',
    signature: 'triggerBody()',
    parameters: [],
    returns: 'any',
    examples: [
      { expression: "triggerBody()?['property']", result: "Returns 'property' from trigger body" },
      { expression: 'triggerBody()', result: 'Returns full trigger body object' },
    ],
    docsUrl: `${BASE}#triggerBody`,
  },
};

export function getFunctionMetadata(name: string): FunctionMetadata | undefined {
  return FUNCTION_METADATA[name];
}

export function getAllFunctionNames(): string[] {
  return Object.keys(FUNCTION_METADATA);
}

export interface FunctionArity {
  min: number;
  max: number | null; // null = variadic (unbounded)
}

export function getFunctionArity(name: string): FunctionArity | undefined {
  const meta = FUNCTION_METADATA[name];
  if (!meta) return undefined;
  const params = meta.parameters;
  if (params.length === 0) return { min: 0, max: 0 };
  const hasVariadic = params.some((p) => p.name === '...');
  const min = params.filter((p) => p.required !== false).length;
  const max = hasVariadic ? null : params.length;
  return { min, max };
}

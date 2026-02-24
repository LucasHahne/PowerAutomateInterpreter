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

const BASE =
  "https://learn.microsoft.com/en-us/azure/logic-apps/workflow-definition-language-functions-reference";

export const FUNCTION_METADATA: Record<string, FunctionMetadata> = {
  // String functions
  concat: {
    name: "concat",
    category: "String",
    description: "Combine two or more strings and return the combined string.",
    signature: "concat(text1, text2, ...)",
    parameters: [
      { name: "text1", type: "string", required: true },
      { name: "text2", type: "string", required: true },
      { name: "...", type: "string", required: false },
    ],
    returns: "string",
    examples: [{ expression: "concat('Hello', 'World')", result: "\"HelloWorld\"" }],
    docsUrl: `${BASE}#concat`,
  },
  toLower: {
    name: "toLower",
    category: "String",
    description: "Return a string in lowercase format.",
    signature: "toLower(text)",
    parameters: [{ name: "text", type: "string", required: true }],
    returns: "string",
    examples: [
      { expression: "toLower('Hello')", result: "\"hello\"" },
      { expression: "toLower('POWER AUTOMATE')", result: "'power automate'" },
    ],
    docsUrl: `${BASE}#toLower`,
  },
  toUpper: {
    name: "toUpper",
    category: "String",
    description: "Return a string in uppercase format.",
    signature: "toUpper(text)",
    parameters: [{ name: "text", type: "string", required: true }],
    returns: "string",
    examples: [
      { expression: "toUpper('hello')", result: "'HELLO'" },
      { expression: "toUpper('yes')", result: "'YES'" },
    ],
    docsUrl: `${BASE}#toUpper`,
  },
  length: {
    name: "length",
    category: "String",
    description: "Return the number of items in a string or array.",
    signature: "length(collection)",
    parameters: [
      { name: "collection", type: "string | array", required: true },
    ],
    returns: "integer",
    examples: [
      { expression: "length('abcd')", result: "4" },
      { expression: "length(createArray(0, 1, 2, 3))", result: "4" },
    ],
    docsUrl: `${BASE}#length`,
  },
  indexOf: {
    name: "indexOf",
    category: "String",
    description:
      "Return the index of the first occurrence of a substring (case-insensitive).",
    signature: "indexOf(text, searchText)",
    parameters: [
      { name: "text", type: "string", required: true },
      { name: "searchText", type: "string", required: true },
    ],
    returns: "integer",
    examples: [
      { expression: "indexOf('hello world', 'world')", result: "6" },
      { expression: "indexOf('hello', 'xyz')", result: "-1" },
    ],
    docsUrl: `${BASE}#indexof`,
  },
  slice: {
    name: "slice",
    category: "String",
    description:
      "Return a substring from the specified start index to the end index (exclusive).",
    signature: "slice(text, startIndex, endIndex?)",
    parameters: [
      { name: "text", type: "string", required: true },
      { name: "startIndex", type: "integer", required: true },
      { name: "endIndex", type: "integer", required: false },
    ],
    returns: "string",
    examples: [
      { expression: "slice('Hello World', 2)", result: "'llo World'" },
      { expression: "slice('Hello World', 2, 5)", result: "'llo'" },
    ],
    docsUrl: `${BASE}#slice`,
  },
  substring: {
    name: "substring",
    category: "String",
    description:
      "Return characters from a string, starting from the specified position.",
    signature: "substring(text, startIndex, length?)",
    parameters: [
      { name: "text", type: "string", required: true },
      { name: "startIndex", type: "integer", required: true },
      { name: "length", type: "integer", required: false },
    ],
    returns: "string",
    examples: [
      { expression: "substring('hello world', 6, 5)", result: "\"world\"" },
    ],
    docsUrl: `${BASE}#substring`,
  },
  split: {
    name: "split",
    category: "String",
    description:
      "Return an array containing substrings separated by the specified delimiter.",
    signature: "split(text, delimiter)",
    parameters: [
      { name: "text", type: "string", required: true },
      { name: "delimiter", type: "string", required: true },
    ],
    returns: "array",
    examples: [
      { expression: "split('a,b,c', ',')", result: "['a', 'b', 'c']" },
      {
        expression: "split('one-two-three', '-')",
        result: "['one', 'two', 'three']",
      },
    ],
    docsUrl: `${BASE}#split`,
  },
  replace: {
    name: "replace",
    category: "String",
    description:
      "Replace a substring with the specified string and return the updated string.",
    signature: "replace(text, oldString, newString)",
    parameters: [
      { name: "text", type: "string", required: true },
      { name: "oldString", type: "string", required: true },
      { name: "newString", type: "string", required: true },
    ],
    returns: "string",
    examples: [
      {
        expression: "replace('the old string', 'old', 'new')",
        result: "\"the new string\"",
      },
    ],
    docsUrl: `${BASE}#replace`,
  },
  trim: {
    name: "trim",
    category: "String",
    description:
      "Remove leading and trailing whitespace from a string and return the updated string.",
    signature: "trim(text)",
    parameters: [{ name: "text", type: "string", required: true }],
    returns: "string",
    examples: [
      { expression: "trim(' Hello World  ')", result: "\"Hello World\"" },
    ],
    docsUrl: `${BASE}#trim`,
  },
  startsWith: {
    name: "startsWith",
    category: "String",
    description:
      "Check whether a string starts with the specified substring (case-insensitive).",
    signature: "startsWith(text, searchText)",
    parameters: [
      { name: "text", type: "string", required: true },
      { name: "searchText", type: "string", required: true },
    ],
    returns: "boolean",
    examples: [
      { expression: "startsWith('hello', 'he')", result: "true" },
      { expression: "startsWith('hello', 'lo')", result: "false" },
    ],
    docsUrl: `${BASE}#startswith`,
  },
  endsWith: {
    name: "endsWith",
    category: "String",
    description:
      "Check whether a string ends with the specified substring (case-insensitive).",
    signature: "endsWith(text, searchText)",
    parameters: [
      { name: "text", type: "string", required: true },
      { name: "searchText", type: "string", required: true },
    ],
    returns: "boolean",
    examples: [
      { expression: "endsWith('hello world', 'world')", result: "true" },
      { expression: "endsWith('hello world', 'universe')", result: "false" },
    ],
    docsUrl: `${BASE}#endswith`,
  },
  formatNumber: {
    name: "formatNumber",
    category: "String",
    description:
      "Return a number as a string based on the specified format.",
    signature: "formatNumber(number, format, locale?)",
    parameters: [
      { name: "number", type: "integer | double", required: true },
      { name: "format", type: "string", required: true },
      { name: "locale", type: "string", required: false },
    ],
    returns: "string",
    examples: [
      {
        expression: "formatNumber(1234567890, '#,##0.00', 'en-US')",
        result: "\"1,234,567,890.00\"",
      },
      {
        expression: "formatNumber(1234567890, '#,##0.00', 'is-IS')",
        result: "\"1.234.567.890,00\"",
      },
      { expression: "formatNumber(17.35, 'C2')", result: "\"$17.35\"" },
      {
        expression: "formatNumber(17.35, 'C2', 'is-IS')",
        result: "\"17,35 kr.\"",
      },
    ],
    docsUrl: `${BASE}#formatNumber`,
  },
  isFloat: {
    name: "isFloat",
    category: "String",
    description:
      "Return a boolean indicating whether a string is a floating-point number.",
    signature: "isFloat(string, locale?)",
    parameters: [
      { name: "string", type: "string", required: true },
      { name: "locale", type: "string", required: false },
    ],
    returns: "boolean",
    examples: [
      { expression: "isFloat('10,000.00')", result: "true" },
      { expression: "isFloat('10.000,00', 'de-DE')", result: "true" },
    ],
    docsUrl: `${BASE}#isFloat`,
  },
  isInt: {
    name: "isInt",
    category: "String",
    description:
      "Return a boolean indicating whether a string is an integer.",
    signature: "isInt(string)",
    parameters: [{ name: "string", type: "string", required: true }],
    returns: "boolean",
    examples: [
      { expression: "isInt('10')", result: "true" },
      { expression: "isInt('12.5')", result: "false" },
    ],
    docsUrl: `${BASE}#isInt`,
  },
  lastIndexOf: {
    name: "lastIndexOf",
    category: "String",
    description:
      "Return the starting position for the last occurrence of a substring (case-insensitive).",
    signature: "lastIndexOf(text, searchText)",
    parameters: [
      { name: "text", type: "string", required: true },
      { name: "searchText", type: "string", required: true },
    ],
    returns: "integer",
    examples: [
      {
        expression: "lastIndexOf('hello world hello world', 'world')",
        result: "18",
      },
    ],
    docsUrl: `${BASE}#lastindexof`,
  },
  nthIndexOf: {
    name: "nthIndexOf",
    category: "String",
    description:
      "Return the position where the nth occurrence of a substring appears.",
    signature: "nthIndexOf(text, searchText, occurrence)",
    parameters: [
      { name: "text", type: "string", required: true },
      { name: "searchText", type: "string", required: true },
      { name: "occurrence", type: "integer", required: true },
    ],
    returns: "integer",
    examples: [
      {
        expression: "nthIndexOf('123456789123465789', '1', 2)",
        result: "9",
      },
    ],
    docsUrl: `${BASE}#nthIndexOf`,
  },
  guid: {
    name: "guid",
    category: "String",
    description: "Generate a globally unique identifier (GUID) as a string.",
    signature: "guid()",
    parameters: [],
    returns: "string",
    examples: [
      {
        expression: "guid()",
        result: "\"c2ecc88d-88c8-4096-912c-d6f2e2b138ce\" (example)",
      },
      {
        expression: "guid('P')",
        result: "\"(c2ecc88d-88c8-4096-912c-d6f2e2b138ce)\" (example)",
      },
    ],
    docsUrl: `${BASE}#guid`,
  },
  // Math functions
  add: {
    name: "add",
    category: "Math",
    description: "Return the result from adding two numbers.",
    signature: "add(summand1, summand2)",
    parameters: [
      { name: "summand1", type: "number", required: true },
      { name: "summand2", type: "number", required: true },
    ],
    returns: "number",
    examples: [{ expression: "add(1, 1.5)", result: "2.5" }],
    docsUrl: `${BASE}#add`,
  },
  sub: {
    name: "sub",
    category: "Math",
    description:
      "Return the result from subtracting the second number from the first.",
    signature: "sub(minuend, subtrahend)",
    parameters: [
      { name: "minuend", type: "number", required: true },
      { name: "subtrahend", type: "number", required: true },
    ],
    returns: "number",
    examples: [{ expression: "sub(10.3, 0.3)", result: "10" }],
    docsUrl: `${BASE}#sub`,
  },
  mul: {
    name: "mul",
    category: "Math",
    description: "Return the product from multiplying two numbers.",
    signature: "mul(multiplicand1, multiplicand2)",
    parameters: [
      { name: "multiplicand1", type: "number", required: true },
      { name: "multiplicand2", type: "number", required: true },
    ],
    returns: "number",
    examples: [
      { expression: "mul(1, 2)", result: "2" },
      { expression: "mul(1.5, 2)", result: "3" },
    ],
    docsUrl: `${BASE}#mul`,
  },
  div: {
    name: "div",
    category: "Math",
    description: "Return the result from dividing two numbers.",
    signature: "div(dividend, divisor)",
    parameters: [
      { name: "dividend", type: "number", required: true },
      { name: "divisor", type: "number", required: true },
    ],
    returns: "number",
    examples: [
      { expression: "div(10, 5)", result: "2" },
      { expression: "div(11, 5)", result: "2" },
      { expression: "div(11, 5.0)", result: "2.2" },
      { expression: "div(11.0, 5)", result: "2.2" },
    ],
    docsUrl: `${BASE}#div`,
  },
  mod: {
    name: "mod",
    category: "Math",
    description: "Return the remainder from dividing two numbers.",
    signature: "mod(dividend, divisor)",
    parameters: [
      { name: "dividend", type: "number", required: true },
      { name: "divisor", type: "number", required: true },
    ],
    returns: "number",
    examples: [
      { expression: "mod(3, 2)", result: "1" },
      { expression: "mod(-5, 2)", result: "-1" },
      { expression: "mod(4, -3)", result: "1" },
    ],
    docsUrl: `${BASE}#mod`,
  },
  min: {
    name: "min",
    category: "Math",
    description: "Return the lowest value from a set of numbers or an array.",
    signature: "min(number1, number2, ...) or min(array)",
    parameters: [
      { name: "numbers or array", type: "number | array", required: true },
      { name: "...", type: "number", required: false },
    ],
    returns: "number",
    examples: [
      { expression: "min(1, 5, 3)", result: "1" },
      { expression: "min(createArray(10, 2, 8))", result: "2" },
    ],
    docsUrl: `${BASE}#min`,
  },
  max: {
    name: "max",
    category: "Math",
    description: "Return the highest value from a set of numbers or an array.",
    signature: "max(number1, number2, ...) or max(array)",
    parameters: [
      { name: "numbers or array", type: "number | array", required: true },
      { name: "...", type: "number", required: false },
    ],
    returns: "number",
    examples: [
      { expression: "max(1, 5, 3)", result: "5" },
      { expression: "max(createArray(10, 2, 8))", result: "10" },
    ],
    docsUrl: `${BASE}#max`,
  },
  range: {
    name: "range",
    category: "Math",
    description:
      "Return an integer array that starts from a specified integer.",
    signature: "range(startIndex, count)",
    parameters: [
      { name: "startIndex", type: "integer", required: true },
      { name: "count", type: "integer", required: true },
    ],
    returns: "array",
    examples: [
      { expression: "range(1, 4)", result: "[1, 2, 3, 4]" },
      { expression: "range(0, 3)", result: "[0, 1, 2]" },
    ],
    docsUrl: `${BASE}#range`,
  },
  rand: {
    name: "rand",
    category: "Math",
    description:
      "Return a random integer from a specified range (min inclusive, max exclusive).",
    signature: "rand(minValue, maxValue)",
    parameters: [
      { name: "minValue", type: "integer", required: true },
      { name: "maxValue", type: "integer", required: true },
    ],
    returns: "integer",
    examples: [
      { expression: "rand(1, 5)", result: "1, 2, 3, or 4" },
    ],
    docsUrl: `${BASE}#rand`,
  },
  // Logical functions
  and: {
    name: "and",
    category: "Logical",
    description: "Check whether all expressions are true.",
    signature: "and(expression1, expression2, ...)",
    parameters: [
      { name: "expression1", type: "boolean", required: true },
      { name: "expression2", type: "boolean", required: true },
      { name: "...", type: "boolean", required: false },
    ],
    returns: "boolean",
    examples: [
      { expression: "and(equals(1, 1), equals(2, 2))", result: "true" },
      { expression: "and(equals(1, 2), equals(2, 2))", result: "false" },
    ],
    docsUrl: `${BASE}#and`,
  },
  or: {
    name: "or",
    category: "Logical",
    description: "Check whether at least one expression is true.",
    signature: "or(expression1, expression2, ...)",
    parameters: [
      { name: "expression1", type: "boolean", required: true },
      { name: "expression2", type: "boolean", required: true },
      { name: "...", type: "boolean", required: false },
    ],
    returns: "boolean",
    examples: [
      { expression: "or(equals(1, 2), equals(2, 2))", result: "true" },
      { expression: "or(equals(1, 2), equals(2, 3))", result: "false" },
    ],
    docsUrl: `${BASE}#or`,
  },
  not: {
    name: "not",
    category: "Logical",
    description: "Check whether an expression is false.",
    signature: "not(expression)",
    parameters: [{ name: "expression", type: "boolean", required: true }],
    returns: "boolean",
    examples: [
      { expression: "not(equals(1, 2))", result: "true" },
      { expression: "not(equals(1, 1))", result: "false" },
    ],
    docsUrl: `${BASE}#not`,
  },
  equals: {
    name: "equals",
    category: "Logical",
    description: "Check whether both values are equivalent.",
    signature: "equals(object1, object2)",
    parameters: [
      { name: "object1", type: "any", required: true },
      { name: "object2", type: "any", required: true },
    ],
    returns: "boolean",
    examples: [
      { expression: "equals(true, 1)", result: "true" },
      { expression: "equals('abc', 'abcd')", result: "false" },
    ],
    docsUrl: `${BASE}#equals`,
  },
  if: {
    name: "if",
    category: "Logical",
    description:
      "Check whether an expression is true or false. Return a specified value based on the result.",
    signature: "if(expression, valueIfTrue, valueIfFalse)",
    parameters: [
      { name: "expression", type: "boolean", required: true },
      { name: "valueIfTrue", type: "any", required: true },
      { name: "valueIfFalse", type: "any", required: true },
    ],
    returns: "any",
    examples: [
      { expression: "if(equals(1, 1), 'yes', 'no')", result: "'yes'" },
      { expression: "if(greater(5, 10), 'big', 'small')", result: "'small'" },
    ],
    docsUrl: `${BASE}#if`,
  },
  greater: {
    name: "greater",
    category: "Logical",
    description: "Check whether the first value is greater than the second.",
    signature: "greater(value1, value2)",
    parameters: [
      { name: "value1", type: "number | string", required: true },
      { name: "value2", type: "number | string", required: true },
    ],
    returns: "boolean",
    examples: [
      { expression: "greater(10, 5)", result: "true" },
      { expression: "greater('b', 'a')", result: "true" },
    ],
    docsUrl: `${BASE}#greater`,
  },
  less: {
    name: "less",
    category: "Logical",
    description: "Check whether the first value is less than the second.",
    signature: "less(value1, value2)",
    parameters: [
      { name: "value1", type: "number | string", required: true },
      { name: "value2", type: "number | string", required: true },
    ],
    returns: "boolean",
    examples: [
      { expression: "less(5, 10)", result: "true" },
      { expression: "less('banana', 'apple')", result: "false" },
    ],
    docsUrl: `${BASE}#less`,
  },
  greaterOrEquals: {
    name: "greaterOrEquals",
    category: "Logical",
    description:
      "Check whether the first value is greater than or equal to the second.",
    signature: "greaterOrEquals(value1, value2)",
    parameters: [
      { name: "value1", type: "number | string", required: true },
      { name: "value2", type: "number | string", required: true },
    ],
    returns: "boolean",
    examples: [
      { expression: "greaterOrEquals(5, 5)", result: "true" },
      { expression: "greaterOrEquals(3, 5)", result: "false" },
    ],
    docsUrl: `${BASE}#greaterOrEquals`,
  },
  lessOrEquals: {
    name: "lessOrEquals",
    category: "Logical",
    description:
      "Check whether the first value is less than or equal to the second.",
    signature: "lessOrEquals(value1, value2)",
    parameters: [
      { name: "value1", type: "number | string", required: true },
      { name: "value2", type: "number | string", required: true },
    ],
    returns: "boolean",
    examples: [
      { expression: "lessOrEquals(5, 10)", result: "true" },
      { expression: "lessOrEquals(5, 5)", result: "true" },
    ],
    docsUrl: `${BASE}#lessOrEquals`,
  },
  coalesce: {
    name: "coalesce",
    category: "Logical",
    description: "Return the first non-null value from one or more arguments.",
    signature: "coalesce(object_1, object_2, ...)",
    parameters: [
      { name: "object_1", type: "any", required: true },
      { name: "object_2", type: "any", required: false },
      { name: "...", type: "any", required: false },
    ],
    returns: "any",
    examples: [
      { expression: "coalesce(null, true, false)", result: "true" },
      { expression: "coalesce(null, 'hello', 'world')", result: "\"hello\"" },
      { expression: "coalesce(null, null, null)", result: "null" },
    ],
    docsUrl: `${BASE}#coalesce`,
  },
  addProperty: {
    name: "addProperty",
    category: "Manipulation",
    description: "Add a property and its value to an object. Throws if the property exists.",
    signature: "addProperty(object, property, value)",
    parameters: [
      { name: "object", type: "object", required: true },
      { name: "property", type: "string", required: true },
      { name: "value", type: "any", required: true },
    ],
    returns: "object",
    examples: [
      {
        expression: "addProperty(json('{\"firstName\": \"Sophia\", \"lastName\": \"Owen\"}'), 'middleName', 'Anne')",
        result: "{ firstName: 'Sophia', lastName: 'Owen', middleName: 'Anne' }",
      },
    ],
    docsUrl: `${BASE}#addProperty`,
  },
  removeProperty: {
    name: "removeProperty",
    category: "Manipulation",
    description: "Remove a property from an object.",
    signature: "removeProperty(object, property)",
    parameters: [
      { name: "object", type: "object", required: true },
      { name: "property", type: "string", required: true },
    ],
    returns: "object",
    examples: [
      {
        expression: "removeProperty(json('{ \"firstName\": \"Sophia\", \"middleName\": \"Anne\", \"surName\": \"Owen\" }'), 'middleName')",
        result: "{ firstName: 'Sophia', surName: 'Owen' }",
      },
    ],
    docsUrl: `${BASE}#removeProperty`,
  },
  setProperty: {
    name: "setProperty",
    category: "Manipulation",
    description: "Set a property on an object (add or overwrite).",
    signature: "setProperty(object, property, value)",
    parameters: [
      { name: "object", type: "object", required: true },
      { name: "property", type: "string", required: true },
      { name: "value", type: "any", required: true },
    ],
    returns: "object",
    examples: [
      {
        expression: "setProperty(json('{\"firstName\": \"Sophia\", \"surName\": \"Owen\"}'), 'surName', 'Hartnett')",
        result: "{ firstName: 'Sophia', surName: 'Hartnett' }",
      },
    ],
    docsUrl: `${BASE}#setProperty`,
  },
  // Conversion functions
  int: {
    name: "int",
    category: "Conversion",
    description: "Return the integer version for a string.",
    signature: "int(value)",
    parameters: [{ name: "value", type: "string | number", required: true }],
    returns: "integer",
    examples: [
      { expression: "int('10')", result: "10" },
      { expression: "int(45.9)", result: "45" },
    ],
    docsUrl: `${BASE}#int`,
  },
  float: {
    name: "float",
    category: "Conversion",
    description: "Return the floating-point number for an input value.",
    signature: "float(value, locale?)",
    parameters: [
      { name: "value", type: "string | number", required: true },
      { name: "locale", type: "string", required: false },
    ],
    returns: "number",
    examples: [
      { expression: "float('10,000.333')", result: "10000.333" },
      { expression: "float('10.000,333', 'de-DE')", result: "10000.333" },
    ],
    docsUrl: `${BASE}#float`,
  },
  string: {
    name: "string",
    category: "Conversion",
    description: "Return the string version for an input value.",
    signature: "string(value)",
    parameters: [{ name: "value", type: "any", required: true }],
    returns: "string",
    examples: [
      { expression: "string(42)", result: "'42'" },
      { expression: "string(true)", result: "'true'" },
    ],
    docsUrl: `${BASE}#string`,
  },
  bool: {
    name: "bool",
    category: "Conversion",
    description: "Return the Boolean version for an input value.",
    signature: "bool(value)",
    parameters: [{ name: "value", type: "any", required: true }],
    returns: "boolean",
    examples: [
      { expression: "bool(1)", result: "true" },
      { expression: "bool(0)", result: "false" },
      { expression: "bool('true')", result: "true" },
      { expression: "bool('false')", result: "false" },
    ],
    docsUrl: `${BASE}#bool`,
  },
  json: {
    name: "json",
    category: "Conversion",
    description: "Return the JSON object or value for a string.",
    signature: "json(string)",
    parameters: [{ name: "string", type: "string", required: true }],
    returns: "object | array",
    examples: [
      { expression: "json('[1, 2, 3]')", result: "[1, 2, 3]" },
      { expression: "json('{\"fullName\": \"Sophia Owen\"}')", result: "{ fullName: 'Sophia Owen' }" },
    ],
    docsUrl: `${BASE}#json`,
  },
  array: {
    name: "array",
    category: "Conversion",
    description: "Return an array from a single specified input.",
    signature: "array(value)",
    parameters: [{ name: "value", type: "any", required: true }],
    returns: "array",
    examples: [{ expression: "array('hello')", result: "[\"hello\"]" }],
    docsUrl: `${BASE}#array`,
  },
  createArray: {
    name: "createArray",
    category: "Conversion",
    description: "Return an array from multiple inputs.",
    signature: "createArray(value1, value2, ...)",
    parameters: [{ name: "...", type: "any", required: false }],
    returns: "array",
    examples: [
      { expression: "createArray('h', 'e', 'l', 'l', 'o')", result: "[\"h\", \"e\", \"l\", \"l\", \"o\"]" },
    ],
    docsUrl: `${BASE}#createArray`,
  },
  base64: {
    name: "base64",
    category: "Conversion",
    description: "Return the base64-encoded version for a string.",
    signature: "base64(value)",
    parameters: [{ name: "value", type: "string", required: true }],
    returns: "string",
    examples: [{ expression: "base64('hello')", result: "'aGVsbG8='" }],
    docsUrl: `${BASE}#base64`,
  },
  base64ToString: {
    name: "base64ToString",
    category: "Conversion",
    description: "Return the string version for a base64-encoded string.",
    signature: "base64ToString(value)",
    parameters: [{ name: "value", type: "string", required: true }],
    returns: "string",
    examples: [{ expression: "base64ToString('aGVsbG8=')", result: "'hello'" }],
    docsUrl: `${BASE}#base64ToString`,
  },
  base64ToBinary: {
    name: "base64ToBinary",
    category: "Conversion",
    description: "Return the binary version for a base64-encoded string.",
    signature: "base64ToBinary(value)",
    parameters: [{ name: "value", type: "string", required: true }],
    returns: "string",
    examples: [
      {
        expression: "base64ToBinary('aGVsbG8=')",
        result: "\"0110100001100101011011000110110001101111\"",
      },
    ],
    docsUrl: `${BASE}#base64ToBinary`,
  },
  binary: {
    name: "binary",
    category: "Conversion",
    description: "Return the base64-encoded version for a string (same as base64).",
    signature: "binary(value)",
    parameters: [{ name: "value", type: "string", required: true }],
    returns: "string",
    examples: [{ expression: "binary('hello')", result: "'aGVsbG8='" }],
    docsUrl: `${BASE}#binary`,
  },
  decodeUriComponent: {
    name: "decodeUriComponent",
    category: "Conversion",
    description: "Return a string that replaces escape characters with decoded versions.",
    signature: "decodeUriComponent(value)",
    parameters: [{ name: "value", type: "string", required: true }],
    returns: "string",
    examples: [
      {
        expression: "decodeUriComponent('https%3A%2F%2Fcontoso.com')",
        result: "'https://contoso.com'",
      },
    ],
    docsUrl: `${BASE}#decodeUriComponent`,
  },
  encodeUriComponent: {
    name: "encodeUriComponent",
    category: "Conversion",
    description: "Return a string that replaces URL-unsafe characters with escape characters.",
    signature: "encodeUriComponent(value)",
    parameters: [{ name: "value", type: "string", required: true }],
    returns: "string",
    examples: [
      {
        expression: "encodeUriComponent('https://contoso.com')",
        result: "'https%3A%2F%2Fcontoso.com'",
      },
    ],
    docsUrl: `${BASE}#encodeUriComponent`,
  },
  uriComponent: {
    name: "uriComponent",
    category: "Conversion",
    description: "Return a URI-encoded version for a string (alias for encodeUriComponent).",
    signature: "uriComponent(value)",
    parameters: [{ name: "value", type: "string", required: true }],
    returns: "string",
    examples: [
      {
        expression: "uriComponent('https://contoso.com')",
        result: "'https%3A%2F%2Fcontoso.com'",
      },
    ],
    docsUrl: `${BASE}#uriComponent`,
  },
  uriComponentToString: {
    name: "uriComponentToString",
    category: "Conversion",
    description: "Return a decoded string for a URI-encoded string (alias for decodeUriComponent).",
    signature: "uriComponentToString(value)",
    parameters: [{ name: "value", type: "string", required: true }],
    returns: "string",
    examples: [
      {
        expression: "uriComponentToString('https%3A%2F%2Fcontoso.com')",
        result: "'https://contoso.com'",
      },
    ],
    docsUrl: `${BASE}#uriComponentToString`,
  },
  uriComponentToBinary: {
    name: "uriComponentToBinary",
    category: "Conversion",
    description: "Return the base64 string for a URI-encoded string.",
    signature: "uriComponentToBinary(value)",
    parameters: [{ name: "value", type: "string", required: true }],
    returns: "string",
    examples: [
      {
        expression: "uriComponentToBinary('https%3A%2F%2Fcontoso.com')",
        result: "'aHR0cHM6Ly9jb250b3NvLmNvbQ=='",
      },
    ],
    docsUrl: `${BASE}#uriComponentToBinary`,
  },
  dataUri: {
    name: "dataUri",
    category: "Conversion",
    description: "Return a data URI for a string.",
    signature: "dataUri(value)",
    parameters: [{ name: "value", type: "string", required: true }],
    returns: "string",
    examples: [
      {
        expression: "dataUri('hello')",
        result: "'data:text/plain;charset=utf-8;base64,aGVsbG8='",
      },
    ],
    docsUrl: `${BASE}#dataUri`,
  },
  dataUriToString: {
    name: "dataUriToString",
    category: "Conversion",
    description: "Return the string version for a data URI.",
    signature: "dataUriToString(value)",
    parameters: [{ name: "value", type: "string", required: true }],
    returns: "string",
    examples: [
      {
        expression: "dataUriToString('data:text/plain;charset=utf-8;base64,aGVsbG8=')",
        result: "'hello'",
      },
    ],
    docsUrl: `${BASE}#dataUriToString`,
  },
  dataUriToBinary: {
    name: "dataUriToBinary",
    category: "Conversion",
    description: "Return the binary version for a data URI.",
    signature: "dataUriToBinary(value)",
    parameters: [{ name: "value", type: "string", required: true }],
    returns: "string",
    examples: [
      {
        expression: "dataUriToBinary('data:text/plain;charset=utf-8;base64,aGVsbG8=')",
        result: "\"0110100001100101011011000110110001101111\"",
      },
    ],
    docsUrl: `${BASE}#dataUriToBinary`,
  },
  decodeDataUri: {
    name: "decodeDataUri",
    category: "Conversion",
    description: "Return the binary version for a data URI (alias for dataUriToBinary).",
    signature: "decodeDataUri(value)",
    parameters: [{ name: "value", type: "string", required: true }],
    returns: "string",
    examples: [
      {
        expression: "decodeDataUri('data:text/plain;charset=utf-8;base64,aGVsbG8=')",
        result: "\"0110100001100101011011000110110001101111\"",
      },
    ],
    docsUrl: `${BASE}#decodeDataUri`,
  },
  decimal: {
    name: "decimal",
    category: "Conversion",
    description: "Return the decimal number for a string.",
    signature: "decimal(value)",
    parameters: [{ name: "value", type: "string", required: true }],
    returns: "number",
    examples: [
      {
        expression: "decimal('1.2345678912312131')",
        result: "1.234567891231213",
      },
    ],
    docsUrl: `${BASE}#decimal`,
  },
  uriHost: {
    name: "uriHost",
    category: "Conversion",
    description: "Return the host value for a uniform resource identifier (URI).",
    signature: "uriHost(uri)",
    parameters: [{ name: "uri", type: "string", required: true }],
    returns: "string",
    examples: [
      {
        expression: "uriHost('https://www.localhost.com:8080')",
        result: "'www.localhost.com'",
      },
    ],
    docsUrl: `${BASE}#uriHost`,
  },
  uriPath: {
    name: "uriPath",
    category: "Conversion",
    description: "Return the path value for a URI.",
    signature: "uriPath(uri)",
    parameters: [{ name: "uri", type: "string", required: true }],
    returns: "string",
    examples: [
      {
        expression: "uriPath('https://www.contoso.com/catalog/shownew.htm?date=today')",
        result: "'/catalog/shownew.htm'",
      },
    ],
    docsUrl: `${BASE}#uriPath`,
  },
  uriPathAndQuery: {
    name: "uriPathAndQuery",
    category: "Conversion",
    description: "Return the path and query values for a URI.",
    signature: "uriPathAndQuery(uri)",
    parameters: [{ name: "uri", type: "string", required: true }],
    returns: "string",
    examples: [
      {
        expression: "uriPathAndQuery('https://www.contoso.com/catalog/shownew.htm?date=today')",
        result: "'/catalog/shownew.htm?date=today'",
      },
    ],
    docsUrl: `${BASE}#uriPathAndQuery`,
  },
  uriPort: {
    name: "uriPort",
    category: "Conversion",
    description: "Return the port value for a URI.",
    signature: "uriPort(uri)",
    parameters: [{ name: "uri", type: "string", required: true }],
    returns: "integer",
    examples: [
      {
        expression: "uriPort('https://www.localhost.com:8080')",
        result: "8080",
      },
    ],
    docsUrl: `${BASE}#uriPort`,
  },
  uriQuery: {
    name: "uriQuery",
    category: "Conversion",
    description: "Return the query value for a URI.",
    signature: "uriQuery(uri)",
    parameters: [{ name: "uri", type: "string", required: true }],
    returns: "string",
    examples: [
      {
        expression: "uriQuery('https://www.contoso.com/catalog/shownew.htm?date=today')",
        result: "'?date=today'",
      },
    ],
    docsUrl: `${BASE}#uriQuery`,
  },
  uriScheme: {
    name: "uriScheme",
    category: "Conversion",
    description: "Return the scheme value for a URI.",
    signature: "uriScheme(uri)",
    parameters: [{ name: "uri", type: "string", required: true }],
    returns: "string",
    examples: [
      {
        expression: "uriScheme('https://www.contoso.com')",
        result: "'https'",
      },
    ],
    docsUrl: `${BASE}#uriScheme`,
  },
  // Collection functions
  first: {
    name: "first",
    category: "Collection",
    description: "Return the first item from a string or array.",
    signature: "first(collection)",
    parameters: [
      { name: "collection", type: "string | array", required: true },
    ],
    returns: "string | any",
    examples: [
      { expression: "first('hello')", result: "\"h\"" },
      { expression: "first(createArray(0, 1, 2))", result: "0" },
    ],
    docsUrl: `${BASE}#first`,
  },
  last: {
    name: "last",
    category: "Collection",
    description: "Return the last item from a string or array.",
    signature: "last(collection)",
    parameters: [
      { name: "collection", type: "string | array", required: true },
    ],
    returns: "string | any",
    examples: [
      { expression: "last('abcd')", result: "\"d\"" },
      { expression: "last(createArray(0, 1, 2, 3))", result: "3" },
    ],
    docsUrl: `${BASE}#last`,
  },
  join: {
    name: "join",
    category: "Collection",
    description:
      "Return a string that has all items from an array, separated by the specified delimiter.",
    signature: "join(array, delimiter)",
    parameters: [
      { name: "array", type: "array", required: true },
      { name: "delimiter", type: "string", required: true },
    ],
    returns: "string",
    examples: [
      {
        expression: "join(createArray('a', 'b', 'c'), '.')",
        result: "\"a.b.c\"",
      },
    ],
    docsUrl: `${BASE}#join`,
  },
  take: {
    name: "take",
    category: "Collection",
    description: "Return items from the front of a collection.",
    signature: "take(collection, count)",
    parameters: [
      { name: "collection", type: "string | array", required: true },
      { name: "count", type: "integer", required: true },
    ],
    returns: "string | array",
    examples: [
      { expression: "take('hello', 2)", result: "'he'" },
      {
        expression: "take(createArray('a', 'b', 'c'), 2)",
        result: "['a', 'b']",
      },
    ],
    docsUrl: `${BASE}#take`,
  },
  skip: {
    name: "skip",
    category: "Collection",
    description:
      "Remove items from the front of a collection and return all the other items.",
    signature: "skip(collection, count)",
    parameters: [
      { name: "collection", type: "string | array", required: true },
      { name: "count", type: "integer", required: true },
    ],
    returns: "string | array",
    examples: [
      { expression: "skip('hello', 2)", result: "'llo'" },
      { expression: "skip(createArray('a', 'b', 'c'), 2)", result: "['c']" },
    ],
    docsUrl: `${BASE}#skip`,
  },
  contains: {
    name: "contains",
    category: "Collection",
    description: "Check whether a collection has a specific item.",
    signature: "contains(collection, value)",
    parameters: [
      { name: "collection", type: "string | array | object", required: true },
      { name: "value", type: "any", required: true },
    ],
    returns: "boolean",
    examples: [
      { expression: "contains('hello world', 'world')", result: "true" },
      { expression: "contains('hello world', 'universe')", result: "false" },
    ],
    docsUrl: `${BASE}#contains`,
  },
  empty: {
    name: "empty",
    category: "Collection",
    description: "Check whether a collection is empty.",
    signature: "empty(collection)",
    parameters: [
      { name: "collection", type: "string | array | object", required: true },
    ],
    returns: "boolean",
    examples: [
      { expression: "empty('')", result: "true" },
      { expression: "empty('abc')", result: "false" },
    ],
    docsUrl: `${BASE}#empty`,
  },
  union: {
    name: "union",
    category: "Collection",
    description:
      "Return a collection that has all items from the specified collections.",
    signature: "union(collection1, collection2, ...)",
    parameters: [
      { name: "collection1", type: "array", required: true },
      { name: "collection2", type: "array", required: true },
      { name: "...", type: "array", required: false },
    ],
    returns: "array",
    examples: [
      {
        expression: "union(createArray(1, 2), createArray(2, 3))",
        result: "[1, 2, 3]",
      },
      {
        expression: "union(createArray('a'), createArray('b'))",
        result: "['a', 'b']",
      },
    ],
    docsUrl: `${BASE}#union`,
  },
  intersection: {
    name: "intersection",
    category: "Collection",
    description:
      "Return a collection that has only the common items across the specified collections.",
    signature: "intersection(collection1, collection2, ...)",
    parameters: [
      { name: "collection1", type: "array", required: true },
      { name: "collection2", type: "array", required: true },
      { name: "...", type: "array", required: false },
    ],
    returns: "array",
    examples: [
      {
        expression: "intersection(createArray(1, 2, 3), createArray(101, 2, 1, 10), createArray(6, 8, 1, 2))",
        result: "[1, 2]",
      },
    ],
    docsUrl: `${BASE}#intersection`,
  },
  chunk: {
    name: "chunk",
    category: "Collection",
    description: "Split a string or array into chunks of equal length.",
    signature: "chunk(collection, length)",
    parameters: [
      { name: "collection", type: "string | array", required: true },
      { name: "length", type: "integer", required: true },
    ],
    returns: "array",
    examples: [
      {
        expression: "chunk('abcdefghijklmnopqrstuvwxyz', 10)",
        result: "['abcdefghij','klmnopqrst','uvwxyz']",
      },
      {
        expression: "chunk(createArray(1,2,3,4,5,6,7,8,9,10,11,12), 5)",
        result: "[[1,2,3,4,5],[6,7,8,9,10],[11,12]]",
      },
    ],
    docsUrl: `${BASE}#chunk`,
  },
  reverse: {
    name: "reverse",
    category: "Collection",
    description: "Reverse the order of items in a collection.",
    signature: "reverse(collection)",
    parameters: [
      { name: "collection", type: "string | array", required: true },
    ],
    returns: "string | array",
    examples: [
      { expression: "reverse('hello')", result: "'olleh'" },
      {
        expression: "reverse(createArray(0, 1, 2, 3))",
        result: "[3, 2, 1, 0]",
      },
    ],
    docsUrl: `${BASE}#reverse`,
  },
  sort: {
    name: "sort",
    category: "Collection",
    description:
      "Sort items in a collection. Optionally sort objects by a key.",
    signature: "sort(collection, sortBy?)",
    parameters: [
      { name: "collection", type: "array", required: true },
      { name: "sortBy", type: "string", required: false },
    ],
    returns: "array",
    examples: [
      { expression: "sort(createArray(2, 1, 0, 3))", result: "[0, 1, 2, 3]" },
      {
        expression:
          "sort(createArray(json('{\"n\":2}'), json('{\"n\":1}')), 'n')",
        result: "Sorted by 'n'",
      },
    ],
    docsUrl: `${BASE}#sort`,
  },
  // DateTime functions
  utcNow: {
    name: "utcNow",
    category: "DateTime",
    description: "Return the current timestamp as a string.",
    signature: "utcNow(format?)",
    parameters: [{ name: "format", type: "string", required: false }],
    returns: "string",
    examples: [
      {
        expression: "utcNow('yyyy-MM-dd')",
        result: "'2025-02-16' (current date)",
      },
      {
        expression: "utcNow()",
        result: "'2025-02-16T14:30:00Z' (ISO timestamp)",
      },
    ],
    docsUrl: `${BASE}#utcNow`,
  },
  addDays: {
    name: "addDays",
    category: "DateTime",
    description: "Add a number of days to a timestamp.",
    signature: "addDays(timestamp, days, format?)",
    parameters: [
      { name: "timestamp", type: "string", required: true },
      { name: "days", type: "integer", required: true },
      { name: "format", type: "string", required: false },
    ],
    returns: "string",
    examples: [
      {
        expression: "addDays('2018-03-15T00:00:00Z', 10)",
        result: "\"2018-03-25T00:00:00.0000000Z\"",
      },
      {
        expression: "addDays('2018-03-15T00:00:00Z', -5)",
        result: "\"2018-03-10T00:00:00.0000000Z\"",
      },
    ],
    docsUrl: `${BASE}#addDays`,
  },
  addHours: {
    name: "addHours",
    category: "DateTime",
    description: "Add a number of hours to a timestamp.",
    signature: "addHours(timestamp, hours, format?)",
    parameters: [
      { name: "timestamp", type: "string", required: true },
      { name: "hours", type: "integer", required: true },
      { name: "format", type: "string", required: false },
    ],
    returns: "string",
    examples: [
      {
        expression: "addHours('2018-03-15T00:00:00Z', 10)",
        result: "\"2018-03-15T10:00:00.0000000Z\"",
      },
      {
        expression: "addHours('2018-03-15T15:00:00Z', -5)",
        result: "\"2018-03-15T10:00:00.0000000Z\"",
      },
    ],
    docsUrl: `${BASE}#addHours`,
  },
  formatDateTime: {
    name: "formatDateTime",
    category: "DateTime",
    description: "Return the date from a timestamp in the specified format.",
    signature: "formatDateTime(timestamp, format?, locale?)",
    parameters: [
      { name: "timestamp", type: "string", required: true },
      { name: "format", type: "string", required: false },
      { name: "locale", type: "string", required: false },
    ],
    returns: "string",
    examples: [
      { expression: "formatDateTime('03/15/2018')", result: "'2018-03-15T00:00:00.0000000'" },
      { expression: "formatDateTime('03/15/2018 12:00:00', 'yyyy-MM-ddTHH:mm:ss')", result: "'2018-03-15T12:00:00'" },
      { expression: "formatDateTime('01/31/2016', 'dddd MMMM d')", result: "'Sunday January 31'" },
      { expression: "formatDateTime('01/31/2016', 'dddd MMMM d', 'fr-fr')", result: "'dimanche janvier 31'" },
    ],
    docsUrl: `${BASE}#formatDateTime`,
  },
  startOfDay: {
    name: "startOfDay",
    category: "DateTime",
    description: "Return the start of the day for a timestamp.",
    signature: "startOfDay(timestamp, format?)",
    parameters: [
      { name: "timestamp", type: "string", required: true },
      { name: "format", type: "string", required: false },
    ],
    returns: "string",
    examples: [
      {
        expression: "startOfDay('2025-02-16T14:30:45', 'yyyy-MM-ddTHH:mm:ss')",
        result: "'2025-02-16T00:00:00'",
      },
      {
        expression: "startOfDay('2025-02-16T23:59:59')",
        result: "'2025-02-16T00:00:00'",
      },
    ],
    docsUrl: `${BASE}#startOfDay`,
  },
  addMinutes: {
    name: "addMinutes",
    category: "DateTime",
    description: "Add a number of minutes to a timestamp.",
    signature: "addMinutes(timestamp, minutes, format?)",
    parameters: [
      { name: "timestamp", type: "string", required: true },
      { name: "minutes", type: "integer", required: true },
      { name: "format", type: "string", required: false },
    ],
    returns: "string",
    examples: [
      { expression: "addMinutes('2018-03-15T00:10:00Z', 10)", result: "\"2018-03-15T00:20:00.0000000Z\"" },
      { expression: "addMinutes('2018-03-15T00:20:00Z', -5)", result: "\"2018-03-15T00:15:00.0000000Z\"" },
    ],
    docsUrl: `${BASE}#addMinutes`,
  },
  addSeconds: {
    name: "addSeconds",
    category: "DateTime",
    description: "Add a number of seconds to a timestamp.",
    signature: "addSeconds(timestamp, seconds, format?)",
    parameters: [
      { name: "timestamp", type: "string", required: true },
      { name: "seconds", type: "integer", required: true },
      { name: "format", type: "string", required: false },
    ],
    returns: "string",
    examples: [
      { expression: "addSeconds('2018-03-15T00:00:00Z', 10)", result: "\"2018-03-15T00:00:10.0000000Z\"" },
      { expression: "addSeconds('2018-03-15T00:00:30Z', -5)", result: "\"2018-03-15T00:00:25.0000000Z\"" },
    ],
    docsUrl: `${BASE}#addSeconds`,
  },
  addToTime: {
    name: "addToTime",
    category: "DateTime",
    description: "Add a number of time units to a timestamp.",
    signature: "addToTime(timestamp, interval, timeUnit, format?)",
    parameters: [
      { name: "timestamp", type: "string", required: true },
      { name: "interval", type: "integer", required: true },
      { name: "timeUnit", type: "string", required: true },
      { name: "format", type: "string", required: false },
    ],
    returns: "string",
    examples: [
      { expression: "addToTime('2018-01-01T00:00:00Z', 1, 'Day')", result: "'2018-01-02T00:00:00Z'" },
    ],
    docsUrl: `${BASE}#addToTime`,
  },
  subtractFromTime: {
    name: "subtractFromTime",
    category: "DateTime",
    description: "Subtract a number of time units from a timestamp.",
    signature: "subtractFromTime(timestamp, interval, timeUnit, format?)",
    parameters: [
      { name: "timestamp", type: "string", required: true },
      { name: "interval", type: "integer", required: true },
      { name: "timeUnit", type: "string", required: true },
      { name: "format", type: "string", required: false },
    ],
    returns: "string",
    examples: [
      { expression: "subtractFromTime('2018-01-02T00:00:00Z', 1, 'Day')", result: "'2018-01-01T00:00:00Z'" },
    ],
    docsUrl: `${BASE}#subtractFromTime`,
  },
  getFutureTime: {
    name: "getFutureTime",
    category: "DateTime",
    description: "Return the current timestamp plus the specified time units.",
    signature: "getFutureTime(interval, timeUnit, format?)",
    parameters: [
      { name: "interval", type: "integer", required: true },
      { name: "timeUnit", type: "string", required: true },
      { name: "format", type: "string", required: false },
    ],
    returns: "string",
    examples: [{ expression: "getFutureTime(5, 'Day')", result: "Current time + 5 days" }],
    docsUrl: `${BASE}#getFutureTime`,
  },
  getPastTime: {
    name: "getPastTime",
    category: "DateTime",
    description: "Return the current timestamp minus the specified time units.",
    signature: "getPastTime(interval, timeUnit, format?)",
    parameters: [
      { name: "interval", type: "integer", required: true },
      { name: "timeUnit", type: "string", required: true },
      { name: "format", type: "string", required: false },
    ],
    returns: "string",
    examples: [{ expression: "getPastTime(5, 'Day')", result: "Current time - 5 days" }],
    docsUrl: `${BASE}#getPastTime`,
  },
  dateDifference: {
    name: "dateDifference",
    category: "DateTime",
    description: "Return the difference between two dates as a timespan string.",
    signature: "dateDifference(startDate, endDate)",
    parameters: [
      { name: "startDate", type: "string", required: true },
      { name: "endDate", type: "string", required: true },
    ],
    returns: "string",
    examples: [
      { expression: "dateDifference('2015-02-08', '2018-07-30')", result: "'1268.00:00:00'" },
    ],
    docsUrl: `${BASE}#dateDifference`,
  },
  dayOfMonth: {
    name: "dayOfMonth",
    category: "DateTime",
    description: "Return the day of the month from a timestamp.",
    signature: "dayOfMonth(timestamp)",
    parameters: [{ name: "timestamp", type: "string", required: true }],
    returns: "integer",
    examples: [
      { expression: "dayOfMonth('2018-03-15T13:27:36Z')", result: "15" },
    ],
    docsUrl: `${BASE}#dayOfMonth`,
  },
  dayOfWeek: {
    name: "dayOfWeek",
    category: "DateTime",
    description: "Return the day of the week from a timestamp (0=Sunday, 1=Monday, ...).",
    signature: "dayOfWeek(timestamp)",
    parameters: [{ name: "timestamp", type: "string", required: true }],
    returns: "integer",
    examples: [
      { expression: "dayOfWeek('2018-03-15T13:27:36Z')", result: "4" },
    ],
    docsUrl: `${BASE}#dayOfWeek`,
  },
  dayOfYear: {
    name: "dayOfYear",
    category: "DateTime",
    description: "Return the day of the year from a timestamp.",
    signature: "dayOfYear(timestamp)",
    parameters: [{ name: "timestamp", type: "string", required: true }],
    returns: "integer",
    examples: [
      { expression: "dayOfYear('2018-03-15T13:27:36Z')", result: "74" },
    ],
    docsUrl: `${BASE}#dayOfYear`,
  },
  startOfHour: {
    name: "startOfHour",
    category: "DateTime",
    description: "Return the start of the hour for a timestamp.",
    signature: "startOfHour(timestamp, format?)",
    parameters: [
      { name: "timestamp", type: "string", required: true },
      { name: "format", type: "string", required: false },
    ],
    returns: "string",
    examples: [
      { expression: "startOfHour('2018-03-15T13:30:30Z')", result: "'2018-03-15T13:00:00Z'" },
    ],
    docsUrl: `${BASE}#startOfHour`,
  },
  startOfMonth: {
    name: "startOfMonth",
    category: "DateTime",
    description: "Return the start of the month for a timestamp.",
    signature: "startOfMonth(timestamp, format?)",
    parameters: [
      { name: "timestamp", type: "string", required: true },
      { name: "format", type: "string", required: false },
    ],
    returns: "string",
    examples: [
      { expression: "startOfMonth('2018-03-15T13:30:30Z')", result: "'2018-03-01T00:00:00Z'" },
    ],
    docsUrl: `${BASE}#startOfMonth`,
  },
  parseDateTime: {
    name: "parseDateTime",
    category: "DateTime",
    description: "Return a timestamp from a date string, optionally using locale and format.",
    signature: "parseDateTime(timestamp, locale?, format?)",
    parameters: [
      { name: "timestamp", type: "string", required: true },
      { name: "locale", type: "string", required: false },
      { name: "format", type: "string", required: false },
    ],
    returns: "string",
    examples: [
      { expression: "parseDateTime('20/10/2014', 'fr-fr')", result: "'2014-10-20T00:00:00Z'" },
    ],
    docsUrl: `${BASE}#parseDateTime`,
  },
  ticks: {
    name: "ticks",
    category: "DateTime",
    description: "Return the .NET ticks (100-nanosecond intervals since 0001-01-01) for a timestamp.",
    signature: "ticks(timestamp)",
    parameters: [{ name: "timestamp", type: "string", required: true }],
    returns: "integer (bigint)",
    examples: [{ expression: "ticks('2018-01-01T00:00:00Z')", result: "636695424000000000" }],
    docsUrl: `${BASE}#ticks`,
  },
  convertFromUtc: {
    name: "convertFromUtc",
    category: "DateTime",
    description: "Convert a timestamp from UTC to the destination time zone.",
    signature: "convertFromUtc(timestamp, destTimeZone, format?)",
    parameters: [
      { name: "timestamp", type: "string", required: true },
      { name: "destTimeZone", type: "string", required: true },
      { name: "format", type: "string", required: false },
    ],
    returns: "string",
    examples: [
      { expression: "convertFromUtc('2018-01-01T08:00:00.0000000Z', 'Pacific Standard Time')", result: "\"2018-01-01T00:00:00.0000000\"" },
      { expression: "convertFromUtc('2018-01-01T08:00:00.0000000Z', 'Pacific Standard Time', 'D')", result: "\"Monday, January 1, 2018\"" },
    ],
    docsUrl: `${BASE}#convertFromUtc`,
  },
  convertTimeZone: {
    name: "convertTimeZone",
    category: "DateTime",
    description: "Convert a timestamp from source to destination time zone.",
    signature: "convertTimeZone(timestamp, sourceTimeZone, destTimeZone, format?)",
    parameters: [
      { name: "timestamp", type: "string", required: true },
      { name: "sourceTimeZone", type: "string", required: true },
      { name: "destTimeZone", type: "string", required: true },
      { name: "format", type: "string", required: false },
    ],
    returns: "string",
    examples: [
      { expression: "convertTimeZone('2018-01-01T08:00:00.0000000Z', 'UTC', 'Pacific Standard Time')", result: "\"2018-01-01T00:00:00.0000000\"" },
      { expression: "convertTimeZone('2018-01-01T08:00:00.0000000Z', 'UTC', 'Pacific Standard Time', 'D')", result: "\"Monday, January 1, 2018\"" },
    ],
    docsUrl: `${BASE}#convertTimeZone`,
  },
  convertToUtc: {
    name: "convertToUtc",
    category: "DateTime",
    description: "Convert a timestamp from the source time zone to UTC.",
    signature: "convertToUtc(timestamp, sourceTimeZone, format?)",
    parameters: [
      { name: "timestamp", type: "string", required: true },
      { name: "sourceTimeZone", type: "string", required: true },
      { name: "format", type: "string", required: false },
    ],
    returns: "string",
    examples: [
      { expression: "convertToUtc('01/01/2018 00:00:00', 'Pacific Standard Time')", result: "\"2018-01-01T08:00:00.0000000Z\"" },
      { expression: "convertToUtc('01/01/2018 00:00:00', 'Pacific Standard Time', 'D')", result: "\"Monday, January 1, 2018\"" },
    ],
    docsUrl: `${BASE}#convertToUtc`,
  },
  // Workflow functions
  parameters: {
    name: "parameters",
    category: "Workflow",
    description:
      "Return the value for a parameter that is defined in your workflow.",
    signature: "parameters(parameterName)",
    parameters: [{ name: "parameterName", type: "string", required: true }],
    returns: "any",
    examples: [
      {
        expression: "parameters('firstName')",
        result: "Returns workflow parameter 'firstName' value",
      },
      {
        expression: "parameters('limit')",
        result: "Returns workflow parameter 'limit' value",
      },
    ],
    docsUrl: `${BASE}#parameters`,
  },
  variables: {
    name: "variables",
    category: "Workflow",
    description: "Return the value for a specified variable.",
    signature: "variables(variableName)",
    parameters: [{ name: "variableName", type: "string", required: true }],
    returns: "any",
    examples: [
      {
        expression: "variables('counter')",
        result: "Returns workflow variable 'counter' value",
      },
      {
        expression: "variables('items')",
        result: "Returns workflow variable 'items' value",
      },
    ],
    docsUrl: `${BASE}#variables`,
  },
  triggerBody: {
    name: "triggerBody",
    category: "Workflow",
    description: "Return the trigger's body output at runtime.",
    signature: "triggerBody()",
    parameters: [],
    returns: "any",
    examples: [
      {
        expression: "triggerBody()?['property']",
        result: "Returns 'property' from trigger body",
      },
      {
        expression: "triggerBody()",
        result: "Returns full trigger body object",
      },
    ],
    docsUrl: `${BASE}#triggerBody`,
  },
};

export function getFunctionMetadata(
  name: string,
): FunctionMetadata | undefined {
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
  const hasVariadic = params.some((p) => p.name === "...");
  const min = params.filter((p) => p.required !== false).length;
  const max = hasVariadic ? null : params.length;
  return { min, max };
}

export type TokenType =
  | 'identifier'
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'lparen'
  | 'rparen'
  | 'comma'
  | 'at'
  | 'lbracket'
  | 'rbracket'
  | 'question'
  | 'eof';

export interface Token {
  type: TokenType;
  value: string | number | boolean | null;
  start: number;
  end: number;
}

export class Tokenizer {
  private input: string;
  private pos = 0;

  constructor(input: string) {
    this.input = input;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    this.pos = 0;

    // Strip optional leading @
    this.skipWhitespace();
    if (this.peek() === '@') {
      this.advance();
      this.skipWhitespace();
    }

    while (this.pos < this.input.length) {
      this.skipWhitespace();
      if (this.pos >= this.input.length) break;

      const start = this.pos;
      const ch = this.peek();

      if (ch === '(') {
        this.advance();
        tokens.push({ type: 'lparen', value: '(', start, end: this.pos });
      } else if (ch === ')') {
        this.advance();
        tokens.push({ type: 'rparen', value: ')', start, end: this.pos });
      } else if (ch === ',') {
        this.advance();
        tokens.push({ type: 'comma', value: ',', start, end: this.pos });
      } else if (ch === '@') {
        this.advance();
        tokens.push({ type: 'at', value: '@', start, end: this.pos });
      } else if (ch === '[') {
        this.advance();
        tokens.push({ type: 'lbracket', value: '[', start, end: this.pos });
      } else if (ch === ']') {
        this.advance();
        tokens.push({ type: 'rbracket', value: ']', start, end: this.pos });
      } else if (ch === '?') {
        this.advance();
        tokens.push({ type: 'question', value: '?', start, end: this.pos });
      } else if (ch === '"') {
        throw new Error(
          `Double quotes are not allowed. Power Automate expressions require single quotes (') for strings. Use ' instead of " at position ${start}.`
        );
      } else if (ch === "'") {
        const token = this.readString("'");
        if (token) tokens.push(token);
      } else if (this.isDigit(ch) || (ch === '-' && this.isDigit(this.peekNext()))) {
        const token = this.readNumber();
        if (token) tokens.push(token);
      } else if (this.isIdentifierStart(ch)) {
        const token = this.readIdentifier();
        if (token) tokens.push(token);
      } else {
        throw new Error(`Unexpected character '${ch}' at position ${this.pos}`);
      }
    }

    tokens.push({ type: 'eof', value: '', start: this.pos, end: this.pos });
    return tokens;
  }

  private peek(): string {
    return this.input[this.pos] ?? '';
  }

  private peekNext(): string {
    return this.input[this.pos + 1] ?? '';
  }

  private advance(): string {
    return this.input[this.pos++] ?? '';
  }

  private skipWhitespace(): void {
    while (this.pos < this.input.length && /\s/.test(this.input[this.pos])) {
      this.pos++;
    }
  }

  private isDigit(ch: string): boolean {
    return /[0-9]/.test(ch);
  }

  private isIdentifierStart(ch: string): boolean {
    return /[a-zA-Z_]/.test(ch);
  }

  private isIdentifierPart(ch: string): boolean {
    return /[a-zA-Z0-9_]/.test(ch);
  }

  private readString(quote: string): Token | null {
    const start = this.pos;
    this.advance(); // consume opening quote
    let value = '';
    while (this.pos < this.input.length) {
      const ch = this.advance();
      if (ch === '\\') {
        const next = this.advance();
        if (next === quote) value += quote;
        else if (next === '\\') value += '\\';
        else if (next === 'n') value += '\n';
        else if (next === 't') value += '\t';
        else value += next;
      } else if (ch === quote) {
        return { type: 'string', value, start, end: this.pos };
      } else {
        value += ch;
      }
    }
    throw new Error(`Unterminated string starting at position ${start}`);
  }

  private readNumber(): Token {
    const start = this.pos;
    let value = '';
    if (this.peek() === '-') {
      value += this.advance();
    }
    while (this.pos < this.input.length && (this.isDigit(this.peek()) || this.peek() === '.')) {
      value += this.advance();
    }
    const num = value.includes('.') ? parseFloat(value) : parseInt(value, 10);
    if (isNaN(num)) throw new Error(`Invalid number '${value}' at position ${start}`);
    return { type: 'number', value: num, start, end: this.pos };
  }

  private readIdentifier(): Token {
    const start = this.pos;
    let value = '';
    while (this.pos < this.input.length && this.isIdentifierPart(this.peek())) {
      value += this.advance();
    }
    if (value === 'true') return { type: 'boolean', value: true, start, end: this.pos };
    if (value === 'false') return { type: 'boolean', value: false, start, end: this.pos };
    if (value === 'null') return { type: 'null', value: null, start, end: this.pos };
    return { type: 'identifier', value, start, end: this.pos };
  }
}

import { Tokenizer } from './tokenizer';
import type { Token, TokenType } from './tokenizer';
import type { AstNode, LiteralNode, ParametersCallNode, SelectionNode, SelectionStep, VariablesCallNode } from './ast';

export class ParseError extends Error {
  readonly position?: number;
  constructor(message: string, position?: number) {
    super(message);
    this.name = 'ParseError';
    this.position = position;
  }
}

export class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): AstNode {
    this.pos = 0;
    const expr = this.parseExpression();
    this.expect('eof');
    return expr;
  }

  private current(): Token {
    return this.tokens[this.pos] ?? this.tokens[this.tokens.length - 1];
  }

  private advance(): Token {
    const t = this.current();
    if (this.pos < this.tokens.length - 1) this.pos++;
    return t;
  }

  private expect(type: TokenType): Token {
    const t = this.current();
    if (t.type !== type) {
      throw new ParseError(`Expected ${type}, got ${t.type}`, t.start);
    }
    return this.advance();
  }

  private parseExpression(): AstNode {
    const primary = this.parsePrimary();
    return this.parseSelectionSuffix(primary);
  }

  private parsePrimary(): AstNode {
    const t = this.current();

    if (t.type === 'identifier') {
      const name = t.value as string;
      this.advance();
      if (this.current().type === 'lparen') {
        return this.parseFunctionCall(name);
      }
      throw new ParseError(`Unexpected identifier '${name}'`, t.start);
    }

    if (t.type === 'string' || t.type === 'number' || t.type === 'boolean' || t.type === 'null') {
      this.advance();
      return { type: 'literal', value: t.value } as LiteralNode;
    }

    throw new ParseError(`Unexpected token ${t.type}`, t.start);
  }

  private parseSelectionSuffix(primary: AstNode): AstNode {
    const steps: SelectionStep[] = [];
    while (this.current().type === 'question' || this.current().type === 'lbracket') {
      const optional = this.current().type === 'question';
      if (optional) this.advance();
      this.expect('lbracket');
      const index = this.parseExpression();
      this.expect('rbracket');
      steps.push({ optional, index });
    }
    if (steps.length === 0) return primary;
    return { type: 'selection', base: primary, steps } as SelectionNode;
  }

  private parseFunctionCall(name: string): AstNode {
    this.expect('lparen');

    const args: AstNode[] = [];
    while (this.current().type !== 'rparen') {
      if (this.current().type === 'eof') {
        throw new ParseError('Unclosed parenthesis', this.current().start);
      }
      args.push(this.parseExpression());
      if (this.current().type === 'comma') {
        this.advance();
        if (this.current().type === 'rparen') {
          throw new ParseError('Trailing comma not allowed', this.current().start);
        }
      }
    }
    this.expect('rparen');

    if (name === 'parameters') {
      if (args.length !== 1) throw new ParseError('parameters() expects exactly one string argument', this.current().start);
      const arg = args[0];
      if (arg.type !== 'literal' || typeof arg.value !== 'string') {
        throw new ParseError('parameters() expects a string literal', this.current().start);
      }
      return { type: 'parametersCall', paramName: arg.value } as ParametersCallNode;
    }

    if (name === 'variables') {
      if (args.length !== 1) throw new ParseError('variables() expects exactly one string argument', this.current().start);
      const arg = args[0];
      if (arg.type !== 'literal' || typeof arg.value !== 'string') {
        throw new ParseError('variables() expects a string literal', this.current().start);
      }
      return { type: 'variablesCall', varName: arg.value } as VariablesCallNode;
    }

    return { type: 'functionCall', name, args };
  }
}

export function parseExpression(input: string): AstNode {
  const tokenizer = new Tokenizer(input);
  const tokens = tokenizer.tokenize();
  const parser = new Parser(tokens);
  return parser.parse();
}

import type { Token } from "./Token";
import { Tokenizer } from "./Tokenizer";
import { Expression } from "../ast/Expression";
import { NumberNode } from "../ast/nodes/Number";
import { Variable } from "../ast/nodes/Variable";
import { BinaryOperation } from "../ast/nodes/BinaryOperation";
import { UnaryMinus } from "../ast/nodes/UnaryMinus";
import { Power } from "../ast/nodes/Power";

/**
 * Parses a mathematical expression string into an AST.
 *
 * Implements a recursive-descent parser following this grammar
 * (listed from lowest to highest precedence):
 *
 *   expression  =  term ( ("+" | "-") term )*
 *   term        =  factor ( ("*" | "/") factor )*
 *   factor      =  "-" factor | power
 *   power       =  primary ("^" factor)?          ← right-associative
 *   primary     =  Number | Identifier | "(" expression ")"
 *
 * Usage:
 *   const ast = Parser.parse("3 + 4 * x")
 */
export class Parser {
  /**
   * The flat list of tokens produced by the Tokenizer.
   * Always ends with a sentinel `End` token.
   */
  private tokens: Token[] = [];

  /**
   * The index of the token currently being examined.
   * Advances as tokens are consumed.
   */
  private position: number = 0;

  /**
   * Private constructor — use the static `parse()` factory method instead.
   *
   * @param input - The raw expression string to parse.
   */
  private constructor(input: string) {
    this.tokens = new Tokenizer(input).tokenize();
  }

  /**
   * Parses a mathematical expression string and returns the root of the AST.
   *
   * @param input - The raw expression string, e.g. "3 + 4 * x".
   * @returns The root Expression node of the parsed AST.
   * @throws If the input contains syntax errors or has leftover tokens.
   */
  static parse(input: string): Expression {
    /** The parser instance for this single parse run. */
    const parser = new Parser(input);

    /** The parsed expression tree. */
    const expression = parser.parseExpression();

    // The whole input must be consumed. Any leftover token (e.g. the "4" in
    // "3 4", or the stray ")" in "1 + 2)") is a syntax error rather than
    // something to silently ignore.
    parser.expect("End");

    return expression;
  }

  /**
   * Parses an expression: handles + and - (lowest precedence, left-associative).
   *
   *   expression = term ( ("+" | "-") term )*
   *
   * @returns The parsed expression as an AST node.
   */
  private parseExpression(): Expression {
    /** The left-hand side, built up iteratively as more terms are consumed. */
    let left = this.parseTerm();

    while (this.current().type === "Plus" || this.current().type === "Minus") {
      /** The operator symbol for this operation. */
      const operator = this.current().type === "Plus" ? "+" : "-";
      this.advance();

      /** The right-hand operand for this operation. */
      const right = this.parseTerm();
      left = new BinaryOperation(operator, left, right);
    }

    return left;
  }

  /**
   * Parses a term: handles * and / (left-associative).
   *
   *   term = factor ( ("*" | "/") factor )*
   *
   * @returns The parsed term as an AST node.
   */
  private parseTerm(): Expression {
    /** The left-hand side, built up iteratively as more factors are consumed. */
    let left = this.parseFactor();

    while (this.current().type === "Star" || this.current().type === "Slash") {
      /** The operator symbol for this operation. */
      const operator = this.current().type === "Star" ? "*" : "/";
      this.advance();

      /** The right-hand operand for this operation. */
      const right = this.parseFactor();
      left = new BinaryOperation(operator, left, right);
    }

    return left;
  }

  /**
   * Parses a factor: handles unary minus and delegates to parsePower.
   *
   *   factor = "-" factor | power
   *
   * Unary minus is right-associative by recursion, so --x correctly parses
   * as -(-x).
   *
   * @returns The parsed factor as an AST node.
   */
  private parseFactor(): Expression {
    if (this.current().type === "Minus") {
      this.advance();
      return new UnaryMinus(this.parseFactor());
    }
    return this.parsePower();
  }

  /**
   * Parses exponentiation: right-associative, higher precedence than * and /.
   *
   *   power = primary ("^" factor)?
   *
   * Right-associativity is achieved by recursing into parseFactor (not parsePower),
   * so "2^2^3" correctly becomes 2^(2^3) = 256.
   *
   * @returns The parsed power expression as an AST node.
   */
  private parsePower(): Expression {
    /** The base of the potential exponentiation. */
    const base = this.parsePrimary();

    if (this.current().type === "Caret") {
      this.advance();

      /** The exponent; parsed via parseFactor for right-associativity. */
      const exponent = this.parseFactor();
      return new Power(base, exponent);
    }

    return base;
  }

  /**
   * Parses a primary expression: a literal number, a variable, or a
   * parenthesised sub-expression.
   *
   *   primary = Number | Identifier | "(" expression ")"
   *
   * @returns The parsed primary as an AST node.
   * @throws If the current token is not a valid start of a primary expression.
   */
  private parsePrimary(): Expression {
    /** The token at the current read position. */
    const token = this.current();

    if (token.type === "Number") {
      this.advance();
      return new NumberNode(parseFloat(token.value));
    }

    if (token.type === "Identifier") {
      this.advance();
      return new Variable(token.value);
    }

    if (token.type === "LeftParen") {
      this.advance();

      /** The sub-expression inside the parentheses. */
      const expression = this.parseExpression();
      this.expect("RightParen");
      return expression;
    }

    throw new Error(
      `Unexpected token "${token.value}" (${token.type}) at position ${this.position}.`
    );
  }

  /**
   * Returns the token at the current read position without advancing.
   *
   * @returns The Token at `this.position`.
   */
  private current(): Token {
    return this.tokens[this.position];
  }

  /**
   * Advances the read position by one token.
   * Has no effect if the current token is already the `End` sentinel.
   */
  private advance(): void {
    if (this.current().type !== "End") {
      this.position++;
    }
  }

  /**
   * Asserts that the current token has the expected type, then advances.
   *
   * @param type - The token type that must be present at the current position.
   * @throws If the current token's type does not match `type`.
   */
  private expect(type: Token["type"]): void {
    if (this.current().type !== type) {
      throw new Error(
        `Expected "${type}" but got "${this.current().type}" ("${this.current().value}").`
      );
    }
    this.advance();
  }
}

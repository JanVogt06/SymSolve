import { Expression } from "../Expression";

/**
 * Exponentiation of a base raised to an exponent, e.g. x^2, 2^10.
 *
 * This is an inner node in the AST with exactly two children: `base` and `exponent`.
 * The `^` operator is right-associative: 2^2^3 is parsed as 2^(2^3) = 256.
 */
export class Power extends Expression {
  /**
   * The base of the exponentiation (left operand of ^).
   */
  readonly base: Expression;

  /**
   * The exponent (right operand of ^).
   */
  readonly exponent: Expression;

  /**
   * Creates a new exponentiation node.
   *
   * @param base     - The base expression.
   * @param exponent - The exponent expression.
   */
  constructor(base: Expression, exponent: Expression) {
    super();
    this.base = base;
    this.exponent = exponent;
  }

  /**
   * Evaluates base and exponent, then raises base to the power of exponent.
   *
   * @param env - Variable environment passed down to child nodes.
   * @returns The result of base^exponent.
   */
  evaluate(env: Record<string, number>): number {
    return Math.pow(this.base.evaluate(env), this.exponent.evaluate(env));
  }

  /**
   * Returns a plain-text representation using the ^ symbol, e.g. "x^2".
   *
   * @returns Plain-text representation of the exponentiation.
   */
  toString(): string {
    return `${this.base.toString()}^${this.exponent.toString()}`;
  }

  /**
   * Returns a LaTeX representation using a superscript, e.g. "x^{2}".
   * The exponent is wrapped in curly braces to support multi-character exponents.
   *
   * @returns LaTeX representation of the exponentiation.
   */
  toLaTeX(): string {
    return `${this.base.toLaTeX()}^{${this.exponent.toLaTeX()}}`;
  }
}

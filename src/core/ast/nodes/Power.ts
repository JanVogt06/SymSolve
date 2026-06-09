import { Expression } from "../Expression";
import { NumberNode } from "./Number";
import { Variable } from "./Variable";

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
   * A compound base is parenthesised so that "(x + 1)^2" is not flattened to
   * the mathematically different "x + 1^2". A compound exponent is parenthesised
   * for the same reason, e.g. "2^(3 + 4)".
   *
   * @returns Plain-text representation of the exponentiation.
   */
  toString(): string {
    /** Base string, wrapped in parentheses if it binds looser than ^. */
    const base = this.baseNeedsParentheses() ? `(${this.base.toString()})` : this.base.toString();

    /** Exponent string, wrapped in parentheses if it binds looser than ^. */
    const exponent = this.exponentNeedsParentheses()
      ? `(${this.exponent.toString()})`
      : this.exponent.toString();

    return `${base}^${exponent}`;
  }

  /**
   * Returns a LaTeX representation using a superscript, e.g. "x^{2}".
   * The exponent is wrapped in curly braces to support multi-character exponents;
   * those braces already group it, so the exponent never needs visible parentheses.
   * A compound base is still parenthesised, e.g. "(x + 1)^{2}".
   *
   * @returns LaTeX representation of the exponentiation.
   */
  toLaTeX(): string {
    /** Base LaTeX, wrapped in parentheses if it binds looser than ^. */
    const base = this.baseNeedsParentheses() ? `(${this.base.toLaTeX()})` : this.base.toLaTeX();

    return `${base}^{${this.exponent.toLaTeX()}}`;
  }

  /**
   * Determines whether the base must be parenthesised. Only atoms — a
   * non-negative numeric literal or a variable — bind tightly enough to stand
   * alone. Everything else (operations, negation, a nested power) binds looser
   * than `^` and would otherwise change meaning.
   *
   * @returns True if the base requires surrounding parentheses.
   */
  private baseNeedsParentheses(): boolean {
    if (this.base instanceof NumberNode) return this.base.value < 0;
    if (this.base instanceof Variable) return false;
    return true;
  }

  /**
   * Determines whether the exponent must be parenthesised in the plain-text
   * form, using the same atom rule as the base.
   *
   * @returns True if the exponent requires surrounding parentheses.
   */
  private exponentNeedsParentheses(): boolean {
    if (this.exponent instanceof NumberNode) return this.exponent.value < 0;
    if (this.exponent instanceof Variable) return false;
    return true;
  }
}

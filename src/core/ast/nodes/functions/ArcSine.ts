import { Expression } from "../../Expression";

/**
 * The inverse sine (arcsine) function, e.g. arcsin(x).
 *
 * A unary node with a single child: the `argument` to which arcsine is applied.
 * The result is in radians. The argument's domain is [-1, 1]; outside it the
 * evaluation yields NaN.
 */
export class ArcSine extends Expression {
  /**
   * The expression the arcsine is applied to (domain [-1, 1]).
   */
  readonly argument: Expression;

  /**
   * Creates a new arcsine node.
   *
   * @param argument - The expression the arcsine is applied to.
   */
  constructor(argument: Expression) {
    super();
    this.argument = argument;
  }

  /**
   * Evaluates the argument and applies the arcsine function.
   *
   * @param env - Variable environment passed down to the argument.
   * @returns The arcsine of the argument's value, in radians (NaN if out of domain).
   */
  evaluate(env: Record<string, number>): number {
    return Math.asin(this.argument.evaluate(env));
  }

  /**
   * Returns a plain-text representation, e.g. "arcsin(x)".
   *
   * @returns Plain-text representation of the arcsine call.
   */
  toString(): string {
    return `arcsin(${this.argument.toString()})`;
  }

  /**
   * Returns a LaTeX representation, e.g. "\\arcsin(x)".
   *
   * @returns LaTeX representation of the arcsine call.
   */
  toLaTeX(): string {
    return `\\arcsin(${this.argument.toLaTeX()})`;
  }
}

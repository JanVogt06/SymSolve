import { Expression } from "../../Expression";

/**
 * The inverse cosine (arccosine) function, e.g. arccos(x).
 *
 * A unary node with a single child: the `argument` to which arccosine is
 * applied. The result is in radians. The argument's domain is [-1, 1]; outside
 * it the evaluation yields NaN.
 */
export class ArcCosine extends Expression {
  /**
   * The expression the arccosine is applied to (domain [-1, 1]).
   */
  readonly argument: Expression;

  /**
   * Creates a new arccosine node.
   *
   * @param argument - The expression the arccosine is applied to.
   */
  constructor(argument: Expression) {
    super();
    this.argument = argument;
  }

  /**
   * Evaluates the argument and applies the arccosine function.
   *
   * @param env - Variable environment passed down to the argument.
   * @returns The arccosine of the argument's value, in radians (NaN if out of domain).
   */
  evaluate(env: Record<string, number>): number {
    return Math.acos(this.argument.evaluate(env));
  }

  /**
   * Returns a plain-text representation, e.g. "arccos(x)".
   *
   * @returns Plain-text representation of the arccosine call.
   */
  toString(): string {
    return `arccos(${this.argument.toString()})`;
  }

  /**
   * Returns a LaTeX representation, e.g. "\\arccos(x)".
   *
   * @returns LaTeX representation of the arccosine call.
   */
  toLaTeX(): string {
    return `\\arccos(${this.argument.toLaTeX()})`;
  }
}

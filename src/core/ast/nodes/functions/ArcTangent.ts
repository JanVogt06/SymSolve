import { Expression } from "../../Expression";

/**
 * The inverse tangent (arctangent) function, e.g. arctan(x).
 *
 * A unary node with a single child: the `argument` to which arctangent is
 * applied. The result is in radians. The argument is defined for all real
 * numbers.
 */
export class ArcTangent extends Expression {
  /**
   * The expression the arctangent is applied to.
   */
  readonly argument: Expression;

  /**
   * Creates a new arctangent node.
   *
   * @param argument - The expression the arctangent is applied to.
   */
  constructor(argument: Expression) {
    super();
    this.argument = argument;
  }

  /**
   * Evaluates the argument and applies the arctangent function.
   *
   * @param env - Variable environment passed down to the argument.
   * @returns The arctangent of the argument's value, in radians.
   */
  evaluate(env: Record<string, number>): number {
    return Math.atan(this.argument.evaluate(env));
  }

  /**
   * Returns a plain-text representation, e.g. "arctan(x)".
   *
   * @returns Plain-text representation of the arctangent call.
   */
  toString(): string {
    return `arctan(${this.argument.toString()})`;
  }

  /**
   * Returns a LaTeX representation, e.g. "\\arctan(x)".
   *
   * @returns LaTeX representation of the arctangent call.
   */
  toLaTeX(): string {
    return `\\arctan(${this.argument.toLaTeX()})`;
  }
}

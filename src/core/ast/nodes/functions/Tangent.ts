import { Expression } from "../../Expression";

/**
 * The tangent function, e.g. tan(x).
 *
 * A unary node with a single child: the `argument` to which tangent is applied.
 * The argument is interpreted in radians.
 */
export class Tangent extends Expression {
  /**
   * The expression the tangent is applied to (interpreted in radians).
   */
  readonly argument: Expression;

  /**
   * Creates a new tangent node.
   *
   * @param argument - The expression the tangent is applied to.
   */
  constructor(argument: Expression) {
    super();
    this.argument = argument;
  }

  /**
   * Evaluates the argument and applies the tangent function.
   *
   * @param env - Variable environment passed down to the argument.
   * @returns The tangent of the argument's value.
   */
  evaluate(env: Record<string, number>): number {
    return Math.tan(this.argument.evaluate(env));
  }

  /**
   * Returns a plain-text representation, e.g. "tan(x)".
   *
   * @returns Plain-text representation of the tangent call.
   */
  toString(): string {
    return `tan(${this.argument.toString()})`;
  }

  /**
   * Returns a LaTeX representation, e.g. "\\tan(x)".
   *
   * @returns LaTeX representation of the tangent call.
   */
  toLaTeX(): string {
    return `\\tan(${this.argument.toLaTeX()})`;
  }
}

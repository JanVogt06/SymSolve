import { Expression } from "../../Expression";

/**
 * The cosine function, e.g. cos(x).
 *
 * A unary node with a single child: the `argument` to which cosine is applied.
 * The argument is interpreted in radians.
 */
export class Cosine extends Expression {
  /**
   * The expression the cosine is applied to (interpreted in radians).
   */
  readonly argument: Expression;

  /**
   * Creates a new cosine node.
   *
   * @param argument - The expression the cosine is applied to.
   */
  constructor(argument: Expression) {
    super();
    this.argument = argument;
  }

  /**
   * Evaluates the argument and applies the cosine function.
   *
   * @param env - Variable environment passed down to the argument.
   * @returns The cosine of the argument's value.
   */
  evaluate(env: Record<string, number>): number {
    return Math.cos(this.argument.evaluate(env));
  }

  /**
   * Returns a plain-text representation, e.g. "cos(x)".
   *
   * @returns Plain-text representation of the cosine call.
   */
  toString(): string {
    return `cos(${this.argument.toString()})`;
  }

  /**
   * Returns a LaTeX representation, e.g. "\\cos(x)".
   *
   * @returns LaTeX representation of the cosine call.
   */
  toLaTeX(): string {
    return `\\cos(${this.argument.toLaTeX()})`;
  }
}

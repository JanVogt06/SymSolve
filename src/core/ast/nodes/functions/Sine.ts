import { Expression } from "../../Expression";

/**
 * The sine function, e.g. sin(x).
 *
 * A unary node with a single child: the `argument` to which sine is applied.
 * The argument is interpreted in radians.
 */
export class Sine extends Expression {
  /**
   * The expression the sine is applied to (interpreted in radians).
   */
  readonly argument: Expression;

  /**
   * Creates a new sine node.
   *
   * @param argument - The expression the sine is applied to.
   */
  constructor(argument: Expression) {
    super();
    this.argument = argument;
  }

  /**
   * Evaluates the argument and applies the sine function.
   *
   * @param env - Variable environment passed down to the argument.
   * @returns The sine of the argument's value.
   */
  evaluate(env: Record<string, number>): number {
    return Math.sin(this.argument.evaluate(env));
  }

  /**
   * Returns a plain-text representation, e.g. "sin(x)".
   *
   * @returns Plain-text representation of the sine call.
   */
  toString(): string {
    return `sin(${this.argument.toString()})`;
  }

  /**
   * Returns a LaTeX representation, e.g. "\\sin(x)".
   *
   * @returns LaTeX representation of the sine call.
   */
  toLaTeX(): string {
    return `\\sin(${this.argument.toLaTeX()})`;
  }
}

/**
 * Abstract base class for all AST nodes.
 *
 * Every mathematical expression (e.g. a number, a variable, a sum, a sine) is
 * represented as a subclass of Expression. The abstract methods defined here
 * form the contract that every node must fulfil.
 */
export abstract class Expression {
  /**
   * Evaluates the expression to a number.
   *
   * @param env - A map of variable names to their current values,
   *              e.g. { x: 3, y: 5 }. Pass an empty object {} for
   *              expressions that contain no variables.
   * @returns The numeric result.
   * @throws If a variable in the expression is not present in env.
   */
  abstract evaluate(env: Record<string, number>): number;

  /**
   * Returns a plain-text representation of the expression,
   * e.g. "x^2 + 2/4".
   * Useful for debugging and simple text output.
   */
  abstract toString(): string;

  /**
   * Returns a LaTeX string for the expression,
   * e.g. "x^{2} + \frac{2}{4}".
   * Passed directly to KaTeX for rendering.
   */
  abstract toLaTeX(): string;
}

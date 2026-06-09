import { Expression } from "../Expression";

/**
 * A named variable node, e.g. x, y, alpha.
 *
 * This is a leaf node in the AST — it has no children.
 * Its numeric value is resolved at evaluation time via the environment map.
 */
export class Variable extends Expression {
  /**
   * The name of this variable, exactly as it appeared in the input string.
   * Examples: "x", "y", "alpha".
   */
  readonly name: string;

  /**
   * Creates a new variable node.
   *
   * @param name - The variable name, e.g. "x".
   */
  constructor(name: string) {
    super();
    this.name = name;
  }

  /**
   * Looks up the variable's value in the environment.
   *
   * @param env - A map from variable names to their current numeric values.
   * @returns The value bound to this variable's name in `env`.
   * @throws If `this.name` is not a key in `env`.
   */
  evaluate(env: Record<string, number>): number {
    if (!(this.name in env)) {
      throw new Error(`Variable "${this.name}" is not defined in the environment.`);
    }
    return env[this.name];
  }

  /**
   * Returns the variable name as a plain string, e.g. "x".
   *
   * @returns The variable name.
   */
  toString(): string {
    return this.name;
  }

  /**
   * Returns the variable name as a LaTeX string.
   * Single-letter names render as italic by default in LaTeX/KaTeX.
   *
   * @returns The variable name as a LaTeX string.
   */
  toLaTeX(): string {
    return this.name;
  }
}

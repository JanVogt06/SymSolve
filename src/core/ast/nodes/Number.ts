import { Expression } from "../Expression";

/**
 * A numeric literal node, e.g. 3, -7, 3.14.
 *
 * This is a leaf node in the AST — it has no children.
 * The value is stored as a plain JavaScript number (IEEE 754 double precision).
 */
export class NumberNode extends Expression {
  /**
   * The numeric value of this literal.
   * Stored as a JavaScript `number` (64-bit float).
   */
  readonly value: number;

  /**
   * Creates a new numeric literal node.
   *
   * @param value - The numeric value this node represents.
   */
  constructor(value: number) {
    super();
    this.value = value;
  }

  /**
   * Returns the stored value directly.
   * The environment is ignored because a literal has no variables.
   *
   * @param _env - Unused. Present only to satisfy the abstract method signature.
   * @returns The numeric value of this literal.
   */
  evaluate(_env: Record<string, number>): number {
    return this.value;
  }

  /**
   * Returns the value as a plain string, e.g. "3" or "3.14".
   *
   * @returns The value formatted as a string.
   */
  toString(): string {
    return String(this.value);
  }

  /**
   * Returns the value as a LaTeX string.
   * Numbers need no special LaTeX formatting, so this is identical to toString().
   *
   * @returns The value formatted as a LaTeX string.
   */
  toLaTeX(): string {
    return String(this.value);
  }
}

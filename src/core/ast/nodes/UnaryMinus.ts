import { Expression } from "../Expression";

/**
 * Unary negation of a sub-expression, e.g. -x, -(3 + 4).
 *
 * This is an inner node in the AST with exactly one child: `operand`.
 * It is distinct from subtraction (BinaryOperation with "-"), which has two children.
 */
export class UnaryMinus extends Expression {
  /**
   * The expression being negated.
   */
  readonly operand: Expression;

  /**
   * Creates a new unary minus node.
   *
   * @param operand - The expression to negate.
   */
  constructor(operand: Expression) {
    super();
    this.operand = operand;
  }

  /**
   * Evaluates the operand and negates the result.
   *
   * @param env - Variable environment passed down to the operand.
   * @returns The negated numeric value.
   */
  evaluate(env: Record<string, number>): number {
    return -this.operand.evaluate(env);
  }

  /**
   * Returns a plain-text representation with a leading minus sign, e.g. "-x".
   *
   * @returns Plain-text representation of the negation.
   */
  toString(): string {
    return `-${this.operand.toString()}`;
  }

  /**
   * Returns a LaTeX representation with a leading minus sign, e.g. "-x".
   *
   * @returns LaTeX representation of the negation.
   */
  toLaTeX(): string {
    return `-${this.operand.toLaTeX()}`;
  }
}

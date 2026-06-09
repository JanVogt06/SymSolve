import { Expression } from "../Expression";
import { BinaryOperation } from "./BinaryOperation";

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
   * A binary-operation operand is parenthesised so that "-(3 + 4)" is not
   * flattened to "-3 + 4", which would evaluate differently.
   *
   * @returns Plain-text representation of the negation.
   */
  toString(): string {
    return this.operandNeedsParentheses()
      ? `-(${this.operand.toString()})`
      : `-${this.operand.toString()}`;
  }

  /**
   * Returns a LaTeX representation with a leading minus sign, e.g. "-x".
   * A binary-operation operand is parenthesised, e.g. "-(3 + 4)".
   *
   * @returns LaTeX representation of the negation.
   */
  toLaTeX(): string {
    return this.operandNeedsParentheses()
      ? `-(${this.operand.toLaTeX()})`
      : `-${this.operand.toLaTeX()}`;
  }

  /**
   * Determines whether the operand must be parenthesised. Unary minus binds
   * more tightly than +, -, * and /, so any binary operation underneath it must
   * be grouped to preserve meaning. A power binds tighter than negation
   * ("-x^2" already means "-(x^2)"), so it needs no parentheses.
   *
   * @returns True if the operand requires surrounding parentheses.
   */
  private operandNeedsParentheses(): boolean {
    return this.operand instanceof BinaryOperation;
  }
}

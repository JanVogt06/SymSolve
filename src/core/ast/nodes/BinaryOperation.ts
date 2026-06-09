import { Expression } from "../Expression";

/**
 * The set of binary operators supported by BinaryOperation.
 */
export type BinaryOperator = "+" | "-" | "*" | "/";

/**
 * A binary operation between two sub-expressions, e.g. 3 + 4, x * y, a / b.
 *
 * This is an inner node in the AST with exactly two children: `left` and `right`.
 * Operator precedence and parenthesisation are handled in toString() / toLaTeX().
 */
export class BinaryOperation extends Expression {
  /**
   * The operator symbol, one of: +  -  *  /
   */
  readonly operator: BinaryOperator;

  /**
   * The left-hand operand.
   */
  readonly left: Expression;

  /**
   * The right-hand operand.
   */
  readonly right: Expression;

  /**
   * Creates a new binary operation node.
   *
   * @param operator - The operator symbol.
   * @param left     - The left-hand operand.
   * @param right    - The right-hand operand.
   */
  constructor(operator: BinaryOperator, left: Expression, right: Expression) {
    super();
    this.operator = operator;
    this.left = left;
    this.right = right;
  }

  /**
   * Evaluates both operands and applies the operator.
   *
   * @param env - Variable environment passed down to child nodes.
   * @returns The numeric result of the operation.
   * @throws On division by zero.
   */
  evaluate(env: Record<string, number>): number {
    /** Numeric value of the left operand. */
    const l = this.left.evaluate(env);
    /** Numeric value of the right operand. */
    const r = this.right.evaluate(env);

    switch (this.operator) {
      case "+":
        return l + r;
      case "-":
        return l - r;
      case "*":
        return l * r;
      case "/":
        if (r === 0) throw new Error("Division by zero.");
        return l / r;
    }
  }

  /**
   * Produces a plain-text string, inserting parentheses where required
   * by operator precedence and associativity.
   * Division is written inline, e.g. "1 / 4".
   *
   * @returns Plain-text representation, e.g. "x * (y + 1)".
   */
  toString(): string {
    /** Left operand string, wrapped in parentheses if needed. */
    const l = this.needsParens(this.left, "left")
      ? `(${this.left.toString()})`
      : this.left.toString();

    /** Right operand string, wrapped in parentheses if needed. */
    const r = this.needsParens(this.right, "right")
      ? `(${this.right.toString()})`
      : this.right.toString();

    return `${l} ${this.operator} ${r}`;
  }

  /**
   * Produces a LaTeX string. Division is rendered as a fraction using `\frac{}{}`.
   * All other operators are written inline, with parentheses where required.
   *
   * @returns LaTeX representation, e.g. "x^{2} + \frac{1}{4}".
   */
  toLaTeX(): string {
    if (this.operator === "/") {
      return `\\frac{${this.left.toLaTeX()}}{${this.right.toLaTeX()}}`;
    }

    /** Left operand LaTeX, wrapped in parentheses if needed. */
    const l = this.needsParens(this.left, "left")
      ? `(${this.left.toLaTeX()})`
      : this.left.toLaTeX();

    /** Right operand LaTeX, wrapped in parentheses if needed. */
    const r = this.needsParens(this.right, "right")
      ? `(${this.right.toLaTeX()})`
      : this.right.toLaTeX();

    return `${l} ${this.operator} ${r}`;
  }

  /**
   * Determines whether a child expression needs to be wrapped in parentheses
   * based on operator precedence and associativity rules.
   *
   * A child with lower precedence than the parent always needs parentheses.
   * A right-hand child with equal precedence needs parentheses for left-associative
   * operators (- and /) to prevent incorrect grouping,
   * e.g. "a - (b - c)" must not be written as "a - b - c".
   *
   * @param child - The child expression to check.
   * @param side  - Whether this child is on the left or right of the operator.
   * @returns True if parentheses are required around the child.
   */
  private needsParens(child: Expression, side: "left" | "right"): boolean {
    if (!(child instanceof BinaryOperation)) return false;

    /** Precedence level of this (parent) operator. */
    const parentPrec = precedence(this.operator);

    /** Precedence level of the child operator. */
    const childPrec = precedence(child.operator);

    if (childPrec < parentPrec) return true;

    // Same precedence on the right side of a left-associative operator:
    // e.g. a - (b - c) ≠ a - b - c
    if (childPrec === parentPrec && side === "right") {
      if (this.operator === "-" || this.operator === "/") return true;
    }

    return false;
  }
}

/**
 * Returns the precedence level of a binary operator.
 * Higher number means the operator binds more tightly.
 *
 * @param op - The operator to look up.
 * @returns Precedence level: 1 for + and -, 2 for * and /.
 */
function precedence(op: BinaryOperator): number {
  switch (op) {
    case "+":
    case "-":
      return 1;
    case "*":
    case "/":
      return 2;
  }
}

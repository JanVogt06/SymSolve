/**
 * All possible token types produced by the Tokenizer.
 *
 * - `Number`      — a numeric literal, e.g. 3, 3.14
 * - `Identifier`  — a variable name, e.g. x, alpha
 * - `Plus`        — the + operator
 * - `Minus`       — the - operator (binary subtraction or unary negation)
 * - `Star`        — the * operator
 * - `Slash`       — the / operator
 * - `Caret`       — the ^ operator (exponentiation)
 * - `LeftParen`   — opening parenthesis (
 * - `RightParen`  — closing parenthesis )
 * - `End`         — sentinel token marking the end of the input
 */
export type TokenType =
  | "Number"
  | "Identifier"
  | "Plus"
  | "Minus"
  | "Star"
  | "Slash"
  | "Caret"
  | "LeftParen"
  | "RightParen"
  | "End";

/**
 * A single token produced by the Tokenizer.
 */
export interface Token {
  /**
   * The category of this token.
   */
  type: TokenType;

  /**
   * The raw source text that this token was produced from.
   * For `End` tokens this is always an empty string.
   * Examples: "3.14", "x", "+", "("
   */
  value: string;
}

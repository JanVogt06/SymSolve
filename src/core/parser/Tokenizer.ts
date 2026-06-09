import type { Token, TokenType } from "./Token";

/**
 * Converts a raw input string into a flat list of tokens.
 *
 * Supported input:
 * - Numbers: integer and decimal, e.g. 3, 42, 3.14
 * - Identifiers: variable names starting with a letter or underscore, e.g. x, alpha, y2
 * - Operators: +  -  *  /  ^
 * - Parentheses: ( )
 * - Whitespace: silently ignored
 *
 * Example:
 *   "3 + 4 * x"  →  [Number("3"), Plus, Number("4"), Star, Identifier("x"), End]
 */
export class Tokenizer {
  /**
   * The raw input string to tokenize.
   */
  private readonly input: string;

  /**
   * The current read position within `input`.
   * Advances as characters are consumed.
   */
  private position: number = 0;

  /**
   * Creates a new Tokenizer for the given input string.
   *
   * @param input - The mathematical expression string to tokenize.
   */
  constructor(input: string) {
    this.input = input;
  }

  /**
   * Runs the tokenizer over the full input and returns the resulting token list.
   * The list always ends with a sentinel `End` token.
   *
   * @returns An array of tokens representing the input.
   * @throws If an unrecognised character is encountered.
   */
  tokenize(): Token[] {
    /** The accumulated list of tokens, built up as the input is consumed. */
    const tokens: Token[] = [];

    while (this.position < this.input.length) {
      this.skipWhitespace();
      if (this.position >= this.input.length) break;

      /** The character at the current read position. */
      const char = this.input[this.position];

      if (this.isDigit(char) || (char === "." && this.isDigit(this.peek(1)))) {
        tokens.push(this.readNumber());
        continue;
      }

      if (this.isLetter(char)) {
        tokens.push(this.readIdentifier());
        continue;
      }

      /** Attempt to match a single-character operator or parenthesis. */
      const singleChar = this.readSingleCharToken(char);
      if (singleChar) {
        tokens.push(singleChar);
        this.position++;
        continue;
      }

      throw new Error(`Unexpected character "${char}" at position ${this.position}.`);
    }

    tokens.push({ type: "End", value: "" });
    return tokens;
  }

  /**
   * Advances `position` past any whitespace characters.
   */
  private skipWhitespace(): void {
    while (this.position < this.input.length && /\s/.test(this.input[this.position])) {
      this.position++;
    }
  }

  /**
   * Reads a numeric literal (integer or decimal) starting at the current position.
   * Advances `position` to the character after the number.
   *
   * @returns A `Number` token whose value is the raw numeric string.
   */
  private readNumber(): Token {
    /** Index of the first character of this number. */
    const start = this.position;

    while (
      this.position < this.input.length &&
      (this.isDigit(this.input[this.position]) || this.input[this.position] === ".")
    ) {
      this.position++;
    }

    return { type: "Number", value: this.input.slice(start, this.position) };
  }

  /**
   * Reads an identifier (variable name) starting at the current position.
   * Advances `position` to the character after the identifier.
   *
   * @returns An `Identifier` token whose value is the variable name.
   */
  private readIdentifier(): Token {
    /** Index of the first character of this identifier. */
    const start = this.position;

    while (
      this.position < this.input.length &&
      (this.isLetter(this.input[this.position]) || this.isDigit(this.input[this.position]))
    ) {
      this.position++;
    }

    return { type: "Identifier", value: this.input.slice(start, this.position) };
  }

  /**
   * Attempts to match a single character to a known operator or parenthesis token.
   * Does NOT advance `position` — the caller is responsible for that.
   *
   * @param char - The character to match.
   * @returns The corresponding Token, or null if the character is not recognised.
   */
  private readSingleCharToken(char: string): Token | null {
    /** Mapping from source character to its token type. */
    const map: Record<string, TokenType> = {
      "+": "Plus",
      "-": "Minus",
      "*": "Star",
      "/": "Slash",
      "^": "Caret",
      "(": "LeftParen",
      ")": "RightParen",
    };

    /** The token type for this character, if recognised. */
    const type = map[char];
    return type ? { type, value: char } : null;
  }

  /**
   * Returns true if the given character is an ASCII digit (0–9).
   *
   * @param char - A single character to test.
   * @returns True if `char` is between "0" and "9" inclusive.
   */
  private isDigit(char: string): boolean {
    return char >= "0" && char <= "9";
  }

  /**
   * Returns true if the given character is an ASCII letter or underscore.
   * Used to identify the start (and continuation) of identifiers.
   *
   * @param char - A single character to test.
   * @returns True if `char` matches [a-zA-Z_].
   */
  private isLetter(char: string): boolean {
    return /[a-zA-Z_]/.test(char);
  }

  /**
   * Returns the character at `position + offset` without advancing `position`.
   * Returns an empty string if the offset is out of bounds.
   *
   * @param offset - How many characters ahead to look.
   * @returns The character at the lookahead position, or "" if out of bounds.
   */
  private peek(offset: number): string {
    return this.input[this.position + offset] ?? "";
  }
}

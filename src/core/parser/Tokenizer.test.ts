import { describe, it, expect } from "vitest";
import { Tokenizer } from "./Tokenizer";
import type { Token, TokenType } from "./Token";

/**
 * Convenience helper: tokenizes an input string and returns the resulting tokens.
 * @param input
 */
function tokenize(input: string): Token[] {
  return new Tokenizer(input).tokenize();
}

/**
 * Convenience helper: returns only the token *types*, in order.
 * Useful when the concrete values are irrelevant to the assertion.
 * @param input
 */
function types(input: string): TokenType[] {
  return tokenize(input).map((token) => token.type);
}

describe("Tokenizer", () => {
  describe("end-of-input handling", () => {
    it("always appends a single End sentinel token", () => {
      const tokens = tokenize("1");
      expect(tokens[tokens.length - 1]).toEqual({ type: "End", value: "" });
    });

    it("produces only an End token for the empty string", () => {
      expect(tokenize("")).toEqual([{ type: "End", value: "" }]);
    });

    it("produces only an End token for whitespace-only input", () => {
      expect(tokenize("   \t\n ")).toEqual([{ type: "End", value: "" }]);
    });
  });

  describe("numbers", () => {
    it("reads a single-digit integer", () => {
      expect(tokenize("7")).toEqual([
        { type: "Number", value: "7" },
        { type: "End", value: "" },
      ]);
    });

    it("reads a multi-digit integer", () => {
      expect(tokenize("12345")[0]).toEqual({ type: "Number", value: "12345" });
    });

    it("reads a decimal number", () => {
      expect(tokenize("3.14")[0]).toEqual({ type: "Number", value: "3.14" });
    });

    it("reads a number that starts with a decimal point", () => {
      // The tokenizer special-cases a leading "." followed by a digit.
      expect(tokenize(".5")[0]).toEqual({ type: "Number", value: ".5" });
    });

    it("keeps the raw string form and does not convert to a JS number", () => {
      // Conversion to a real number is the parser's job, not the tokenizer's.
      const token = tokenize("007")[0];
      expect(token.value).toBe("007");
      expect(typeof token.value).toBe("string");
    });
  });

  describe("identifiers", () => {
    it("reads a single-letter identifier", () => {
      expect(tokenize("x")[0]).toEqual({ type: "Identifier", value: "x" });
    });

    it("reads a multi-letter identifier", () => {
      expect(tokenize("alpha")[0]).toEqual({ type: "Identifier", value: "alpha" });
    });

    it("allows digits after the first letter", () => {
      expect(tokenize("y2")[0]).toEqual({ type: "Identifier", value: "y2" });
    });

    it("allows a leading underscore", () => {
      expect(tokenize("_tmp")[0]).toEqual({ type: "Identifier", value: "_tmp" });
    });

    it("does not let an identifier start with a digit (splits into number + identifier)", () => {
      // "2x" is a number followed by an identifier — implicit multiplication is
      // not handled by the tokenizer.
      expect(types("2x")).toEqual(["Number", "Identifier", "End"]);
    });
  });

  describe("operators and parentheses", () => {
    it.each([
      ["+", "Plus"],
      ["-", "Minus"],
      ["*", "Star"],
      ["/", "Slash"],
      ["^", "Caret"],
      ["(", "LeftParen"],
      [")", "RightParen"],
    ])("maps %s to the %s token", (char, expectedType) => {
      expect(tokenize(char)[0]).toEqual({ type: expectedType, value: char });
    });
  });

  describe("whitespace", () => {
    it("ignores spaces between tokens", () => {
      expect(types("1 + 2")).toEqual(["Number", "Plus", "Number", "End"]);
    });

    it("ignores tabs and newlines", () => {
      expect(types("1\t+\n2")).toEqual(["Number", "Plus", "Number", "End"]);
    });

    it("ignores leading and trailing whitespace", () => {
      expect(types("   1+2   ")).toEqual(["Number", "Plus", "Number", "End"]);
    });
  });

  describe("realistic expressions", () => {
    it("tokenizes '3 + 4 * x' into the expected sequence", () => {
      expect(tokenize("3 + 4 * x")).toEqual([
        { type: "Number", value: "3" },
        { type: "Plus", value: "+" },
        { type: "Number", value: "4" },
        { type: "Star", value: "*" },
        { type: "Identifier", value: "x" },
        { type: "End", value: "" },
      ]);
    });

    it("tokenizes a fully parenthesised expression", () => {
      expect(types("(1 + 2) * 3")).toEqual([
        "LeftParen",
        "Number",
        "Plus",
        "Number",
        "RightParen",
        "Star",
        "Number",
        "End",
      ]);
    });

    it("tokenizes adjacent operators (e.g. unary minus context)", () => {
      // The tokenizer does not distinguish unary from binary minus —
      // that distinction is made by the parser.
      expect(types("-(-x)")).toEqual([
        "Minus",
        "LeftParen",
        "Minus",
        "Identifier",
        "RightParen",
        "End",
      ]);
    });
  });

  describe("error handling", () => {
    it("throws on an unrecognised character", () => {
      expect(() => tokenize("1 $ 2")).toThrow(/Unexpected character/);
    });

    it("includes the offending character in the error message", () => {
      expect(() => tokenize("@")).toThrow(/@/);
    });

    it.each(["%", "&", "!", "?", "#"])("throws on the unsupported symbol %s", (symbol) => {
      expect(() => tokenize(symbol)).toThrow();
    });
  });
});

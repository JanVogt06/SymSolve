import { describe, it, expect } from "vitest";
import { Parser } from "./Parser";
import { NumberNode } from "../ast/nodes/Number";
import { Variable } from "../ast/nodes/Variable";
import { BinaryOperation } from "../ast/nodes/BinaryOperation";
import { Power } from "../ast/nodes/Power";
import { UnaryMinus } from "../ast/nodes/UnaryMinus";
import { Sine } from "../ast/nodes/functions/Sine";
import { Cosine } from "../ast/nodes/functions/Cosine";
import { Tangent } from "../ast/nodes/functions/Tangent";
import { ArcSine } from "../ast/nodes/functions/ArcSine";
import { ArcCosine } from "../ast/nodes/functions/ArcCosine";
import { ArcTangent } from "../ast/nodes/functions/ArcTangent";

/**
 * Parses an input string and evaluates the resulting AST in the given environment.
 * Lets us assert *meaning* (the number an expression computes to) in addition to
 * structure, which is the strongest end-to-end check of the parser.
 */
function evaluate(input: string, env: Record<string, number> = {}): number {
  return Parser.parse(input).evaluate(env);
}

describe("Parser", () => {
  describe("primary expressions", () => {
    it("parses a single number into a NumberNode", () => {
      const ast = Parser.parse("42");
      expect(ast).toBeInstanceOf(NumberNode);
      expect((ast as NumberNode).value).toBe(42);
    });

    it("parses a decimal number", () => {
      expect((Parser.parse("3.5") as NumberNode).value).toBe(3.5);
    });

    it("parses a single identifier into a Variable", () => {
      const ast = Parser.parse("x");
      expect(ast).toBeInstanceOf(Variable);
      expect((ast as Variable).name).toBe("x");
    });

    it("parses a parenthesised expression by unwrapping the parentheses", () => {
      // Parentheses are grouping only — they leave no node of their own in the AST.
      const ast = Parser.parse("(7)");
      expect(ast).toBeInstanceOf(NumberNode);
      expect((ast as NumberNode).value).toBe(7);
    });
  });

  describe("binary operations", () => {
    it("builds a BinaryOperation node for addition", () => {
      const ast = Parser.parse("1 + 2");
      expect(ast).toBeInstanceOf(BinaryOperation);
      expect((ast as BinaryOperation).operator).toBe("+");
    });

    it.each([
      ["1 + 2", 3],
      ["5 - 3", 2],
      ["4 * 6", 24],
      ["10 / 4", 2.5],
    ])("evaluates '%s' to %d", (input, expected) => {
      expect(evaluate(input)).toBe(expected);
    });
  });

  describe("operator precedence", () => {
    it("multiplies before adding: 3 + 4 * 2 = 11", () => {
      expect(evaluate("3 + 4 * 2")).toBe(11);
    });

    it("divides before subtracting: 10 - 8 / 4 = 8", () => {
      expect(evaluate("10 - 8 / 4")).toBe(8);
    });

    it("structures 3 + 4 * 2 as 3 + (4 * 2), not (3 + 4) * 2", () => {
      const ast = Parser.parse("3 + 4 * 2") as BinaryOperation;
      expect(ast.operator).toBe("+");
      expect(ast.left).toBeInstanceOf(NumberNode);
      expect(ast.right).toBeInstanceOf(BinaryOperation);
      expect((ast.right as BinaryOperation).operator).toBe("*");
    });

    it("lets parentheses override precedence: (3 + 4) * 2 = 14", () => {
      expect(evaluate("(3 + 4) * 2")).toBe(14);
    });

    it("gives exponentiation higher precedence than multiplication: 2 * 3 ^ 2 = 18", () => {
      expect(evaluate("2 * 3 ^ 2")).toBe(18);
    });
  });

  describe("associativity", () => {
    it("subtraction is left-associative: 10 - 3 - 2 = 5", () => {
      expect(evaluate("10 - 3 - 2")).toBe(5);
    });

    it("division is left-associative: 100 / 5 / 2 = 10", () => {
      expect(evaluate("100 / 5 / 2")).toBe(10);
    });

    it("structures 10 - 3 - 2 as (10 - 3) - 2", () => {
      const ast = Parser.parse("10 - 3 - 2") as BinaryOperation;
      expect(ast.operator).toBe("-");
      expect(ast.left).toBeInstanceOf(BinaryOperation);
      expect(ast.right).toBeInstanceOf(NumberNode);
      expect((ast.right as NumberNode).value).toBe(2);
    });

    it("exponentiation is right-associative: 2 ^ 2 ^ 3 = 256", () => {
      // Right-associative means 2 ^ (2 ^ 3) = 2 ^ 8 = 256, not (2 ^ 2) ^ 3 = 64.
      expect(evaluate("2 ^ 2 ^ 3")).toBe(256);
    });

    it("structures 2 ^ 2 ^ 3 as 2 ^ (2 ^ 3)", () => {
      const ast = Parser.parse("2 ^ 2 ^ 3") as Power;
      expect(ast).toBeInstanceOf(Power);
      expect(ast.exponent).toBeInstanceOf(Power);
    });
  });

  describe("unary minus", () => {
    it("parses a leading minus into a UnaryMinus node", () => {
      const ast = Parser.parse("-x");
      expect(ast).toBeInstanceOf(UnaryMinus);
    });

    it("evaluates -5 to -5", () => {
      expect(evaluate("-5")).toBe(-5);
    });

    it("evaluates a double negation --x as x", () => {
      // --x parses as -(-x); with x = 4 the result is 4.
      expect(evaluate("--x", { x: 4 })).toBe(4);
    });

    it("nests double negation as UnaryMinus(UnaryMinus(...))", () => {
      const ast = Parser.parse("--x") as UnaryMinus;
      expect(ast).toBeInstanceOf(UnaryMinus);
      expect(ast.operand).toBeInstanceOf(UnaryMinus);
    });

    it("applies unary minus to the whole factor: -3 * 2 = -6", () => {
      expect(evaluate("-3 * 2")).toBe(-6);
    });

    it("binds unary minus tighter than addition: -2 + 5 = 3", () => {
      expect(evaluate("-2 + 5")).toBe(3);
    });
  });

  describe("variables and environment", () => {
    it("evaluates an expression with a bound variable", () => {
      expect(evaluate("x + 1", { x: 9 })).toBe(10);
    });

    it("evaluates an expression with several variables", () => {
      expect(evaluate("a * b + c", { a: 2, b: 3, c: 4 })).toBe(10);
    });

    it("throws when a variable is missing from the environment", () => {
      expect(() => evaluate("x + 1")).toThrow(/not defined/);
    });
  });

  describe("complex expressions", () => {
    it("evaluates a deeply nested expression correctly", () => {
      // ((2 + 3) * 4 - 1) ^ 2 / 2  =  (5 * 4 - 1) ^ 2 / 2  =  19 ^ 2 / 2  =  180.5
      expect(evaluate("((2 + 3) * 4 - 1) ^ 2 / 2")).toBe(180.5);
    });

    it("handles nested parentheses", () => {
      expect(evaluate("(((1 + 1)))")).toBe(2);
    });
  });

  describe("function calls", () => {
    it.each([
      ["sin", Sine],
      ["cos", Cosine],
      ["tan", Tangent],
      ["arcsin", ArcSine],
      ["arccos", ArcCosine],
      ["arctan", ArcTangent],
    ])("parses %s(...) into the matching node", (name, NodeClass) => {
      expect(Parser.parse(`${name}(0)`)).toBeInstanceOf(NodeClass);
    });

    it.each([
      ["asin", ArcSine],
      ["acos", ArcCosine],
      ["atan", ArcTangent],
    ])("accepts the short alias %s as the same node", (alias, NodeClass) => {
      expect(Parser.parse(`${alias}(0)`)).toBeInstanceOf(NodeClass);
    });

    it("evaluates sin(0) = 0 and cos(0) = 1", () => {
      expect(evaluate("sin(0)")).toBe(0);
      expect(evaluate("cos(0)")).toBe(1);
    });

    it("satisfies the Pythagorean identity sin(x)^2 + cos(x)^2 = 1", () => {
      expect(evaluate("sin(x)^2 + cos(x)^2", { x: 1.2345 })).toBeCloseTo(1);
    });

    it("parses a nested function argument", () => {
      expect(evaluate("sin(cos(0))")).toBe(Math.sin(1));
    });

    it("binds a function call as a tight primary: 2 * sin(0) + 1 = 1", () => {
      expect(evaluate("2 * sin(0) + 1")).toBe(1);
    });

    it("allows a function call as the base of a power: cos(0)^2 = 1", () => {
      expect(evaluate("cos(0)^2")).toBe(1);
    });

    it("treats a function name without parentheses as an ordinary variable", () => {
      const ast = Parser.parse("sin");
      expect(ast).toBeInstanceOf(Variable);
      expect((ast as Variable).name).toBe("sin");
    });

    it("throws on an empty argument list, e.g. 'sin()'", () => {
      expect(() => Parser.parse("sin()")).toThrow();
    });

    it("throws on a missing closing parenthesis, e.g. 'sin(1'", () => {
      expect(() => Parser.parse("sin(1")).toThrow();
    });
  });

  describe("error handling", () => {
    it("throws on an unexpected token at the start", () => {
      expect(() => Parser.parse("* 3")).toThrow();
    });

    it("throws on a missing closing parenthesis", () => {
      expect(() => Parser.parse("(1 + 2")).toThrow(/Expected "RightParen"/);
    });

    it("throws on a dangling operator with no right operand", () => {
      expect(() => Parser.parse("3 +")).toThrow();
    });

    // --- Intended behaviour: see explanation. These encode what a robust parser
    //     SHOULD do; the current implementation may not yet satisfy them. ---

    it("throws on trailing input that is never consumed (e.g. '3 4')", () => {
      // A correct parser must reject leftover tokens instead of silently
      // returning just the first number.
      expect(() => Parser.parse("3 4")).toThrow();
    });

    it("throws on a stray closing parenthesis (e.g. '1 + 2)')", () => {
      expect(() => Parser.parse("1 + 2)")).toThrow();
    });
  });
});

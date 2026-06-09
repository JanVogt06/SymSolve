import { describe, it, expect } from "vitest";
import { UnaryMinus } from "./UnaryMinus";
import { NumberNode } from "./Number";
import { Variable } from "./Variable";
import { BinaryOperation } from "./BinaryOperation";

const num = (value: number) => new NumberNode(value);
const v = (name: string) => new Variable(name);

describe("UnaryMinus", () => {
  describe("evaluate", () => {
    it("negates a positive value", () => {
      expect(new UnaryMinus(num(5)).evaluate({})).toBe(-5);
    });

    it("negates a variable's value", () => {
      expect(new UnaryMinus(v("x")).evaluate({ x: 8 })).toBe(-8);
    });

    it("negates a negative value back to positive", () => {
      expect(new UnaryMinus(num(-3)).evaluate({})).toBe(3);
    });

    it("double negation returns the original value", () => {
      expect(new UnaryMinus(new UnaryMinus(v("x"))).evaluate({ x: 4 })).toBe(4);
    });

    it("negates the result of a compound operand", () => {
      // -(3 + 4) = -7
      const expr = new UnaryMinus(new BinaryOperation("+", num(3), num(4)));
      expect(expr.evaluate({})).toBe(-7);
    });
  });

  describe("toString", () => {
    it("prefixes a simple operand with a minus", () => {
      expect(new UnaryMinus(v("x")).toString()).toBe("-x");
    });

    // --- Intended behaviour: see explanation. Without parentheses, "-(3 + 4)"
    //     collapses to "-3 + 4", which evaluates differently. ---
    it("parenthesises a compound operand: -(3 + 4)", () => {
      const expr = new UnaryMinus(new BinaryOperation("+", num(3), num(4)));
      expect(expr.toString()).toBe("-(3 + 4)");
    });
  });

  describe("toLaTeX", () => {
    it("prefixes a simple operand with a minus", () => {
      expect(new UnaryMinus(v("x")).toLaTeX()).toBe("-x");
    });

    // --- Intended behaviour: see explanation. ---
    it("parenthesises a compound operand: -(3 + 4)", () => {
      const expr = new UnaryMinus(new BinaryOperation("+", num(3), num(4)));
      expect(expr.toLaTeX()).toBe("-(3 + 4)");
    });
  });
});

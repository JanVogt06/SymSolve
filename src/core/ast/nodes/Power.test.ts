import { describe, it, expect } from "vitest";
import { Power } from "./Power";
import { NumberNode } from "./Number";
import { Variable } from "./Variable";
import { BinaryOperation } from "./BinaryOperation";

const num = (value: number) => new NumberNode(value);
const v = (name: string) => new Variable(name);

describe("Power", () => {
  describe("evaluate", () => {
    it("raises a base to an exponent", () => {
      expect(new Power(num(2), num(10)).evaluate({})).toBe(1024);
    });

    it("treats the exponent 0 as 1", () => {
      expect(new Power(num(5), num(0)).evaluate({})).toBe(1);
    });

    it("treats the exponent 1 as the base itself", () => {
      expect(new Power(num(7), num(1)).evaluate({})).toBe(7);
    });

    it("supports fractional exponents (roots): 9 ^ 0.5 = 3", () => {
      expect(new Power(num(9), num(0.5)).evaluate({})).toBe(3);
    });

    it("supports negative exponents: 2 ^ -1 = 0.5", () => {
      expect(new Power(num(2), num(-1)).evaluate({})).toBe(0.5);
    });

    it("resolves variables in base and exponent", () => {
      expect(new Power(v("x"), v("n")).evaluate({ x: 3, n: 4 })).toBe(81);
    });
  });

  describe("toString", () => {
    it("renders a simple power with a caret", () => {
      expect(new Power(v("x"), num(2)).toString()).toBe("x^2");
    });

    // --- Intended behaviour: see explanation. A compound base must be
    //     parenthesised, otherwise the string is mathematically wrong. ---
    it("parenthesises a compound base: (x + 1)^2", () => {
      const expr = new Power(new BinaryOperation("+", v("x"), num(1)), num(2));
      expect(expr.toString()).toBe("(x + 1)^2");
    });
  });

  describe("toLaTeX", () => {
    it("renders the exponent in braces", () => {
      expect(new Power(v("x"), num(2)).toLaTeX()).toBe("x^{2}");
    });

    it("supports multi-character exponents inside the braces", () => {
      const expr = new Power(v("x"), new BinaryOperation("+", v("n"), num(1)));
      expect(expr.toLaTeX()).toBe("x^{n + 1}");
    });

    // --- Intended behaviour: see explanation. ---
    it("parenthesises a compound base: (x + 1)^{2}", () => {
      const expr = new Power(new BinaryOperation("+", v("x"), num(1)), num(2));
      expect(expr.toLaTeX()).toBe("(x + 1)^{2}");
    });
  });
});

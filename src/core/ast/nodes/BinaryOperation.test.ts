import { describe, it, expect } from "vitest";
import { BinaryOperation } from "./BinaryOperation";
import { NumberNode } from "./Number";
import { Variable } from "./Variable";
import { Power } from "./Power";

/** Shorthand constructors to keep the test bodies readable. */
const num = (value: number) => new NumberNode(value);
const v = (name: string) => new Variable(name);
const op = (
  operator: "+" | "-" | "*" | "/",
  left: NumberNode | Variable | BinaryOperation | Power,
  right: NumberNode | Variable | BinaryOperation | Power
) => new BinaryOperation(operator, left, right);

describe("BinaryOperation", () => {
  describe("evaluate", () => {
    it.each([
      ["+", 7, 5, 12],
      ["-", 7, 5, 2],
      ["*", 7, 5, 35],
      ["/", 8, 2, 4],
    ] as const)("computes %s of %d and %d", (operator, l, r, expected) => {
      expect(op(operator, num(l), num(r)).evaluate({})).toBe(expected);
    });

    it("recurses into nested operands", () => {
      // (2 + 3) * 4 = 20
      const expr = op("*", op("+", num(2), num(3)), num(4));
      expect(expr.evaluate({})).toBe(20);
    });

    it("passes the environment down to variable operands", () => {
      expect(op("+", v("x"), v("y")).evaluate({ x: 10, y: 4 })).toBe(14);
    });

    it("throws on division by zero", () => {
      expect(() => op("/", num(1), num(0)).evaluate({})).toThrow(/Division by zero/);
    });

    it("does not throw on a zero numerator", () => {
      expect(op("/", num(0), num(5)).evaluate({})).toBe(0);
    });
  });

  describe("toString — basic", () => {
    it("renders an addition with surrounding spaces", () => {
      expect(op("+", num(1), num(2)).toString()).toBe("1 + 2");
    });

    it("renders division inline with a slash", () => {
      expect(op("/", num(1), num(4)).toString()).toBe("1 / 4");
    });
  });

  describe("toString — parenthesisation", () => {
    it("wraps a lower-precedence child of a multiplication", () => {
      // a * (b + c)
      expect(op("*", v("a"), op("+", v("b"), v("c"))).toString()).toBe("a * (b + c)");
    });

    it("wraps a lower-precedence left child too", () => {
      // (a + b) * c
      expect(op("*", op("+", v("a"), v("b")), v("c")).toString()).toBe("(a + b) * c");
    });

    it("does NOT wrap a same-precedence left child of subtraction", () => {
      // (a - b) - c is the same as a - b - c, so no parentheses needed.
      expect(op("-", op("-", v("a"), v("b")), v("c")).toString()).toBe("a - b - c");
    });

    it("DOES wrap a same-precedence right child of subtraction", () => {
      // a - (b - c) must keep its parentheses; a - b - c would mean something else.
      expect(op("-", v("a"), op("-", v("b"), v("c"))).toString()).toBe("a - (b - c)");
    });

    it("DOES wrap a same-precedence right child of division", () => {
      // a / (b / c) is not the same as a / b / c.
      expect(op("/", v("a"), op("/", v("b"), v("c"))).toString()).toBe("a / (b / c)");
    });

    it("does NOT add parentheses around a higher-precedence child", () => {
      // a + b * c — multiplication binds tighter, so no parentheses.
      expect(op("+", v("a"), op("*", v("b"), v("c"))).toString()).toBe("a + b * c");
    });
  });

  describe("toLaTeX", () => {
    it("renders division as a fraction", () => {
      expect(op("/", num(1), num(4)).toLaTeX()).toBe("\\frac{1}{4}");
    });

    it("renders nested operands inside the fraction without extra parentheses", () => {
      // (a + b) / c  ->  \frac{a + b}{c}  (the fraction bar already groups them)
      expect(op("/", op("+", v("a"), v("b")), v("c")).toLaTeX()).toBe("\\frac{a + b}{c}");
    });

    it("renders addition inline", () => {
      expect(op("+", v("a"), v("b")).toLaTeX()).toBe("a + b");
    });

    it("combines a power and a fraction: x^{2} + \\frac{1}{4}", () => {
      const expr = op("+", new Power(v("x"), num(2)), op("/", num(1), num(4)));
      expect(expr.toLaTeX()).toBe("x^{2} + \\frac{1}{4}");
    });

    it("parenthesises a lower-precedence child in non-fraction LaTeX", () => {
      expect(op("*", v("a"), op("+", v("b"), v("c"))).toLaTeX()).toBe("a * (b + c)");
    });
  });
});

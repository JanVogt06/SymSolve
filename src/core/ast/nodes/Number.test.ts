import { describe, it, expect } from "vitest";
import { NumberNode } from "./Number";

describe("NumberNode", () => {
  describe("evaluate", () => {
    it("returns the stored value", () => {
      expect(new NumberNode(42).evaluate({})).toBe(42);
    });

    it("returns decimals unchanged", () => {
      expect(new NumberNode(3.14).evaluate({})).toBe(3.14);
    });

    it("returns negative values unchanged", () => {
      expect(new NumberNode(-7).evaluate({})).toBe(-7);
    });

    it("returns zero", () => {
      expect(new NumberNode(0).evaluate({})).toBe(0);
    });

    it("ignores the environment entirely", () => {
      // A literal has no variables, so any environment must give the same result.
      expect(new NumberNode(5).evaluate({ x: 999 })).toBe(5);
    });
  });

  describe("toString", () => {
    it("formats an integer", () => {
      expect(new NumberNode(8).toString()).toBe("8");
    });

    it("formats a decimal", () => {
      expect(new NumberNode(3.5).toString()).toBe("3.5");
    });

    it("drops a trailing .0 because JS numbers are not integer-typed", () => {
      expect(new NumberNode(4.0).toString()).toBe("4");
    });
  });

  describe("toLaTeX", () => {
    it("renders identically to toString for plain numbers", () => {
      expect(new NumberNode(3.14).toLaTeX()).toBe("3.14");
    });
  });
});

import { describe, it, expect } from "vitest";
import { Variable } from "./Variable";

describe("Variable", () => {
  describe("evaluate", () => {
    it("looks up the value bound in the environment", () => {
      expect(new Variable("x").evaluate({ x: 12 })).toBe(12);
    });

    it("resolves multi-letter names", () => {
      expect(new Variable("alpha").evaluate({ alpha: 1.5 })).toBe(1.5);
    });

    it("reads a value of zero correctly (not treated as missing)", () => {
      // `0 in env` is true, so a legitimate zero binding must be returned.
      expect(new Variable("x").evaluate({ x: 0 })).toBe(0);
    });

    it("throws when the variable is absent from the environment", () => {
      expect(() => new Variable("y").evaluate({})).toThrow(/not defined/);
    });

    it("includes the variable name in the error message", () => {
      expect(() => new Variable("missing").evaluate({})).toThrow(/missing/);
    });

    it("does not fall back to other bindings in the environment", () => {
      expect(() => new Variable("x").evaluate({ y: 5 })).toThrow();
    });
  });

  describe("toString", () => {
    it("returns the variable name verbatim", () => {
      expect(new Variable("x").toString()).toBe("x");
    });
  });

  describe("toLaTeX", () => {
    it("returns the variable name verbatim", () => {
      expect(new Variable("alpha").toLaTeX()).toBe("alpha");
    });
  });
});

import { describe, it } from "vitest";
import fc from "fast-check";
import { create, all } from "mathjs";
import { Expression } from "../ast/Expression";
import { Parser } from "./Parser";
import { NumberNode } from "../ast/nodes/Number";
import { Variable } from "../ast/nodes/Variable";
import { BinaryOperation } from "../ast/nodes/BinaryOperation";
import { Power } from "../ast/nodes/Power";
import { UnaryMinus } from "../ast/nodes/UnaryMinus";

/**
 * Property-based "sanity check" suite.
 *
 * Rather than a fixed list of cases, fast-check generates thousands of fresh
 * random expressions on EVERY run (locally and in CI), so each run exercises
 * different inputs. When a property fails, fast-check shrinks the input to a
 * minimal counter-example and prints the seed needed to reproduce it.
 *
 * Two kinds of invariant are checked:
 *   1. Correctness — SymSolve's result must match mathjs, an INDEPENDENT engine
 *      used here as an oracle. This is what catches real evaluation/printing
 *      bugs, because the expected value never comes from SymSolve itself.
 *   2. Self-consistency — the parser and printer must agree with each other
 *      (round-trip, stable serialization, always-parseable output).
 */

// mathjs configured to match SymSolve's division semantics: dividing by zero is
// an error, not Infinity. Any expression with an intermediate division by zero
// is then rejected by BOTH engines, so the two stay comparable.
const math = create(all, {});
math.import(
  {
    divide: (a: number, b: number) => {
      if (b === 0) throw new Error("division by zero");
      return a / b;
    },
  },
  { override: true }
);

// How many random cases fast-check generates per property, per run.
// Tune these in one place. The correctness check (vs. mathjs) gets the widest
// coverage; the structural self-consistency checks are cheaper and need fewer.
const ORACLE_RUNS = 10000;
const CONSISTENCY_RUNS = 10000;

const VARIABLE_NAMES = ["x", "y", "z"] as const;

/** A leaf node: a non-negative number literal or one of the variables. */
const leaf: fc.Arbitrary<Expression> = fc.oneof(
  fc.integer({ min: 0, max: 20 }).map((value) => new NumberNode(value)),
  fc
    .tuple(fc.integer({ min: 0, max: 9 }), fc.integer({ min: 0, max: 99 }))
    .map(([whole, frac]) => new NumberNode(Number(`${whole}.${frac}`))),
  fc.constantFrom(...VARIABLE_NAMES).map((name) => new Variable(name))
);

/**
 * An integer-valued exponent (optionally negated). Keeping exponents integer
 * guarantees real-valued results, so a random AST never evaluates to a complex
 * number (which a real-valued engine cannot represent).
 */
const exponent: fc.Arbitrary<Expression> = fc.oneof(
  fc.integer({ min: 0, max: 3 }).map((value) => new NumberNode(value)),
  fc.integer({ min: 1, max: 3 }).map((value) => new UnaryMinus(new NumberNode(value)))
);

/** A bounded-depth arbitrary that builds real Expression ASTs. */
const expression: fc.Arbitrary<Expression> = fc.letrec<{ node: Expression }>((tie) => ({
  node: fc.oneof(
    { depthSize: "medium", withCrossShrink: true },
    leaf,
    fc
      .tuple(fc.constantFrom<"+" | "-" | "*" | "/">("+", "-", "*", "/"), tie("node"), tie("node"))
      .map(([operator, left, right]) => new BinaryOperation(operator, left, right)),
    fc.tuple(tie("node"), exponent).map(([base, exp]) => new Power(base, exp)),
    tie("node").map((operand) => new UnaryMinus(operand))
  ),
})).node;

/** A random variable environment for x, y and z. */
const environment = fc.record({
  x: fc.integer({ min: -4, max: 4 }),
  y: fc.integer({ min: -4, max: 4 }),
  z: fc.integer({ min: -4, max: 4 }),
});

type EvalResult = { value: number; threw: false } | { threw: true };

/** Evaluates an expression with SymSolve, reporting whether it threw. */
function evaluateWithSymSolve(expr: Expression, scope: Record<string, number>): EvalResult {
  try {
    return { value: expr.evaluate(scope), threw: false };
  } catch {
    return { threw: true };
  }
}

/** Evaluates an expression string with the mathjs oracle. */
function evaluateWithOracle(source: string, scope: Record<string, number>): EvalResult {
  try {
    const value = math.evaluate(source, { ...scope }) as unknown;
    if (typeof value !== "number") return { threw: true };
    return { value, threw: false };
  } catch {
    return { threw: true };
  }
}

describe("expression engine — correctness against mathjs", () => {
  it("evaluates 10,000 random expressions exactly as the reference engine", () => {
    fc.assert(
      fc.property(expression, environment, (ast, scope) => {
        const ours = evaluateWithSymSolve(ast, scope);
        const reference = evaluateWithOracle(ast.toString(), scope);

        // Division by zero must be rejected by both engines (or by neither).
        if (ours.threw || reference.threw) return ours.threw === reference.threw;
        // Non-finite results (e.g. very large powers) are out of scope.
        if (!Number.isFinite(ours.value) || !Number.isFinite(reference.value)) return true;

        const tolerance = 1e-9 * Math.max(1, Math.abs(reference.value));
        return Math.abs(ours.value - reference.value) <= tolerance;
      }),
      { numRuns: ORACLE_RUNS }
    );
  });
});

describe("expression engine — parser/printer self-consistency", () => {
  it("parse(ast.toString()) preserves the meaning of the ast", () => {
    fc.assert(
      fc.property(expression, environment, (ast, scope) => {
        const direct = evaluateWithSymSolve(ast, scope);
        const reparsed = evaluateWithSymSolve(Parser.parse(ast.toString()), scope);

        if (direct.threw) return reparsed.threw;
        if (!Number.isFinite(direct.value)) return true;
        if (reparsed.threw || !Number.isFinite(reparsed.value)) return false;

        const tolerance = 1e-9 * Math.max(1, Math.abs(direct.value));
        return Math.abs(direct.value - reparsed.value) <= tolerance;
      }),
      { numRuns: CONSISTENCY_RUNS }
    );
  });

  it("never produces a string the parser rejects as a syntax error", () => {
    fc.assert(
      fc.property(expression, (ast) => {
        Parser.parse(ast.toString());
      }),
      { numRuns: CONSISTENCY_RUNS }
    );
  });

  it("serialization is a stable fixed point (printing is idempotent under re-parsing)", () => {
    fc.assert(
      fc.property(expression, (ast) => {
        const once = Parser.parse(ast.toString()).toString();
        const twice = Parser.parse(once).toString();
        return once === twice;
      }),
      { numRuns: CONSISTENCY_RUNS }
    );
  });
});

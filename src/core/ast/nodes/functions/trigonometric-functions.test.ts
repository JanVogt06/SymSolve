import { describe, it, expect } from "vitest";
import { Sine } from "./Sine";
import { Cosine } from "./Cosine";
import { Tangent } from "./Tangent";
import { ArcSine } from "./ArcSine";
import { ArcCosine } from "./ArcCosine";
import { ArcTangent } from "./ArcTangent";
import { Expression } from "../../Expression";
import { NumberNode } from "../Number";
import { Variable } from "../Variable";
import { BinaryOperation } from "../BinaryOperation";

const num = (value: number) => new NumberNode(value);

type FunctionConstructor = new (argument: Expression) => Expression;

// The six trigonometric nodes share the same structure, so they are tested
// with one parametrised table. 0.5 lies in the domain of every function here.
const functions: {
  name: string;
  latex: string;
  Node: FunctionConstructor;
  reference: (value: number) => number;
}[] = [
  { name: "sin", latex: "\\sin", Node: Sine, reference: Math.sin },
  { name: "cos", latex: "\\cos", Node: Cosine, reference: Math.cos },
  { name: "tan", latex: "\\tan", Node: Tangent, reference: Math.tan },
  { name: "arcsin", latex: "\\arcsin", Node: ArcSine, reference: Math.asin },
  { name: "arccos", latex: "\\arccos", Node: ArcCosine, reference: Math.acos },
  { name: "arctan", latex: "\\arctan", Node: ArcTangent, reference: Math.atan },
];

describe.each(functions)("$name", ({ name, latex, Node, reference }) => {
  it("evaluates by applying the matching Math function", () => {
    expect(new Node(num(0.5)).evaluate({})).toBe(reference(0.5));
  });

  it("resolves a variable argument from the environment", () => {
    expect(new Node(new Variable("x")).evaluate({ x: 0.25 })).toBe(reference(0.25));
  });

  it("renders toString with the canonical name", () => {
    expect(new Node(new Variable("x")).toString()).toBe(`${name}(x)`);
  });

  it("renders toLaTeX with the matching operator", () => {
    expect(new Node(new Variable("x")).toLaTeX()).toBe(`${latex}(x)`);
  });

  it("recurses into a compound argument", () => {
    const node = new Node(new BinaryOperation("+", new Variable("x"), num(1)));
    expect(node.toString()).toBe(`${name}(x + 1)`);
    expect(node.toLaTeX()).toBe(`${latex}(x + 1)`);
  });
});

describe("known values", () => {
  it("sin(0) = 0, cos(0) = 1, tan(0) = 0", () => {
    expect(new Sine(num(0)).evaluate({})).toBe(0);
    expect(new Cosine(num(0)).evaluate({})).toBe(1);
    expect(new Tangent(num(0)).evaluate({})).toBe(0);
  });

  it("arcsin(1) = π/2, arccos(1) = 0, arctan(1) = π/4", () => {
    expect(new ArcSine(num(1)).evaluate({})).toBeCloseTo(Math.PI / 2);
    expect(new ArcCosine(num(1)).evaluate({})).toBe(0);
    expect(new ArcTangent(num(1)).evaluate({})).toBeCloseTo(Math.PI / 4);
  });
});

describe("inverse trig domain", () => {
  it("arcsin and arccos return NaN outside [-1, 1]", () => {
    expect(Number.isNaN(new ArcSine(num(2)).evaluate({}))).toBe(true);
    expect(Number.isNaN(new ArcCosine(num(-2)).evaluate({}))).toBe(true);
  });

  it("arctan is defined for large arguments", () => {
    expect(new ArcTangent(num(1000)).evaluate({})).toBeCloseTo(Math.PI / 2, 2);
  });
});

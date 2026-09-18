import assert from "assert";
import * as io from "../lib";

/**
 * Bus with
 * - a literal
 * - other fields
 */
const alpha = io.Complex("Alpha", {
  tag: io.Literal("alpha"),
  name: io.string,
});

const beta = io.Complex("Beta", {
  tag: io.Literal("beta"),
  name: io.string,
});

/** Bus with a field that `delta` does not have. */
const gamma = io.Complex("Gamma", {
  tag: io.Literal("gamma"),
  period: io.Literal("YEAR"),
});

const delta = io.Complex("Delta", {
  tag: io.Literal("delta"),
  name: io.string,
});

const union = alpha.else(beta).else(gamma).else(delta);

const deltaConfig = { tag: "delta" as const, name: "x" };

describe("io.Bus.else union flags", () => {
  it("cannot serialize a config that sits behind a throwing bus", () => {
    assert.equal(union.deserialize(deltaConfig).isRight(), true);

    assert.throws(
      () => union.serialize(deltaConfig),
      /Cannot read properties of undefined \(reading '_list'\)/
    );

    assert.equal(
      union.serialize({ tag: "alpha" as const, name: "x" }).isRight(),
      true
    );
  });

  it("throws while combining a union with a bus that has no inner", () => {
    // Bus.create has no inner bus.
    const leaf = io.Bus.create<string, string>(
      "leaf",
      (i) => io.IOReject({ condition: "leaf", value: i }),
      (i) => io.IOReject({ condition: "leaf", value: i })
    );

    assert.equal(leaf.inner, null);

    assert.throws(
      () => alpha.else(beta).else(leaf),
      /Cannot use 'in' operator to search for 'Symbol\(%%TYPE_MARKER\)' in null/
    );

    assert.doesNotThrow(() => leaf.else(alpha.else(beta)));
  });
});

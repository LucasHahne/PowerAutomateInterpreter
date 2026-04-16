import { interpretWithTrace } from "./index";
import { createContext } from "../test/testHelpers";

describe("interpretWithTrace", () => {
  it("captures nested function call trace (start/end with parentIds)", () => {
    const ctx = createContext({});
    const { output, trace } = interpretWithTrace("add(1, mul(2, 3))", ctx);
    expect(output.success).toBe(true);

    const addStart = trace.find((e) => e.kind === "functionCallStart" && e.functionName === "add");
    const mulStart = trace.find((e) => e.kind === "functionCallStart" && e.functionName === "mul");
    expect(addStart).toBeTruthy();
    expect(mulStart).toBeTruthy();

    expect(mulStart!.parentId).toBe(addStart!.id);

    const mulEnd = trace.find((e) => e.kind === "functionCallEnd" && e.functionName === "mul");
    const addEnd = trace.find((e) => e.kind === "functionCallEnd" && e.functionName === "add");
    expect(mulEnd).toBeTruthy();
    expect(addEnd).toBeTruthy();
    expect(mulEnd!.parentId).toBe(mulStart!.id);
    expect(addEnd!.parentId).toBe(addStart!.id);
  });

  it("captures variables() resolution and selection steps", () => {
    const ctx = createContext({ variables: { arr: ["a", "b", "c"] } });
    const { output, trace } = interpretWithTrace("variables('arr')[1]", ctx);
    expect(output.success).toBe(true);

    const v = trace.find((e) => e.kind === "variablesCall" && e.name === "arr");
    expect(v).toBeTruthy();

    const sel = trace.find((e) => e.kind === "selectionStep");
    expect(sel).toBeTruthy();
    if (sel?.kind === "selectionStep") {
      expect(sel.index).toBe(1);
      expect(sel.result).toBe("b");
    }
  });
});


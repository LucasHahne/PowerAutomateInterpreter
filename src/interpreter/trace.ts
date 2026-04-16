export type TraceEvent =
  | {
      id: number;
      parentId: number | null;
      kind: "functionCallStart";
      functionName: string;
    }
  | {
      id: number;
      parentId: number | null;
      kind: "functionCallArgs";
      functionName: string;
      args: unknown[];
    }
  | {
      id: number;
      parentId: number | null;
      kind: "functionCallEnd";
      functionName: string;
      result: unknown;
    }
  | {
      id: number;
      parentId: number | null;
      kind: "parametersCall";
      name: string;
      value: unknown;
    }
  | {
      id: number;
      parentId: number | null;
      kind: "variablesCall";
      name: string;
      value: unknown;
    }
  | {
      id: number;
      parentId: number | null;
      kind: "selectionStep";
      optional: boolean;
      index: unknown;
      result: unknown;
    };

type WithoutIds<T> = T extends unknown ? Omit<T, "id" | "parentId"> : never;
export type TraceEventInput = WithoutIds<TraceEvent>;

export interface TraceEmitter {
  emit: (event: TraceEventInput) => number;
}

export interface TraceCollector {
  events: TraceEvent[];
  emitter: TraceEmitter;
  /** internal */
  _pushParent: (id: number) => void;
  /** internal */
  _popParent: () => void;
  /** internal */
  _currentParent: () => number | null;
}

export function createTraceCollector(): TraceCollector {
  const events: TraceEvent[] = [];
  let nextId = 1;
  const parentStack: number[] = [];

  const currentParent = () => (parentStack.length ? parentStack[parentStack.length - 1] : null);

  return {
    events,
    emitter: {
      emit(event) {
        const id = nextId++;
        events.push({
          ...(event as Omit<TraceEvent, "id" | "parentId">),
          id,
          parentId: currentParent(),
        } as TraceEvent);
        return id;
      },
    },
    _pushParent(id: number) {
      parentStack.push(id);
    },
    _popParent() {
      parentStack.pop();
    },
    _currentParent: currentParent,
  };
}


import { useState, useCallback } from 'react';
import { interpretWithTrace, type InterpretOutput } from '../interpreter';
import type { TraceEvent } from '../interpreter/trace';
import type { EvaluationContext } from '../interpreter/context';

export function useInterpreter(initialContext?: EvaluationContext) {
  const [context, setContext] = useState<EvaluationContext>(
    initialContext ?? { parameters: {}, variables: {} }
  );
  const [expression, setExpression] = useState('');
  const [output, setOutput] = useState<InterpretOutput | null>(null);
  const [trace, setTrace] = useState<TraceEvent[] | null>(null);

  const run = useCallback(() => {
    const result = interpretWithTrace(expression, context);
    setOutput(result.output);
    setTrace(result.trace);
    return result.output;
  }, [expression, context]);

  const runExpression = useCallback((expr: string) => {
    const result = interpretWithTrace(expr, context);
    setOutput(result.output);
    setTrace(result.trace);
    return result.output;
  }, [context]);

  return { context, setContext, expression, setExpression, output, trace, run, runExpression };
}

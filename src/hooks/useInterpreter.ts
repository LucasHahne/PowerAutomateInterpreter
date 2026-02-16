import { useState, useCallback } from 'react';
import { interpret, type InterpretOutput } from '../interpreter';
import type { EvaluationContext } from '../interpreter/context';

export function useInterpreter(initialContext?: EvaluationContext) {
  const [context, setContext] = useState<EvaluationContext>(
    initialContext ?? { parameters: {}, variables: {} }
  );
  const [expression, setExpression] = useState('');
  const [output, setOutput] = useState<InterpretOutput | null>(null);

  const run = useCallback(() => {
    const result = interpret(expression, context);
    setOutput(result);
    return result;
  }, [expression, context]);

  return { context, setContext, expression, setExpression, output, run };
}

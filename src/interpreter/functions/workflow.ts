import type { EvaluationContext } from '../context';
import { getParameter, getVariable, hasParameter, hasVariable } from '../context';

export const workflowFunctions: Record<string, (args: unknown[], ctx: EvaluationContext) => unknown> = {
  parameters: (args, ctx) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('parameters expects 1 argument');
    const name = String(args[0]);
    if (!hasParameter(ctx, name)) {
      throw new Error(`Parameter '${name}' is not defined`);
    }
    return getParameter(ctx, name);
  },
  variables: (args, ctx) => {
    /* c8 ignore next */
    if (args.length !== 1) throw new TypeError('variables expects 1 argument');
    const name = String(args[0]);
    if (!hasVariable(ctx, name)) {
      throw new Error(`Variable '${name}' is not defined`);
    }
    return getVariable(ctx, name);
  },
  triggerBody: (_args, ctx) => {
    if (ctx.triggerBody === undefined) {
      throw new Error('triggerBody is not defined. Add "Trigger body" in the input panel.');
    }
    return ctx.triggerBody;
  },
};

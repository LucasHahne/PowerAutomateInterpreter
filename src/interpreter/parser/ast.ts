export type AstNode =
  | FunctionCallNode
  | LiteralNode
  | ParametersCallNode
  | VariablesCallNode
  | SelectionNode;

export interface SelectionStep {
  optional: boolean;
  index: AstNode;
}

export interface SelectionNode {
  type: 'selection';
  base: AstNode;
  steps: SelectionStep[];
}

export interface FunctionCallNode {
  type: 'functionCall';
  name: string;
  args: AstNode[];
}

export interface LiteralNode {
  type: 'literal';
  value: unknown; // string | number | boolean | null
}

export interface ParametersCallNode {
  type: 'parametersCall';
  paramName: string;
}

export interface VariablesCallNode {
  type: 'variablesCall';
  varName: string;
}

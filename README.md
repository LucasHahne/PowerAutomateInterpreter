# Power Automate Expression Interpreter

A web-based interpreter for **Power Automate** (and Azure Logic Apps) expression language. Define variables, write expressions using built-in functions, and evaluate them in the browser—no cloud or Power Platform account required.

![PA Expression Interpreter](https://img.shields.io/badge/Power%20Automate-Expression%20Interpreter-6264A7?style=flat-square)

## Features

- **Expression editor** – Write Power Automate expressions with syntax highlighting and **intellisense** (function and variable suggestions as you type).
- **Functions dropdown** – Use the **Functions** button next to **Run** to open a searchable list of all supported functions; pick one to insert into the expression. Click any function name in the expression to open its **function reference** (signature, parameters, return type, examples, and a link to Microsoft docs).
- **Snippets dropdown** – Use the **Snippets** button to open an alphabetical list of example expressions (string, math, logical, collection, conversion, date/time, workflow). Choose a snippet to insert it into the editor.
- **Variables** – Define inputs with types: string, integer, float, boolean, object, and array. Variables are shown in a compact layout (multiple per row). Use **Add** to create one; click a variable to edit or remove it. When adding or editing a variable, a **Formatted variable value** panel shows a live preview of the parsed value.
- **Recent expressions** – The last 3 run expressions are listed under the editor. Use **Use** to load one back into the editor or **Run** to evaluate it again. The list is scrollable if entries are long.
- **Result panel** – Formatted output with syntax-highlighted values, expandable JSON for objects and arrays, and a **Copy** button. The page becomes scrollable when the result is large.
- **Errors** – Parse, type, and runtime errors are shown with clear messages below the editor.
- **Theme** – Toggle light or dark mode from the header.
- **Feedback** – **Feedback:** Report an issue and Suggest a feature (GitHub) are available at the bottom of the result column. Set `VITE_GITHUB_REPO` in `.env` to point to your repo for pre-filled issue templates.

## Supported expression language

The interpreter supports a subset of the [Workflow Definition Language functions](https://learn.microsoft.com/en-us/azure/logic-apps/workflow-definition-language-functions-reference), including:

| Category       | Examples                                                                             |
| -------------- | ------------------------------------------------------------------------------------ |
| **String**     | `concat`, `toLower`, `toUpper`, `length`, `substring`, `split`, `replace`, `trim`, … |
| **Math**       | `add`, `sub`, `mul`, `div`, `mod`, `min`, `max`, `rand`, …                           |
| **Logical**    | `and`, `or`, `not`, `if`, `equals`, `greater`, `less`, …                             |
| **Collection** | `createArray`, `first`, `last`, `join`, `contains`, `empty`, …                       |
| **Conversion** | `string`, `int`, `float`, `bool`, `json`, `base64`, …                                |
| **DateTime**   | `utcNow`, `formatDateTime`, `addDays`, `startOfDay`, …                               |
| **Workflow**   | `parameters`, `variables`, `body`, `triggerBody`, …                                  |

## Project structure

```
src/
├── main.tsx                 # App entry
├── App.tsx                  # Main layout, state, and grid (variables / expression / result | reference | variable value)
├── hooks/
│   └── useInterpreter.ts    # Interpreter state and run
├── interpreter/             # Expression engine
│   ├── index.ts             # interpret(expression, context)
│   ├── context.ts           # Variables/parameters types and helpers
│   ├── parser/              # Tokenizer + parser → AST
│   ├── evaluator.ts         # AST → value
│   ├── validator.ts         # Arity validation
│   └── functions/           # Built-in functions + metadata
├── components/
│   ├── layout/              # AppShell (header, theme toggle, main content)
│   ├── inputs/              # Variable definition panel, variable cards
│   ├── editor/              # Expression editor, Run button, Functions/Snippets dropdowns, intellisense
│   ├── output/              # Result panel, error display, GitHub feedback
│   └── reference/           # Function reference panel, variable add/edit form, formatted variable value
├── editor/
│   └── intellisenseContext.ts
├── constants/
│   └── snippets.ts         # Snippet definitions (alphabetically sorted for UI)
└── styles/
    └── theme.css
```

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**. You may use, share, and adapt the work for **non-commercial purposes only**; commercial use is not permitted. Attribution is required. See [LICENSE](LICENSE) for the full text.

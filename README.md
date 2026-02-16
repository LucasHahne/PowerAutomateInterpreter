# Power Automate Expression Interpreter

A web-based interpreter for **Power Automate** (and Azure Logic Apps) expression language. Define variables, write expressions using built-in functions, and evaluate them in the browser—no cloud or Power Platform account required.

![PA Expression Interpreter](https://img.shields.io/badge/Power%20Automate-Expression%20Interpreter-6264A7?style=flat-square)

## Features

- **Expression editor** – Write Power Automate expressions with syntax highlighting and **intellisense** (function/variable suggestions).
- **Variables & parameters** – Define inputs with types: string, integer, float, boolean, object, and array. Use them in expressions as `variables('name')` or `parameters('name')`.
- **Function reference** – Click any function in the expression to see its signature, parameters, return type, examples, and a link to Microsoft docs.
- **Rich result view** – Formatted output with expandable JSON for objects and arrays.
- **Clear errors** – Parse, type, and runtime errors with helpful messages.

## Supported expression language

The interpreter supports a subset of the [Workflow Definition Language functions](https://learn.microsoft.com/en-us/azure/logic-apps/workflow-definition-language-functions-reference), including:

| Category   | Examples |
|-----------|----------|
| **String** | `concat`, `toLower`, `toUpper`, `length`, `substring`, `split`, `replace`, `trim`, … |
| **Math**   | `add`, `sub`, `mul`, `div`, `mod`, `min`, `max`, `rand`, … |
| **Logical**| `and`, `or`, `not`, `if`, `equals`, `greater`, `less`, … |
| **Collection** | `createArray`, `first`, `last`, `join`, `contains`, `empty`, … |
| **Conversion** | `string`, `int`, `float`, `bool`, `json`, `base64`, … |
| **DateTime**   | `utcNow`, `formatDateTime`, `addDays`, `startOfDay`, … |
| **Workflow**   | `parameters`, `variables`, `body`, `triggerBody`, … |

## Tech stack

- **React 19** + **TypeScript**
- **Vite** – dev server and build
- **Tailwind CSS** – styling
- **Vitest** – unit tests and coverage

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm or yarn

### Install and run

```bash
# Clone the repository (or navigate to the project folder)
cd PowerAutomateInterpreter

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open the URL shown in the terminal (e.g. `http://localhost:5173`) to use the app.

### Build for production

```bash
npm run build
```

Output is in `dist/`. Serve it with any static host or run:

```bash
npm run preview
```

### Scripts

| Command            | Description                    |
|--------------------|--------------------------------|
| `npm run dev`      | Start Vite dev server          |
| `npm run build`    | Type-check and production build|
| `npm run preview`  | Preview production build       |
| `npm run lint`     | Run ESLint                     |
| `npm run test`     | Run Vitest (watch)             |
| `npm run test:run` | Run tests once                 |
| `npm run test:coverage` | Run tests with coverage  |

## Project structure

```
src/
├── main.tsx                 # App entry
├── App.tsx                  # Main layout and state
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
│   ├── layout/              # AppShell
│   ├── inputs/              # Variable definition panel
│   ├── editor/              # Expression editor, run button, intellisense
│   ├── output/              # Result panel, errors
│   └── reference/           # Function reference, variable editor
├── editor/
│   └── intellisenseContext.ts
└── styles/
    └── theme.css
```

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**. You may use, share, and adapt the work for **non-commercial purposes only**; commercial use is not permitted. Attribution is required. See [LICENSE](LICENSE) for the full text.

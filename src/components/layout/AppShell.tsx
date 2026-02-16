import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="h-screen min-h-screen flex flex-col text-slate-100 font-sans overflow-hidden">
      <header className="shrink-0 border-b border-slate-700/40 bg-slate-900/40 backdrop-blur-xl">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 lg:py-5">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Power Automate <span className="text-cyan-400">Expression Interpreter</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">
            Define variables, then evaluate expressions
          </p>
        </div>
      </header>
      <main className="flex-1 min-h-0 w-full overflow-auto">
        <div className="h-full w-full px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

import type { ReactNode } from "react";
import { useTheme } from "../../context/ThemeContext";

const APP_VERSION = "1.2.3.0";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      id="app"
      className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100 font-sans"
    >
      <header
        id="app-header"
        className="shrink-0 border-b border-slate-200 dark:border-slate-700/40 bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 lg:py-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-baseline gap-2 flex-wrap">
              <span>
                Power Automate{" "}
                <span className="text-cyan-500 dark:text-cyan-400">
                  Expression Interpreter
                </span>
              </span>
              <span
                className="text-sm font-normal text-slate-500 dark:text-slate-400"
                aria-label={`Version ${APP_VERSION}`}
              >
                v{APP_VERSION}
              </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1.5">
              Define variables, then evaluate expressions
            </p>
          </div>
          <button
            id="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            className="shrink-0 p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors"
          >
            {theme === "dark" ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>
      </header>
      <main id="main-content" className="flex-auto min-h-0 w-full">
        <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

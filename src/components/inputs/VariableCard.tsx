import type { InputType } from "../../interpreter/context";

const MAX_PREVIEW_LENGTH = 64;

function formatValuePreview(value: unknown, _type: InputType): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "boolean") return String(value);
  if (typeof value === "number") return String(value);
  if (typeof value === "string") {
    if (value.length <= MAX_PREVIEW_LENGTH) return JSON.stringify(value);
    return JSON.stringify(value.slice(0, MAX_PREVIEW_LENGTH) + "...");
  }
  if (Array.isArray(value)) {
    const raw = JSON.stringify(value);
    if (raw.length <= MAX_PREVIEW_LENGTH) return raw;
    return raw.slice(0, MAX_PREVIEW_LENGTH) + "...]";
  }
  if (typeof value === "object") {
    const raw = JSON.stringify(value);
    if (raw.length <= MAX_PREVIEW_LENGTH) return raw;
    return raw.slice(0, MAX_PREVIEW_LENGTH) + "...}";
  }
  return String(value);
}

interface VariableCardProps {
  name: string;
  type: InputType;
  value: unknown;
  onEdit: () => void;
  onRemove: (e: React.MouseEvent) => void;
}

export function VariableCard({
  name,
  type,
  value,
  onEdit,
  onRemove,
}: VariableCardProps) {
  const preview = formatValuePreview(value, type);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onEdit}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit();
        }
      }}
      className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/40 hover:border-slate-300 dark:hover:border-slate-600/60 transition-colors cursor-pointer group min-w-[200px] max-w-[320px] w-fit"
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden">
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate shrink-0 max-w-[28%] min-w-0 sm:max-w-[100px]">
          {name}
        </span>
        <span className="text-slate-600 dark:text-slate-400 text-sm shrink-0">
          {type}
        </span>
        <span
          className="text-slate-600 dark:text-slate-400 text-sm truncate min-w-0 flex-1"
          title={preview}
        >
          {preview}
        </span>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(e);
        }}
        aria-label={`Remove ${name}`}
        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 hover:border-red-500/50 border border-transparent transition-colors shrink-0"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}

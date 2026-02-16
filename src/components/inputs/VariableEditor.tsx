import type { InputType } from '../../interpreter/context';

interface VariableEditorProps {
  name: string;
  type: InputType;
  value: string;
  onNameChange: (name: string) => void;
  onTypeChange: (type: InputType) => void;
  onValueChange: (value: string) => void;
  onRemove: () => void;
}

const INPUT_TYPES: InputType[] = ['string', 'integer', 'float', 'boolean', 'object', 'array'];

export function VariableEditor({
  name,
  type,
  value,
  onNameChange,
  onTypeChange,
  onValueChange,
  onRemove,
}: VariableEditorProps) {
  const isJson = type === 'object' || type === 'array';
  return (
    <div className="flex flex-col gap-2.5 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-slate-600/60 transition-colors">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Name"
          className="input-dark flex-1"
        />
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value as InputType)}
          className="input-dark w-24"
        >
          {INPUT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onRemove}
          className="btn-secondary px-2 py-1 text-red-400 hover:border-red-500"
        >
          Remove
        </button>
      </div>
      {isJson ? (
        <textarea
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={type === 'object' ? '{"key": "value"}' : '[1, 2, 3]'}
          className="input-dark min-h-[60px] font-mono text-sm"
          rows={3}
        />
      ) : type === 'boolean' ? (
        <select
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className="input-dark"
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      ) : (
        <input
          type={type === 'integer' || type === 'float' ? 'number' : 'text'}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="Value"
          className="input-dark"
          step={type === 'float' ? 'any' : undefined}
        />
      )}
    </div>
  );
}

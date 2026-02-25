interface RunButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function RunButton({ onClick, disabled }: RunButtonProps) {
  return (
    <button
      id="run-button"
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="btn-primary h-[32px] w-[130px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
    >
      Run
    </button>
  );
}

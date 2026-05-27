type ProgramIntervalProps = {
  text: string;
};

export function ProgramInterval({ text }: ProgramIntervalProps) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="h-px flex-1 bg-hairline" />
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-smoke">
        {text}
      </span>
      <div className="h-px flex-1 bg-hairline" />
    </div>
  );
}

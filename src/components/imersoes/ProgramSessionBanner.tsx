type ProgramSessionBannerProps = {
  label: string;
  schedule: string;
  subtitle: string;
};

export function ProgramSessionBanner({
  label,
  schedule,
  subtitle,
}: ProgramSessionBannerProps) {
  return (
    <div className="w-full bg-ink px-6 py-4 text-bone">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-lime">
          {label}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-bone">
          {schedule}
        </span>
      </div>
      <p className="mt-1 text-body-s text-bone/70">{subtitle}</p>
    </div>
  );
}

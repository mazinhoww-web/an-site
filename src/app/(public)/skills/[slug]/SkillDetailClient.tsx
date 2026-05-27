'use client';

import { useState, useCallback } from 'react';
import { Download } from 'lucide-react';
import { DownloadGate } from '@/components/skills/DownloadGate';

type Props = {
  skillSlug: string;
  skillName: string;
  downloadLabel: string;
};

export function SkillDetailClient({ skillSlug, skillName, downloadLabel }: Props) {
  const [gateOpen, setGateOpen] = useState(false);
  const closeGate = useCallback(() => setGateOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => setGateOpen(true)}
        className="inline-flex items-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-lime transition-colors duration-150 hover:bg-lime hover:text-ink"
      >
        <Download size={16} strokeWidth={1.5} />
        {downloadLabel}
      </button>
      <p className="mt-3 text-body-s text-smoke">
        Compativel com Claude Code e Claude Cowork.
      </p>

      <DownloadGate
        skillSlug={skillSlug}
        skillName={skillName}
        hasAsset={true}
        isOpen={gateOpen}
        onClose={closeGate}
      />
    </>
  );
}

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
        className="inline-flex w-full items-center justify-center gap-2 bg-ink px-8 py-4 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime"
      >
        <Download size={16} strokeWidth={1.5} />
        {downloadLabel}
      </button>

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

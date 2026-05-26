'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Send, Loader2 } from 'lucide-react';
import { Mark } from '@/components/brand/Mark';
import { Label } from '@/components/brand/Label';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await signIn('resend', { email, redirect: false });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bone px-6">
      <div className="w-full max-w-sm border border-hairline bg-paper p-8">
        <div className="mb-8 flex justify-center">
          <Mark size="md" />
        </div>
        <Label withTab className="mb-4 block text-center">ADMIN</Label>

        {sent ? (
          <div className="text-center">
            <h2 className="font-heading text-h2">Verifique seu email.</h2>
            <p className="mt-3 text-body-s text-graphite">
              Um link de acesso foi enviado para {email}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke"
              >
                EMAIL
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={loading}
                className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-lime transition-colors duration-150 hover:bg-lime hover:text-ink disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
              ) : (
                <>
                  ENTRAR VIA MAGIC LINK
                  <Send size={16} strokeWidth={1.5} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

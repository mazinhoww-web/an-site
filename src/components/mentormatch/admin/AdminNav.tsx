import Link from 'next/link';

const ITEMS: [string, string][] = [
  ['users', 'Usuarios'],
  ['skills', 'Skills'],
  ['library', 'Biblioteca'],
  ['settings', 'Settings'],
  ['reports', 'Relatorios'],
  ['export', 'Export'],
  ['invitations', 'Convites'],
];

export function AdminNav({ slug }: { slug: string }) {
  return (
    <nav className="mb-8 flex flex-wrap gap-2 border-b border-mm-border pb-4">
      {ITEMS.map(([seg, label]) => (
        <Link
          key={seg}
          href={`/mentormatch/t/${slug}/admin/${seg}`}
          className="rounded border border-mm-border px-3 py-1.5 text-body-s text-mm-text hover:border-mm-primary"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

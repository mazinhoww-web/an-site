import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownContentProps = {
  content: string;
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-neutral max-w-none text-graphite prose-headings:font-heading prose-headings:text-ink prose-a:text-ink prose-a:underline prose-a:decoration-lime prose-blockquote:border-l-2 prose-blockquote:border-lime prose-strong:text-ink">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

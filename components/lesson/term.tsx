import { GLOSSARY } from "@/content/glosario";

export function Term({
  term,
  children,
}: {
  term: string;
  children?: React.ReactNode;
}) {
  const normalized = term.toLowerCase();
  const entry = GLOSSARY.find(
    (item) =>
      item.term.toLowerCase() === normalized ||
      (item.aliases ?? []).some((alias) => alias.toLowerCase() === normalized),
  );

  if (!entry) {
    return <span>{children ?? term}</span>;
  }

  return (
    <abbr
      title={entry.definition}
      className="cursor-help text-fg underline decoration-muted/50 decoration-dotted underline-offset-[3px]"
    >
      {children ?? term}
    </abbr>
  );
}

type SummaryCardProps = {
  label: string;
  value: string;
  note: string;
};

export default function SummaryCard({ label, value, note }: SummaryCardProps) {
  return (
    <article className="card summary-card">
      <p className="summary-card__label">{label}</p>
      <p className="summary-card__value">{value}</p>
      <p className="summary-card__note">{note}</p>
    </article>
  );
}

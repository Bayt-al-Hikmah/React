type Status = 'On track' | 'Needs attention' | 'Delayed';

export default function StatusBadge({ status }: { status: Status }) {
  const modifier = status === 'On track' ? 'success' : status === 'Delayed' ? 'danger' : 'warning';
  return <span className={`status-badge status-badge--${modifier}`}>{status}</span>;
}

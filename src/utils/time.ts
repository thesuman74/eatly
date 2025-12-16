// utils/time.ts
export function timeAgo(updatedAt?: string | null) {
  if (!updatedAt) return "N/A";

  const time = new Date(updatedAt);
  if (isNaN(time.getTime())) return "N/A";

  const now = new Date();
  const diffMs = now.getTime() - time.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hr ${diffMin % 60} min ago`;
  if (diffDay === 1) return "Yesterday";

  return `${diffDay} days ago`;
}

// utils/time.ts
export function timeAgo(updatedAt?: string | null) {
  if (!updatedAt) return "00:00";

  const time = new Date(updatedAt);
  if (isNaN(time.getTime())) return "00:00";

  const diffMs = Date.now() - time.getTime();
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

// utils/time.ts
export function getElapsedSeconds(createdAt?: string | null) {
  if (!createdAt) return 0;

  const created = new Date(createdAt);
  if (isNaN(created.getTime())) return 0;

  return Math.floor((Date.now() - created.getTime()) / 1000);
}

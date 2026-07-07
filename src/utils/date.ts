export function toDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return toDateISO(new Date());
}

export function getDayNumber(startDate: string, totalDays: number): number {
  const start = new Date(`${startDate}T00:00:00`).getTime();
  const today = new Date(`${todayISO()}T00:00:00`).getTime();
  const day = Math.floor((today - start) / 86_400_000) + 1;
  return Math.min(Math.max(day, 1), totalDays);
}

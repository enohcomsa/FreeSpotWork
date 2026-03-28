export function todayIsoDateUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

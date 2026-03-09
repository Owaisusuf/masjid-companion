export function getLocalISODate(d: Date = new Date()): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function getISODateInTimeZone(timeZone: string, d: Date = new Date()): string {
  // Uses timezone-aware formatting to avoid UTC off-by-one issues.
  const parts = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);

  const yyyy = parts.find((p) => p.type === "year")?.value ?? "0000";
  const mm = parts.find((p) => p.type === "month")?.value ?? "00";
  const dd = parts.find((p) => p.type === "day")?.value ?? "00";
  return `${yyyy}-${mm}-${dd}`;
}

export const MASJID_TIMEZONE = "Asia/Kolkata";

export function getMasjidISODate(d: Date = new Date()): string {
  return getISODateInTimeZone(MASJID_TIMEZONE, d);
}

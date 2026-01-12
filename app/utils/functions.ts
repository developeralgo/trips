function calculateDuration(start: string, end: string) {
  if (!start || !end) return 0;

  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  let startMinutes = sh * 60 + sm;
  let endMinutes = eh * 60 + em;

  // Handle overnight (e.g. 22:00 → 06:00)
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }

  return endMinutes - startMinutes; // minutes
}

function buildDateTime(date: string, time: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);

  // month is 0-based in JS
  return new Date(year, month - 1, day, hours, minutes);
}

export { calculateDuration, buildDateTime };

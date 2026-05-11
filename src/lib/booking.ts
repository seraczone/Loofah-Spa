import { addMinutes } from "date-fns";

export const BOOKING_TIMEZONE = "Africa/Lagos";
export const BOOKING_SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"] as const;

export function durationToMinutes(raw: string) {
  const values = raw.match(/\d+/g)?.map((value) => Number(value)).filter((value) => !Number.isNaN(value)) ?? [];
  if (values.length === 0) return 60;
  return Math.max(...values);
}

export function buildAppointmentWindow(date: string, time: string, durationMinutes: number) {
  const start = new Date(`${date}T${time}:00+01:00`);
  const end = addMinutes(start, durationMinutes);
  return {
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}

export function formatSlotLabel(time: string) {
  const [hours, minutes] = time.split(":").map((value) => Number(value));
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
}

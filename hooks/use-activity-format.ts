import { subDays } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export function useActivityFormat() {
  const formatDistance = (meters: number) => {
    return (meters / 1000).toFixed(2);
  };

  const formatPace = (speedInMetersPerSecond: number) => {
    if (!speedInMetersPerSecond) return "0:00";
    // pace is minutes per km
    const secondsPerKm = 1000 / speedInMetersPerSecond;
    const mins = Math.floor(secondsPerKm / 60);
    const secs = Math.floor(secondsPerKm % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const extractTimezone = (tzString?: string) => {
    if (!tzString) return Intl.DateTimeFormat().resolvedOptions().timeZone;
    // e.g. "(GMT+07:00) Asia/Jakarta" -> "Asia/Jakarta"
    const parts = tzString.split(" ");
    return parts.length > 1 ? parts[1] : tzString;
  };

  const formatDate = (dateString: string, timezone?: string) => {
    const date = new Date(dateString);
    const tz = extractTimezone(timezone);

    const targetDateStr = formatInTimeZone(date, tz, "yyyy-MM-dd");
    const todayStr = formatInTimeZone(new Date(), tz, "yyyy-MM-dd");
    const yesterdayStr = formatInTimeZone(
      subDays(new Date(), 1),
      tz,
      "yyyy-MM-dd"
    );

    if (targetDateStr === todayStr) return "Today";
    if (targetDateStr === yesterdayStr) return "Yesterday";

    return formatInTimeZone(date, tz, "EEE, MMM d");
  };

  const formatTimeOfDay = (dateString: string, timezone?: string) => {
    const date = new Date(dateString);
    const tz = extractTimezone(timezone);
    return formatInTimeZone(date, tz, "hh:mm a");
  };

  return {
    formatDistance,
    formatPace,
    formatTime,
    formatDate,
    formatTimeOfDay,
    extractTimezone,
  };
}

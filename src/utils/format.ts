import dayjs from "dayjs";

export function dateTimeFormat(date: Date | number | undefined, format = "YYYY-MM-DD HH:mm:ss") {
  if (!date) return "";
  return dayjs(date).format(format);
}

export function defaultFormatter(row: any, column: any) {
  const value = row[column.property];
  return value ? value : "-";
}

export function dateTimeDifference(startTime: Date | number | undefined, endTime: Date | number | undefined) {
  if (!startTime || !endTime) return "";
  const diff = dayjs(endTime).valueOf() - dayjs(startTime).valueOf();
  const timeDuration = dayjs.duration(diff);
  const hour = String(timeDuration.hours()).padStart(2, "0");
  const minute = String(timeDuration.minutes()).padStart(2, "0");
  const second = String(timeDuration.seconds()).padStart(2, "0");
  const hourStr = Number(hour) > 0 ? `${String(hour).padStart(2, "0")}小时` : "";
  const minuteStr = Number(minute) > 0 ? `${String(minute).padStart(2, "0")}分钟` : "";
  const secondStr = Number(second) > 0 ? `${String(second).padStart(2, "0")}秒` : "";

  return `${hourStr}${minuteStr}${secondStr}` || "00秒";
}

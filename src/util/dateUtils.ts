import _ from "lodash";

export function prettifyTimestamp(timestamp: Date | string) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  return `${_.padStart(hours.toString(), 2, "0")}:${_.padStart(
    minutes.toString(),
    2,
    "0",
  )}:${_.padStart(seconds.toString(), 2, "0")}.${_.padStart(
    milliseconds.toString(),
    3,
    "0",
  )}`;
}

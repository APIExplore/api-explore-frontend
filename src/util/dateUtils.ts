import _ from "lodash";

export function prettifyTimestamp(
  timestamp: Date | string,
  showMilliseconds = true,
) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  let formattedTime = `${_.padStart(hours.toString(), 2, "0")}:${_.padStart(
    minutes.toString(),
    2,
    "0",
  )}:${_.padStart(seconds.toString(), 2, "0")}`;

  if (showMilliseconds) {
    formattedTime += `.${_.padStart(milliseconds.toString(), 3, "0")}`;
  }

  return formattedTime;
}

export const timerFormat = (ms = 0) => {
  let seconds = Math.trunc(ms / 1000);
  let milliseconds = Math.trunc(ms % 1000 / 10);;
  let secondsValue;
  let millisecondsValue;

  if (seconds < 10) {
    secondsValue = "0" + seconds;
  } else {
    secondsValue = seconds;
  }

  if (milliseconds < 10) {
    millisecondsValue = "0" + milliseconds;
  } else {
    millisecondsValue = milliseconds;
  }

  return secondsValue + ":" + millisecondsValue;
};

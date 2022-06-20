export const timerFormat = (ms = 0) => {
  let minutes = Math.trunc(ms / 60000);
  let seconds = Math.trunc((ms % 60000) / 1000);
  let milliseconds = Math.trunc((ms % 1000) / 10);
  let minutesValue;
  let secondsValue;
  let millisecondsValue;

  if (minutes === 0) {
    minutesValue = "00";
  } else if (minutes < 10) {
    minutesValue = "0" + minutes;
  } else {
    minutesValue = minutes;
  }

  if (seconds === 0) {
    secondsValue = "00";
  } else if (seconds < 10) {
    secondsValue = "0" + seconds;
  } else {
    secondsValue = seconds;
  }

  if (milliseconds === 0) {
    millisecondsValue = "00";
  } else if (milliseconds < 10) {
    millisecondsValue = "0" + milliseconds;
  } else {
    millisecondsValue = milliseconds;
  }

  return minutesValue + ":" + secondsValue + ":" + millisecondsValue;
};

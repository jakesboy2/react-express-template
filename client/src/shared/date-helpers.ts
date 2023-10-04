export const formatDateTimeAsTime = (date: Date) => {
  let timeIndicator = 'AM';
  let hours = date.getHours();
  if (hours > 12) {
    timeIndicator = 'PM';
    hours -= 12;
  }
  hours = hours === 0 ? 12 : hours;
  let minutes: number | string = date.getMinutes();
  minutes = minutes < 10 ? `0${minutes.toString()}` : minutes.toString();

  return `${hours}:${minutes}${timeIndicator}`;
};

export const formatDateAsShortDate = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`;

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const convertDateToDayOfWeek = (date: Date) => weekdays[date.getDay()];

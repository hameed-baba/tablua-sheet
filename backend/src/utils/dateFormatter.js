module.exports = function dateFormatter(dateTimeString) {
  // dateTimeString = dateTimeString.replace(' ', 'T');
  dateTimeString = dateTimeString.split(".")[0].replace(" ", "T") + "Z";

  let localDate = new Date(dateTimeString);

  let options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  let gmtFormatted = localDate.toLocaleString("en-US", options);

  return gmtFormatted;
};

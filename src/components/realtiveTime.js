function formatDate(date) {
  const difference = Date.now() - date;
  const RelativeTimeFormat = new Intl.RelativeTimeFormat(`da`, { style: `narrow` });
  if (difference < 60) {
    // Less than a minute has passed:
    return RelativeTimeFormat.format(difference, "second");
  } else if (difference < 3600) {
    // Less than an hour has passed:
    return RelativeTimeFormat.format(Math.floor(difference / 60), "minute");
  } else if (difference < 86400) {
    // Less than a day has passed:
    return RelativeTimeFormat.format(Math.floor(difference / 3600), "hour");
  } else if (difference < 2620800) {
    // Less than a month has passed:
    return RelativeTimeFormat.format(Math.floor(difference / 86400, "day"));
  } else {
    return new Intl.DateTimeFormat("da-DK").format(date);
  }
  //   else if (difference < 31449600) {
  //     // Less than a year has passed:
  //     output = `${Math.floor(difference / 2620800)} months ago`;
  //   } else {
  //     // More than a year has passed:
  //     output = `${Math.floor(difference / 31449600)} years ago`;
  //   }
}

//To convert a date in the format "DD/MM-YYYY HH:MM" to a JavaScript Date object, you can use the following code:
function convertDate(dateString) {
  // Split the date string into its components
  var dateComponents = dateString.split(" ");
  var datePart = dateComponents[0];
  var timePart = dateComponents[1];

  // Split the date part into its components
  datePart = datePart.split("/");
  var day = parseInt(datePart[0]);
  var month = parseInt(datePart[1]);
  var year = parseInt(datePart[2]);

  // Split the time part into its components
  timePart = timePart.split(":");
  var hour = parseInt(timePart[0]);
  var minute = parseInt(timePart[1]);

  // Create a new JavaScript Date object and return it
  return new Date(year, month - 1, day, hour, minute);
}

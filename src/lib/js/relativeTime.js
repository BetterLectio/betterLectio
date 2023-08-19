export function formatDate(date) {
  const difference = ((date.getTime() - Date.now()) / 1000).toFixed(0);
  const RelativeTimeFormat = new Intl.RelativeTimeFormat(`da`, { style: `long` });
  if (Math.abs(difference) < 60) {
    // Less than a minute has passed:
    return RelativeTimeFormat.format(difference, "second");
  } else if (Math.abs(difference) < 3600) {
    // Less than an hour has passed:
    return RelativeTimeFormat.format(Math.floor(difference / 60), "minute");
  } else if (Math.abs(difference) < 86400) {
    // Less than a day has passed:
    return RelativeTimeFormat.format(Math.floor(difference / 3600), "hour");
  } else if (Math.abs(difference) < 2620800) {
    // Less than a month has passed:
    return RelativeTimeFormat.format(Math.floor(difference / 86400), "day");
  } else if (Math.abs(difference) < 31449600) {
    // Less than a year has passed:
    return RelativeTimeFormat.format(Math.floor(difference / 2620800), "month");
  } else {
    // More than a year has passed:
    return new Intl.DateTimeFormat("da-DK").format(date);
  }
  // else {
  //   return new Intl.DateTimeFormat("da-DK").format(date);
  // }
}

// //To convert a date in the format "DD/MM-YYYY HH:MM" to a JavaScript Date object, you can use the following code:
// function convertDate(dateString) {
//   // Split the date string into its components
//   var dateComponents = dateString.split(" ");
//   var datePart = dateComponents[0];
//   var timePart = dateComponents[1];

//   // Split the date part into its components
//   datePart = datePart.split("/");
//   var day = parseInt(datePart[0]);
//   var month = parseInt(datePart[1]);
//   var year = parseInt(datePart[2]);

//   // Split the time part into its components
//   timePart = timePart.split(":");
//   var hour = parseInt(timePart[0]);
//   var minute = parseInt(timePart[1]);

//   // Create a new JavaScript Date object and return it
//   return new Date(year, month - 1, day, hour, minute);
// }

// function convertDate(dateString) {
//   const day = dateString.substring(0, 2);
//   const time = dateString.substring(3);
//   const [hours, minutes] = time.split(":");

//   // Create a new date object with the current year and month
//   // Set the day based on the input string
//   // Set the hours and minutes based on the input string
//   const date = new Date();
//   date.setFullYear(new Date().getFullYear());
//   date.setMonth(new Date().getMonth());
//   date.setDate(getDayFromName(day));
//   date.setHours(parseInt(hours));
//   date.setMinutes(parseInt(minutes));

//   return date;
// }

// function getDayFromName(dayName) {
//   const days = ["sø", "ma", "ti", "on", "to", "fr", "lø"];
//   return days.indexOf(dayName) + 1;
// }

// const dateString = "sø 15:30";
// const date = convertDate(dateString);

////////////////

// function convertDate(dateString) {
//   const regex = /^(sø|ma|ti|on|to|fr|lø)\s(\d{2}:\d{2})$/;
//   const match = regex.exec(dateString);
//   if (match) {
//     const day = match[1];
//     const time = match[2];
//     const [hours, minutes] = time.split(":");

//     // Create a new date object with the current year and month
//     // Set the day based on the input string
//     // Set the hours and minutes based on the input string
//     const date = new Date();
//     date.setFullYear(new Date().getFullYear());
//     date.setMonth(new Date().getMonth());
//     date.setDate(getDayFromName(day));
//     date.setHours(parseInt(hours));
//     date.setMinutes(parseInt(minutes));

//     return date;
//   }

//   const regex2 = /^(\d{2})\/(\d{2})-(\d{4})$/;
//   const match2 = regex2.exec(dateString);
//   if (match2) {
//     const day = match2[1];
//     const month = match2[2];
//     const year = match2[3];

//     // Create a new date object with the specified year, month, and day
//     // Set the time to midnight
//     const date = new Date();
//     date.setFullYear(parseInt(year));
//     date.setMonth(parseInt(month) - 1);
//     date.setDate(parseInt(day));
//     date.setHours(0);
//     date.setMinutes(0);

//     return date;
//   }

//   const regex3 = /^(\d{2}:\d{2})$/;
//   const match3 = regex3.exec(dateString);
//   if (match3) {
//     const time = match3[1];
//     const [hours, minutes] = time.split(":");

//     // Create a new date object with the current year, month, and day
//     // Set the hours and minutes based on the input string
//     const date = new Date();
//     date.setFullYear(new Date().getFullYear());
//     date.setMonth(new Date().getMonth());
//     date.setDate(new Date().getDate());
//     date.setHours(parseInt(hours));
//     date.setMinutes(parseInt(minutes));

//     return date;
//   }

//   throw new Error("Invalid date string");
// }

// function getDayFromName(dayName) {
//   const days = ["sø", "ma", "ti", "on", "to", "fr", "lø"];
//   return days.indexOf(dayName) + 1;
// }

// const dateString1 = "sø 15:30";
// const date1 = convertDate(dateString1);

// const dateString2 = "22/12-2022";
// const date2 = convertDate(dateString2);

// const dateString3 = "15:30";
// const date3 = convertDate(dateString3);

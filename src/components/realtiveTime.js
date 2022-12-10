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

const timestamp = (time, fullTime = false) => {
  let rightDecl = count => {
    let num = count % 10;
    if (num === 1) {
      return "у";
    } else if (num > 1 && num <= 4) {
      return "ы";
    } else {
      return "";
    }
  };

  let d = new Date(),
    lmt = time,
    startToday = new Date().setHours(0, 0, 0, 0),
    startYest = startToday - 86400000,
    diff = d - lmt;

  if (diff < 60000) {
    let count = Math.floor(diff / 1000);
    return count + " " + "секунд" + rightDecl(count) + " назад";
  } else if (diff < 3600000) {
    let count = Math.floor(diff / 60000);
    return count + " " + "минут" + rightDecl(count) + " назад";
  } else if (diff < d - startToday) {
    var options = {
      timezone: "UTC+1",
      hour: "numeric",
      minute: "numeric"
    };

    return "сегодня, " + new Date(lmt).toLocaleString("ru", options);
  } else if (diff < d - startYest) {
    var options = {
      timezone: "UTC",
      hour: "numeric",
      minute: "numeric"
    };

    return "вчера, " + new Date(lmt).toLocaleString("ru", options);
  } else {
    var options = !fullTime
      ? {
          timezone: "UTC",
          month: "long",
          day: "numeric"
        }
      : {
          timezone: "UTC",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric"
        };

    return new Date(lmt).toLocaleString("ru", options);
  }
};

export default timestamp;

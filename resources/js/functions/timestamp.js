import translate from "./translate";

const timestamp = (time, fullTime = false) => {
  let rightDecl = count => {
    let num = count % 10;
    switch (lang) {
      case "ru":
        if (num === 1) {
          return "у";
        } else if (num > 1 && num <= 4) {
          return "ы";
        } else {
          return "";
        }
        break;
      case "en":
        if (num === 1) {
          return "";
        } else {
          return "s";
        }
        break;
    }
  };

  let d = new Date(),
    lmt = time,
    startToday = new Date().setHours(0, 0, 0, 0),
    startYest = startToday - 86400000,
    diff = d - lmt;

  if (diff < 60000) {
    let count = Math.floor(diff / 1000);
    return (
      count +
      " " +
      translate("time.second") +
      rightDecl(count) +
      " " +
      translate("time.ago")
    );
  } else if (diff < 3600000) {
    let count = Math.floor(diff / 60000);
    return (
      count +
      " " +
      translate("time.minute") +
      rightDecl(count) +
      " " +
      translate("time.ago")
    );
  } else if (diff < d - startToday) {
    var options = {
      timezone: "UTC+1",
      hour: "numeric",
      minute: "numeric"
    };

    return (
      translate("time.today") +
      ", " +
      new Date(lmt).toLocaleString(lang, options)
    );
  } else if (diff < d - startYest) {
    var options = {
      timezone: "UTC",
      hour: "numeric",
      minute: "numeric"
    };

    return (
      translate("time.yesterday") +
      ", " +
      new Date(lmt).toLocaleString(lang, options)
    );
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

    return new Date(lmt).toLocaleString(lang, options);
  }
};

export default timestamp;

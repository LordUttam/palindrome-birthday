const datePicker = document.querySelector("#datePicker");
const submitBtn = document.querySelector("#submitBtn");
const resultDiv = document.querySelector("#result");

function reverseString(str) {
  let charList = str.split("");
  let reversedList = charList.reverse();
  let reversedStr = reversedList.join("");

  return reversedStr;
}

function isPalindrome(str) {
  let reversedStr = reverseString(str);
  if (reversedStr == str) {
    return true;
  } else {
    return false;
  }
}

function dateToString(date) {
  let dateInStr = { day: "", month: "", year: "" };

  if (date.day < 10) {
    dateInStr.day = "0" + date.day.toString();
  } else {
    dateInStr.day = date.day.toString();
  }

  if (date.month < 10) {
    dateInStr.month = "0" + date.month.toString();
  } else {
    dateInStr.month = date.month.toString();
  }

  dateInStr.year = date.year.toString();
  return dateInStr;
}

function getVariations(dateInStr) {
  let ddmmyyyy = dateInStr.day + dateInStr.month + dateInStr.year;
  let mmddyyyy = dateInStr.month + dateInStr.day + dateInStr.year;
  let yyyymmdd = dateInStr.year + dateInStr.month + dateInStr.day;
  let ddmmyy = dateInStr.day + dateInStr.month + dateInStr.year.slice(-2);
  let mmddyy = dateInStr.month + dateInStr.day + dateInStr.year.slice(-2);
  let yymmdd = dateInStr.year.slice(-2) + dateInStr.month + dateInStr.day;

  let variations = [ddmmyyyy, mmddyyyy, yyyymmdd, ddmmyy, mmddyy, yymmdd];

  return variations;
}

function checkPalindromeForVariations(dateInStr) {
  let allFormats = getVariations(dateInStr);

  let result = false;

  for (let i of allFormats) {
    if (isPalindrome(i)) {
      result = true;
    }
  }
  return result;
}

function isLeapYear(year) {
  // leap year if perfectly divisible by 400
  if (year % 400 === 0) {
    return true;
  }
  // not a leap year if divisible by 100 but not divisible by 400
  else if (year % 100 === 0) {
    return false;
  }
  // leap year if not divisible by 100 but divisible by 4
  else if (year % 4 === 0) {
    return true;
  }
  // all other years are not leap years
  else {
    return false;
  }
}

function getPreviousDate(date) {
  let month = date.month;
  let year = date.year;
  let day = date.day - 1;
  let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (day === 0) {
    month -= 1;
    if (month === 0) {
      month = 12;
      day = 31;
      year -= 1;
    } else if (month === 2) {
      if (isLeapYear(year)) {
        day = 29;
      } else {
        day = 28;
      }
    } else {
      day = daysInMonth[month - 1];
    }
  }

  let previousDate = { day: day, month: month, year: year };

  return previousDate;
}

function getPreviousPalindromeDate(date) {
  let previousDate = getPreviousDate(date);
  let dateInStr = dateToString(previousDate);
  let missedBy = 0;
  let result = false;

  while (1) {
    missedBy++;
    if (checkPalindromeForVariations(dateInStr)) {
      return [missedBy, previousDate];
    } else {
      previousDate = getPreviousDate(previousDate);
      dateInStr = dateToString(previousDate);
    }
  }
}

function getNextDate(date) {
  let month = date.month;
  let year = date.year;
  let day = date.day + 1;
  let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (month === 2) {
    if (isLeapYear(year)) {
      if (day > 29) {
        day = 1;
        month = 3;
      }
    } else if (day === 29) {
      day = 1;
      month = 3;
    }
  } else {
    if (day > daysInMonth[month - 1]) {
      day = 1;
      month++;
    }
  }
  if (month > 12) {
    month = 1;
    year++;
  }

  let NextDate = { day: day, month: month, year: year };

  return NextDate;
}

function getNextPalindromeDate(date) {
  let NextDate = getNextDate(date);
  let dateInStr = dateToString(NextDate);
  let missedBy = 0;
  let result = false;

  while (1) {
    missedBy++;
    if (checkPalindromeForVariations(dateInStr)) {
      return [missedBy, NextDate];
    } else {
      NextDate = getNextDate(NextDate);
      dateInStr = dateToString(NextDate);
    }
  }
}

function getResult() {
  let datePicked = datePicker.value;

  if (datePicked !== "") {
    let splitDate = datePicked.split("-");
    let yyyy = splitDate[0];
    let mm = splitDate[1];
    let dd = splitDate[2];

    var date = {
      day: Number(dd),
      month: Number(mm),
      year: Number(yyyy),
    };

    let dateInStr = dateToString(date);
    let result = checkPalindromeForVariations(dateInStr);

    if (result) {
      resultDiv.innerText = "Yoohooo! your birthday is a palindrome :)";
    } else {
      let [lastMissedBy, previousPal] = getPreviousPalindromeDate(date);
      let [nextMissedBy, nextPal] = getNextPalindromeDate(date);
      if (nextMissedBy < lastMissedBy) {
        let nearestDate = nextPal;
        let missedBy = nextMissedBy;
        resultDiv.innerText = `Your birthday is not a palindrome. Next palindrome date 
        was ${nearestDate.day}-${nearestDate.month}-${nearestDate.year}.
        You missed it by ${missedBy} ${missedBy > 1 ? "days" : "day"}`;
      } else {
        let nearestDate = previousPal;
        let missedBy = lastMissedBy;
        resultDiv.innerText = `Your birthday is not a palindrome. Last palindrome date 
        was ${nearestDate.day}-${nearestDate.month}-${nearestDate.year}.
        You missed it by ${missedBy} ${missedBy > 1 ? "days" : "day"}`;
      }
    }
  }
}

function clickHandler() {
  resultDiv.innerText = "";
  if (datePicker.value != "") {
    let loadingImage = document.createElement("IMG");
    loadingImage.setAttribute(
      "src",
      "./images/icons8-hourglass-transparent.gif"
    );
    loadingImage.setAttribute("alt", "Processing...");
    resultDiv.appendChild(loadingImage);
    setTimeout(function () {
      getResult();
    }, 3000);
  } else {
    resultDiv.innerText = `Input can't be empty. Please fill it and try again.`;
  }
}

submitBtn.addEventListener("click", clickHandler);

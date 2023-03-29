export const calculateDate = (
  eventStartDate: string,
  eventEndDate: string,
  year: string,
  month: string,
  date: string
) => {
  const today = year + month + date;
  let count = 0;
  let result = "";
  if (today < eventStartDate) {
    const eventMonth = eventStartDate.slice(4, 6);
    const eventDate = eventStartDate.slice(6, 8);

    for (let m = +month; m <= +eventMonth; m++) {
      if (m === +eventMonth) {
        count += +eventDate - +date;
        break;
      }
      const lastDate = new Date(+year, m, 0).getDate();
      count += lastDate;
    }

    result = `${count}일후 개최`;
  } else {
    if (today <= eventEndDate) {
      result = "진행중";
    }

    if (today > eventEndDate) {
      result = "행사종료";
    }
  }

  return result;
};

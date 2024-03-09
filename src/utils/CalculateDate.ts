export const calculateDate = (
  eventStartDate: string,
  eventEndDate: string,
  year: string,
  month: string,
  date: string
) => {
  const today = year + month + date;

  if (today < eventStartDate) {
    let count = 0;
    const eventYear = eventStartDate.slice(0, 4);
    const eventMonth = eventStartDate.slice(4, 6);
    const eventDate = eventStartDate.slice(6, 8);

    for (let y = +year; y <= +eventYear; y++) {
      for (let m = +month; m <= +eventMonth; m++) {
        if (m === +eventMonth) {
          count += +eventDate - +date;
          break;
        }
        const lastDate = new Date(+year, m, 0).getDate();
        count += lastDate;
      }
    }

    return `${count}일 후 개최`;
  } else {
    if (today <= eventEndDate) return "진행중";
    else return "행사종료";
  }
};

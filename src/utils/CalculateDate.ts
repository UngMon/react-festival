export const calculateDate = (
  eventStartDate: string,
  eventEndDate: string,
  year: string,
  month: string,
  date: string
) => {
  const today = year + month + date;

  if (today < eventStartDate) {
    const startYear = +eventStartDate.substring(0, 4),
      startMonth = +eventStartDate.substring(4, 6),
      startDay = +eventStartDate.substring(6, 8),
      endYear = +eventEndDate.substring(0, 4),
      endMonth = +eventEndDate.substring(4, 6),
      endDay = +eventEndDate.substring(6, 8);

    const d1 = new Date(startYear, startMonth, startDay);
    const d2 = new Date(endYear, endMonth, endDay);

    return `${Math.abs((d2.getTime() - d1.getTime()) / 86400000)}일 후 개최`; // 밀리초 → 일 변환
  } else {
    if (today <= eventEndDate) return "진행중";
    else return "행사종료";
  }
};

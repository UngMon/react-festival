export const CurrentSeason = () => {
  let info = new Date().getMonth() + 1;
  let thisMonth: string = String(info);
  let 계절 = "";

  if (info < 10) {
    thisMonth = "0" + thisMonth;
  }

  if (thisMonth < "03" || thisMonth === "12") {
    계절 = "winter";
  }

  if (thisMonth > "02" && thisMonth < "06") {
    계절 = "spring";
  }

  if (thisMonth > "05" && thisMonth < "09") {
    계절 = "summer";
  }

  if (thisMonth > "08" && thisMonth < "12") {
    계절 = "autumn";
  }

  return 계절;
};

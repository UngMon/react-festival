import { nowDate } from "utils/nowDate";

const { month } = nowDate();

export const MENU_ITEMS = [
  {
    to: "/tour?contentTypeId=12&areaCode=1&cat1=all&cat2=all&cat3=all&page=1",
    icon: "map",
    text: "관광지",
  },
  {
    to: "/culture?contentTypeId=14&areaCode=1&cat1=A02&cat2=all&cat3=all&page=1",
    icon: "museum",
    text: "문화시설",
  },
  {
    to: `/festival?contentTypeId=15&month=${month}&areaCode=0&cat1=A02&cat2=all&cat3=all`,
    icon: "festival",
    text: "축제/공연/행사",
  },
  {
    to: "/travel?contentTypeId=25&areaCode=0&cat1=C01&cat2=all&cat3=all&page=1",
    icon: "route",
    text: "여행코스",
  },
  {
    to: "/leports?contentTypeId=28&areaCode=0&cat1=A03&cat2=all&cat3=all&page=1",
    icon: "directions_bike",
    text: "레포츠",
  },
  {
    to: "/lodging?contentTypeId=32&areaCode=0&cat1=B02&cat2=B0201&cat3=all&page=1",
    icon: "hotel",
    text: "숙박",
  },
  {
    to: "/shopping?contentTypeId=38&areaCode=0&cat1=A04&cat2=A0401&cat3=all&page=1",
    icon: "shopping_bag",
    text: "쇼핑",
  },
  {
    to: "/restaurant?contentTypeId=39&areaCode=0&cat1=A05&cat2=A0502&cat3=all&page=1",
    icon: "restaurant",
    text: "음식점",
  },
];
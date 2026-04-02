import { nowDate } from "utils/nowDate";

const { month } = nowDate();

export const MENU_ITEMS = [
  {
    to: "/tourdata/experience?areaCode=0&cat1=EX&cat2=all&cat3=all&page=1",
    icon: "map",
    text: "체험관광",
  },
  {
    to: "/tourdata/history?areaCode=0&cat1=HS&cat2=all&cat3=all&page=1",
    icon: "museum",
    text: "역사관광",
  },
  {
    to: "/tourdata/nature?areaCode=0&cat1=NA&cat2=all&cat3=all&page=1",
    icon: "route",
    text: "자연관광",
  },
  {
    to: "/tourdata/culture?areaCode=0&cat1=VE&cat2=all&cat3=all&page=1",
    icon: "route",
    text: "문화관광",
  },
  {
    to: `/tourdata/festival?month=${month}&areaCode=0&cat1=EV&cat2=all&cat3=all`,
    icon: "festival",
    text: "축제/공연/행사",
  },
  {
    to: "/tourdata/sports?areaCode=0&cat1=LS&cat2=all&cat3=all&page=1",
    icon: "directions_bike",
    text: "레저스포츠",
  },
  {
    to: "/tourdata/lodging?areaCode=0&cat1=AC&cat2=all&cat3=all&page=1",
    icon: "hotel",
    text: "숙박",
  },
  {
    to: "/tourdata/shopping?areaCode=0&cat1=SH&cat2=all&cat3=all&page=1",
    icon: "shopping_bag",
    text: "쇼핑",
  },
  {
    to: "/tourdata/restaurant?areaCode=0&cat1=FD&cat2=all&cat3=all&page=1",
    icon: "restaurant",
    text: "음식",
  },
];

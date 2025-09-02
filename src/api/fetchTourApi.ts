import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchParams, FetchTourData, TourResponse } from "type/FetchType";

const serviceKey = encodeURIComponent(process.env.REACT_APP_DATA_SERVICE_KEY!);

const createUrl = (
  title: string,
  params: FetchParams["params"],
  numOfRows: number,
  page: number | undefined
) => {
  let url = "https://apis.data.go.kr/B551011/KorService2/";
  const baseParameterOne = `&numOfRows=${numOfRows}&pageNo=${page}`;
  const baseParameterTwo = "&MobileOS=ETC&MobileApp=igotjeogot&_type=json&arrange=Q";

  if (title === "festival") {
    const startDate = `${new Date().getFullYear() - 1}0101`;
    return `${url}searchFestival2?serviceKey=${serviceKey}&numOfRows=2000&pageNo=1${baseParameterTwo}&eventStartDate=${startDate}`;
  }

  if (title === "search") {
    const keyword = encodeURIComponent(params.keyword!);
    url += `searchKeyword2?serviceKey=${serviceKey}${baseParameterOne}${baseParameterTwo}&keyword=${keyword}`;
    if (params.contentTypeId && params.contentTypeId !== "0")
      url += `&contentTypeId=${params.contentTypeId}`;
    return url;
  }

  url += `areaBasedList2?serviceKey=${serviceKey}&contentTypeId=${params.contentTypeId}${baseParameterOne}${baseParameterTwo}`;
  if (params.areaCode !== "0") url += `&areaCode=${params.areaCode}`;
  if (params.cat1 !== "all") url += `&cat1=${params.cat1}`;
  if (params.cat2 !== "all") url += `&cat2=${params.cat2}`;
  if (params.cat3 !== "all") url += `&cat3=${params.cat3}`;
  return url;
};

export const fetchTourApi = createAsyncThunk(
  "tour/fetchFromData",
  async (parameter: FetchParams) => {
    const { numOfRows, page, title, params } = parameter;
    console.log('fetch Tour Api', parameter)
    const url: string = createUrl(title, params, numOfRows, page);

    try {
      // let requestArray: Promise<Response>[] = [];

      // if (title === "festival" || existPageInfo) {
      //   requestArray = [fetch(url)];
      // } else {
      //   // const pageUrl = url.replace('listYN=Y', 'listYN=N');
      //   requestArray = [fetch(pageUrl), fetch(url)];
      // }
      // const responses = await Promise.all(requestArray);
      // const jsonResponses = await Promise.all(responses.map((res) => res.json()));
      // totalCount: PageCountRespon;

      const response= await fetch(url);
      const responseData = await response.json() as TourResponse;

      return {
        numOfRows,
        // totalCount: jsonResponses.length > 1 ? jsonResponses[0] : undefined,
        // data: jsonResponses.length > 1 ? jsonResponses[1] : jsonResponses[0],
        responseData,
        page,
        ...params,
        title,
      } as FetchTourData;
    } catch (error: any) {
      return Promise.reject(error.message);
    }
  }
);

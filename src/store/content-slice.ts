import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContentType } from "../type/DataType";
import {
  ResponseCommon,
  ResponseInfo,
  ResponseIntro,
} from "../type/ContentType";

const initialState: ContentType = {
  detailInfo: undefined,
  detailIntro: undefined,
  detailCommon: undefined,
};

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setContentData(
      state,
      action: PayloadAction<{
        contentInfo: ResponseInfo;
        contentIntro: ResponseIntro;
        contentCommon: ResponseCommon;
      }>
    ) {
      const { contentCommon, contentInfo, contentIntro } = action.payload;

      state.detailCommon = contentCommon.response.body.items?.item;
      state.detailInfo = contentInfo.response.body.items?.item;
      state.detailIntro = contentIntro.response.body.items?.item;
    },
  },
});

export const contentActions = contentSlice.actions;
export const contentReducer = contentSlice.reducer;

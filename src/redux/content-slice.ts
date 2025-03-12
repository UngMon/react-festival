import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContentType } from "../type/DataType";
import { ResponCommon, ResponInfo, ResponIntro } from "../type/ContentType";

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
        contentInfo: ResponInfo;
        contentIntro: ResponIntro;
        contentCommon: ResponCommon;
      }>
    ) {
      const { contentCommon, contentInfo, contentIntro } = action.payload;
      
      state.detailCommon = contentCommon.response.body.items?.item || undefined;
      state.detailInfo = contentInfo.response.body.items?.item || undefined;
      state.detailIntro = contentIntro.response.body.items?.item || undefined;
    },
  },
});

export const contentActions = contentSlice.actions;
export const contentReducer = contentSlice.reducer;

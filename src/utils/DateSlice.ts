export const dateSlice = (startDate: string, endDate: string): string => {
  const result =
    startDate.slice(0, 4) +
    "." +
    startDate.slice(4, 6) +
    "." +
    startDate.slice(6, 8) +
    " ~ " +
    endDate.slice(0, 4) +
    "." +
    endDate.slice(4, 6) +
    "." +
    endDate.slice(6, 8);

  return result;
};


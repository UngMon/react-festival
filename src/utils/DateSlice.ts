export const dateSlice = (startDate: string, endDate: string): string => {
  if (!startDate || !endDate) return "";

  // (\d{4}): 연도 4자리, (\d{2}): 월 2자리, (\d{2}): 일 2자리 캡처
  const format = (date: string) => date.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');
  
  // 20250101, 20251230 => 2025.01.01 ~ 2025.12.30
  return `${format(startDate)} ~ ${format(endDate)}`;
};
export const nowDate = () => {
  const today = new Date();
  const year = String(today.getFullYear());
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");
  const time = today.toTimeString().slice(0, 8);

  return { year, month, date, time };
};

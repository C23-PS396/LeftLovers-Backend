export const calculateEndDate = (
  startDate: Date,
  durationInSecond: number
): Date => {
  const milliseconds = durationInSecond * 1000;
  const endDate = new Date(startDate.getTime() + milliseconds);
  return endDate;
};

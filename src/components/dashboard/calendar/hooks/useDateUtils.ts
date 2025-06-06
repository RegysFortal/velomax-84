
export const useDateUtils = () => {
  // Create a normalized date at noon local time to avoid timezone issues
  const createNormalizedDate = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  };

  return {
    createNormalizedDate
  };
};

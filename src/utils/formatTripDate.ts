export const formatTripDate = (dateStart: string, dateEnd?: string): string => {
    if (!dateEnd) {
      return "Active";
    }
  
    const start = new Date(dateStart);
    const end = new Date(dateEnd);
  
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "Invalid date";
    }
  
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  };
  
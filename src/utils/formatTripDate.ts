export const formatTripDate = (dateStart: string, dateEnd?: string): string => {
  const start = new Date(dateStart);

  if (Number.isNaN(start.getTime())) {
    return "Invalid date";
  }

  const startLabel = start.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  if (!dateEnd) {
    return `${startLabel} – Active`;
  }

  const end = new Date(dateEnd);

  if (Number.isNaN(end.getTime())) {
    return "Invalid date";
  }

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return `${startLabel} – ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
};

export const formatDate = (date: Date): string => {
  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }
  const locale = navigator.language || "en-US";
  return date.toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

export const countWords = (text) => (text.trim() ? text.trim().split(/\s+/).length : 0);

export const readingTime = (text) => Math.max(1, Math.round(countWords(text) / 200));

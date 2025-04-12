export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((v) => v.replace(/\W/g, ""))
    .filter((v) => v)
    .slice(0, 3)
    .map((word) => word.substring(0, 1));

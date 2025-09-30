import { parse } from "date-fns";

export function getDateFromDB(date: string): Date {
  const _date: Date = parse(date, "yyyy-MM-dd", new Date());

  return _date;
}

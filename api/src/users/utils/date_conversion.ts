// Convert a date to ISO String

export function dateConversionUnixToIso(unixDate: number): string {
  const date = new Date(unixDate * 1000);
  return date.toISOString();
}

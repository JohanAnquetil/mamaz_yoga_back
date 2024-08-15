export function dateConversionUnixToIso(unixDate: number): string {
  const date = new Date(unixDate * 1000);
  return date.toISOString();
}

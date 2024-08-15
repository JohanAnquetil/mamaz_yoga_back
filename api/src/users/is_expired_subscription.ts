export function isExpiredSubscription(endSub: any) {
  const today = new Date().toISOString();
  return endSub > today;
}

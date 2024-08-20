// Check if the subscription is expired
export function isExpiredSubscription(endSub: any) {
  const today = new Date().toISOString();
  return endSub > today;
}

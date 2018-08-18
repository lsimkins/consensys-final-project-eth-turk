export function addressIsSet(address) {
  return parseInt(address, 16) !== 0;
}

export function isExpired(endTime) {
  return parseInt(endTime - (Date.now()/1000), 10) <= 0;
}
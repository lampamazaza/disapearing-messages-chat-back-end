export default function isAnyOfTheseKeysUndefined(
  keysToCheck: string[],
  obj: Record<string, any>
) {
  for (let i = 0; i < keysToCheck.length; i++) {
    if (obj[keysToCheck[i]] === undefined) return true;
  }
  return false;
}

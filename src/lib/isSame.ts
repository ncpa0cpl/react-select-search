export function isSame(
  v1: string | number | undefined,
  v2: string | number | undefined,
): boolean {
  return String(v1) === String(v2);
}

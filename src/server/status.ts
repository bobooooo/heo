export function applySelection(input: { offers: string[]; selectedId: string }) {
  const rejected = input.offers.filter((id) => id !== input.selectedId);
  return { selected: input.selectedId, rejected };
}

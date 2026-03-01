export type CookiesLike = {
  get: (name: string) => { value?: string } | undefined;
};

export async function readSessionToken(
  cookiesLike: CookiesLike | Promise<CookiesLike>
) {
  const store = await cookiesLike;
  return store.get("session")?.value ?? null;
}

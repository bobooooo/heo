export async function unwrapParams<T>(params: T | Promise<T>) {
  return await params;
}

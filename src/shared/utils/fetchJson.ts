export const fetchJson = async <T>(
  url: string,
  guard: (value: unknown) => value is T,
  init?: RequestInit,
): Promise<T> => {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`Request failed (${response.status}): ${url}`);

  const data: unknown = await response.json();
  if (!guard(data)) throw new Error(`Unexpected response shape: ${url}`);

  return data;
};
export type FakeResult = {
  id: string;
  label: string;
};

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy;
}

const corpus = [
  "apple",
  "application",
  "apply",
  "apex",
  "apricot",
  "admonish",
  "admin",
  "administer",
  "abdicate",
  "abdomen",
  "banana",
  "band",
  "bandana",
  "bandwidth",
  "cat",
  "catalog",
  "cater",
  "dog",
  "delta",
  "design",
  "echo",
  "elephant",
].map((word, index) => ({ id: index, word }));

export function generateFakeSearchResults(
  query: string,
  {
    count = 10,
    seed = query.length,
  }: {
    count?: number;
    seed?: number;
  } = {},
): FakeResult[] {
  const rand = mulberry32(seed);

  // 🔥 strict prefix match
  const matches = corpus.filter(({ word }) =>
    word.startsWith(query.toLowerCase()),
  );

  // fallback if no matches
  const pool = matches.length > 0 ? matches : corpus;

  // 🔥 shuffle once, then slice → NO duplicates
  const unique = shuffle(pool, rand).slice(0, count);

  return unique.map(({ word, id }) => ({
    id: `${id}`,
    label: word,
  }));
}

import { useSyncExternalStore, useEffect, useState } from "react";
import { Cache } from "./Cache";
import { FakeResult, generateFakeSearchResults } from "./fakeData";

const getKey = (value: FakeResult) => {
  return value.label;
};

export const useCache = (query: string) => {
  const [{ getSnapshot, insert, subscribe }] = useState(
    () => new Cache<FakeResult>(100, getKey),
  );

  useEffect(() => {
    if (query.length >= 2) {
      const results = generateFakeSearchResults(query);
      insert(...results);
    }
  }, [insert, query]);

  const results = useSyncExternalStore(
    (onStoreChange) => subscribe(query, onStoreChange),
    () => getSnapshot(query),
  );

  return results;
};

import { LruMap } from "./LRUMap";
import { LruTrie } from "./LRUTrie";

export class Cache<V extends { id: string }> {
  private LRUTrie: LruTrie<V>;

  private listeners = new Map<string, Set<() => void>>();
  private snapshotCache: LruMap<string, V[]>;

  constructor(
    capacity: number,
    protected getKey: (value: V) => string,
  ) {
    this.LRUTrie = new LruTrie(capacity);
    this.snapshotCache = new LruMap(capacity, (key) =>
      this.LRUTrie.delete(key),
    );
  }

  subscribe = (query: string, listener: () => void) => {
    let listenersSet = this.listeners.get(query);
    if (!listenersSet) {
      this.listeners.set(query, (listenersSet = new Set<() => void>()));
    }
    listenersSet.add(listener);

    return () => {
      listenersSet.delete(listener);
      if (listenersSet.size === 0) {
        this.listeners.delete(query);
      }
    };
  };

  insert = (...values: V[]) => {
    const updatedKeys = new Set<string>();
    for (const v of values) {
      const key = this.getKey(v);
      this.LRUTrie.insert(this.getKey(v), v);
      updatedKeys.add(key);
    }
    const prefixes = new Set<string>();
    updatedKeys.forEach((updatedKey) => {
      for (let i = 1; i <= updatedKey.length; i++) {
        prefixes.add(updatedKey.slice(0, i));
      }
    });
    prefixes.forEach((prefix) => this.notify(prefix));
  };

  private notify = (query: string) => {
    if (this.snapshotCache.has(query)) {
      this.snapshotCache.delete(query);
    }
    this.listeners.get(query)?.forEach((l) => l());
  };

  getSnapshot = (query: string) => {
    let snapshot = this.snapshotCache.get(query);

    if (!snapshot) {
      this.snapshotCache.set(
        query,
        (snapshot = this.LRUTrie.valuesWithPrefix(query)),
      );
    }

    return snapshot;
  };

  withPersist = () => {
    return this;
  };
}

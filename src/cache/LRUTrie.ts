import { LruMap } from "./LRUMap";
import { AbstractTrie } from "./Trie";

export class LruTrie<V extends { id: string }> extends AbstractTrie<V> {
  private readonly registry: LruMap<string, typeof this.root>;
  // Track whether we are inside an eviction to prevent re-entry.
  private _evicting = false;

  constructor(capacity: number) {
    super();
    if (capacity < 1) throw new RangeError("LruTrie capacity must be ≥ 1");

    this.registry = new LruMap<string, typeof this.root>(capacity, (key) => {
      this._evicting = true;
      try {
        this.delete(key);
      } finally {
        this._evicting = false;
      }
    });
  }

  protected onInsert(key: string, node: typeof this.root): void {
    this.registry.set(key, node);
  }

  protected onAccess(key: string, node: typeof this.root): void {
    this.registry.set(key, node);
  }

  protected onEvict(key: string): void {
    if (!this._evicting) {
      this.registry.delete(key);
    }
  }
}

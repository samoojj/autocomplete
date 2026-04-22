export class LruMap<K, V> extends Map<K, V> {
  private map = new Map<K, V>();

  constructor(
    private capacity: number,
    protected onEvict: (key: K) => void,
  ) {
    super();
    if (capacity < 1) throw new RangeError("capacity must be ≥ 1");
  }

  get(key: K): V | undefined {
    const value = this.map.get(key);
    if (value === undefined) return undefined;

    this.map.delete(key);
    this.map.set(key, value);

    return value;
  }

  set(key: K, value: V) {
    if (this.map.size === this.capacity) {
      this.evictLru();
    }

    if (this.map.has(key)) {
      this.map.delete(key);
    }

    this.map.set(key, value);

    return this;
  }

  has(key: K): boolean {
    return this.map.has(key);
  }

  delete(key: K): boolean {
    return this.map.delete(key);
  }

  private lruKey(): K | undefined {
    return this.map.keys().next().value;
  }

  private evictLru(): void {
    const lru = this.lruKey();
    if (lru !== undefined) {
      if (this.map.delete(lru)) {
        this.onEvict(lru);
      }
    }
  }

  get size(): number {
    return this.map.size;
  }
}

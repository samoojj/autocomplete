import { Heap } from "./Heap";

export class Mfu<K extends string, V> {
  private counter = new Map<K, number>();
  private heap: Heap<V>;

  constructor(getKey: (value: V) => K) {
    this.heap = new Heap((a: V, b: V) => {
      return getKey(a).localeCompare(getKey(b)) * -1;
    });
  }
}

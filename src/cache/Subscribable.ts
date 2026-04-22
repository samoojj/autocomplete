export abstract class Subscribable<
  S,
  GetSnapshotParams extends Array<unknown> = [],
> {
  private listeners = new Set<() => void>();

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  protected emit = () => {
    for (const l of this.listeners) {
      l();
    }
  };

  abstract getSnapshot: (...params: GetSnapshotParams) => S;
}

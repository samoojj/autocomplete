export class Heap<T> {
  private array: T[] = [];

  constructor(protected compareTo: (a: T, b: T) => number) {}

  /**
   * i and j are indices, i < j
   */
  private shouldSwap = (i: number, j: number) => {
    const iElement = this.array[i]!;
    const jElement = this.array[j]!;

    const diff = this.compareTo(iElement, jElement);

    if (diff <= 0) {
      return false;
    } else {
      return true;
    }
  };

  private swap = (i: number, j: number) => {
    [this.array[i], this.array[j]] = [this.array[j]!, this.array[i]!];
  };

  private static getParentIndex = (index: number) =>
    Math.floor((index - 1) / 2);
  private static getLeftChildIndex = (index: number) => index * 2 + 1;
  private static getRightChildIndex = (index: number) => index * 2 + 2;

  private heapifyUp = (index = this.array.length - 1) => {
    while (index) {
      const parentIndex = Heap.getParentIndex(index);
      if (this.shouldSwap(parentIndex, index)) {
        this.swap(parentIndex, index);
        index = parentIndex;
      } else {
        break;
      }
    }
  };

  private hasLeftChild = (index: number) => {
    return this.array[Heap.getLeftChildIndex(index)] !== undefined;
  };

  private hasRightChild = (index: number) => {
    return this.array[Heap.getRightChildIndex(index)] !== undefined;
  };

  private heapifyDown = (index = 0) => {
    while (this.hasLeftChild(index)) {
      let childIndex = Heap.getLeftChildIndex(index);

      if (this.hasRightChild(index)) {
        if (this.shouldSwap(childIndex, Heap.getRightChildIndex(index))) {
          childIndex = Heap.getRightChildIndex(index);
        }
      }

      if (this.shouldSwap(index, childIndex)) {
        this.swap(index, childIndex);
        index = childIndex;
      } else {
        break;
      }
    }
  };

  insert(value: T) {
    this.array.push(value);
    this.heapifyUp(this.array.length - 1);
  }

  extract = (index = 0) => {
    this.swap(index, this.array.length - 1);
    const head = this.array.pop();
    this.heapifyDown(index);
    return head;
  };

  get size() {
    return this.array.length;
  }

  peek = () => {
    return this.array[0];
  };

  toString = () => {
    return this.array.toString();
  };
}

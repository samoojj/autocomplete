class TrieNode<V = undefined> {
  readonly children: Map<string, TrieNode<V>> = new Map();
  values: Map<string, V> = new Map();
  isTerminal = false;

  hasChild(char: string): boolean {
    return this.children.has(char);
  }

  getChild(char: string): TrieNode<V> | undefined {
    return this.children.get(char);
  }

  setChild(char: string, node: TrieNode<V>): void {
    this.children.set(char, node);
  }

  removeChild(char: string): boolean {
    return this.children.delete(char);
  }
}

export abstract class AbstractTrie<V extends { id: string }> {
  protected root: TrieNode<V> = this.createNode();
  private _size = 0;

  protected createNode(): TrieNode<V> {
    return new TrieNode<V>();
  }

  protected abstract onAccess(key: string, node: TrieNode<V>): void;
  protected abstract onInsert(key: string, node: TrieNode<V>): void;
  protected abstract onEvict(key: string, node: TrieNode<V>): void;

  insert(key: string, value: V): void {
    let node = this.root;

    for (const char of key) {
      if (!node.hasChild(char)) {
        node.setChild(char, this.createNode());
      }
      node = node.getChild(char)!;
    }

    const isNew = !node.isTerminal;
    node.isTerminal = true;
    node.values.set(value.id, value);

    if (isNew) {
      this._size++;
    }
  }

  search(key: string): V[] | undefined {
    const node = this.traverse(key);
    if (!node?.isTerminal) return undefined;

    this.onAccess(key, node);
    return Array.from(node.values.values());
  }

  has(key: string): boolean {
    const node = this.traverse(key);
    return node?.isTerminal === true;
  }

  delete(key: string): boolean {
    return this._delete(this.root, key, 0);
  }

  deleteValue(key: string, value: V): boolean {
    const node = this.traverse(key);

    if (!node?.isTerminal) {
      return false;
    }

    this.onEvict(key, node);

    const existed = node.values.delete(value.id);

    if (node.values.size === 0) {
      this.delete(key);
    }

    return existed;
  }

  keysWithPrefix(prefix: string): string[] {
    const node = this.traverse(prefix);
    if (!node) return [];

    const results: string[] = [];
    this._collectKeys(node, prefix, results);
    return results;
  }

  valuesWithPrefix(prefix: string): V[] {
    const node = this.traverse(prefix);
    if (!node) {
      return [];
    }

    const results: V[] = [];
    this._collectValues(node, results);
    return results;
  }

  longestPrefixOf(query: string): string | undefined {
    let node = this.root;
    let longestMatch: string | undefined;

    for (let i = 0; i < query.length; i++) {
      const char = query[i]!;
      if (!node.hasChild(char)) break;

      node = node.getChild(char)!;
      if (node.isTerminal) longestMatch = query.slice(0, i + 1);
    }

    return longestMatch;
  }

  get size(): number {
    return this._size;
  }

  protected traverse(key: string): TrieNode<V> | undefined {
    let node = this.root;

    for (const char of key) {
      const next = node.getChild(char);
      if (!next) return undefined;
      node = next;
    }

    return node;
  }

  private _delete(node: TrieNode<V>, key: string, depth: number): boolean {
    if (depth === key.length) {
      if (!node.isTerminal) return false;

      node.isTerminal = false;
      node.values.clear();
      this._size--;
      return true;
    }

    const char = key[depth]!;
    const child = node.getChild(char);
    if (!child) return false;

    const deleted = this._delete(child, key, depth + 1);

    // Prune childless, non-terminal nodes to avoid memory leaks.
    if (deleted && !child.isTerminal && child.children.size === 0) {
      node.removeChild(char);
    }

    return deleted;
  }

  private _collectKeys(node: TrieNode<V>, prefix: string, out: string[]): void {
    if (node.isTerminal) out.push(prefix);

    for (const [char, child] of node.children) {
      this._collectKeys(child, prefix + char, out);
    }
  }

  private _collectValues(node: TrieNode<V>, out: V[]) {
    if (node.isTerminal) {
      out.push(...node.values.values());
    }

    for (const child of node.children.values()) {
      this._collectValues(child, out);
    }
  }
}

export class Trie<V extends { id: string }> extends AbstractTrie<V> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onAccess(_key: string, _node: TrieNode<V>): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onInsert(_key: string, _node: TrieNode<V>): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onEvict(_key: string, _node: TrieNode<V>): void {}
}

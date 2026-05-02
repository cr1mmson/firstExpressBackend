class PriorityQueue {
  constructor(comparator) {
    this.heap = [];
    // comparator(a, b) => true si "a" tiene mayor prioridad que "b"
    this.comparator = comparator;
  }

  enqueue(item) {
    this.heap.push(item);
    this._bubbleUp(this.heap.length - 1);
  }

  dequeue() {
    if (this.isEmpty()) return null;
    this._swap(0, this.heap.length - 1);
    const top = this.heap.pop();
    this._sinkDown(0);
    return top;
  }

  peek() {
    return this.heap[0] ?? null;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  size() {
    return this.heap.length;
  }

  toSortedArray() {
    // Devuelve copia ordenada sin destruir la cola
    return [...this.heap].sort((a, b) =>
      this.comparator(a, b) ? -1 : 1
    );
  }

  _bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.comparator(this.heap[i], this.heap[parent])) {
        this._swap(i, parent);
        i = parent;
      } else break;
    }
  }

  _sinkDown(i) {
    const n = this.heap.length;
    while (true) {
      let top = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.comparator(this.heap[l], this.heap[top])) top = l;
      if (r < n && this.comparator(this.heap[r], this.heap[top])) top = r;
      if (top === i) break;
      this._swap(i, top);
      i = top;
    }
  }

  _swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}

module.exports = PriorityQueue;
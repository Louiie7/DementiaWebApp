class MatrixIndex {
    constructor(num, pos) {
        this.num = num
        this.pos = pos
    }
}
class MaxHeap {
    constructor(array) {
    this.array = [null, ...array];
    this.size = array.length
    }

    arrange(idx) {
      while (idx > 1 && this.compare(Math.floor(idx / 2), idx)) {
        this.swap(idx, Math.floor(idx / 2));
        idx = Math.floor(idx / 2);
      }
    }

    heaper(idx1) {
      while (2 * idx1 <= this.size) {
        let idx2 = 2 * idx1;
        if (idx2 < this.size && this.compare(idx2, idx2 + 1)) idx2++;
        if (!this.compare(idx1, idx2)) break;
        this.swap(idx1, idx2);
        idx1 = idx2;
      }
    }

    rootdelete() {
      let max = this.array[1]
      this.swap(1, this.size--);
      this.heaper(1);
      this.array[this.size + 1] = null;
      return max;
    }

    insert(element) {
      this.array[++this.size] = element;
      this.arrange(this.size);
    }

    compare(idx1, idx2) {
      return this.array[idx1].num < this.array[idx2].num;
    }

    swap(idx1, idx2) {
      const temp = this.array[idx1];
      this.array[idx1] = this.array[idx2];
      this.array[idx2] = temp;
    }
}
module.exports.MaxHeap = MaxHeap;
module.exports.MatrixIndex = MatrixIndex;

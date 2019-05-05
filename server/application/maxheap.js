class MatrixIndex {
    constructor(num, pos) {
        this.num = num
        this.pos = pos
    }
}


class MaxHeap {
    constructor(elements) {
      this.elements = [null, ...elements];
      this.length = elements.length
    }

    rootdelete() {
      let max = this.elements[1]
      this.changePosition(1, this.length--);
      this.arrangeFromTop(1);
      this.elements[this.length + 1] = null;
      return max;
    }

    insert(element) {
      this.elements[++this.length] = element;
      this.arrangeFromBottom(this.length);
    }

    getelements(){
      return this.elements;
    }

    isEmpty(){
      if(this.length == 0){
        return true;
      }
      return false;
    }

    compareIndices(index1, index2) {
      if(this.elements[index1].num == this.elements[index2].num){
        if(this.elements[index1].pos[0] == this.elements[index2].pos[0]){
          return this.elements[index1].pos[1] < this.elements[index2].pos[1];
        }
        return this.elements[index1].pos[0] < this.elements[index2].pos[0];
      }
      return this.elements[index1].num < this.elements[index2].num;
    }

    changePosition(index1, index2) {
      const temp = this.elements[index1];
      this.elements[index1] = this.elements[index2];
      this.elements[index2] = temp;
    }

    arrangeFromBottom(index) {
      while (index > 1 && this.compareIndices(Math.floor(index / 2), index)) {
        this.changePosition(index, Math.floor(index / 2));
        index = Math.floor(index / 2);
      }
    }

    arrangeFromTop(index1) {
      while (2 * index1 <= this.length) {
        let index2 = 2 * index1;
        if (index2 < this.length && this.compareIndices(index2, index2 + 1)) index2++;
        if (!this.compareIndices(index1, index2)) break;
        this.changePosition(index1, index2);
        index1 = index2;
      }
    }
}

module.exports.MaxHeap = MaxHeap;
module.exports.MatrixIndex = MatrixIndex;

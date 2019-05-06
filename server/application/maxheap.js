//This file contains the MaxHeap class. For detailed documentation see the rapport for MRRAD af section 13.

// A custom class for elements in the MaxHeap
class MatrixIndex {
    constructor(num, pos) {
        this.num = num
        this.pos = pos
    }
}

//The MaxHeap class
class MaxHeap {
    constructor(elements) { // setup of the MaxHeap
      this.elements = [null, ...elements]; // the list of elements is 1-indexed.
      this.length = elements.length
    }

    //returns the maximum element in the maxheap
    rootdelete() {
      let max = this.elements[1]
      this.changePosition(1, this.length--);
      this.arrangeFromTop(1);
      this.elements[this.length + 1] = null;
      return max;
    }

    //return null: inserts a element in the maxheap
    insert(element) {
      this.elements[++this.length] = element;
      this.arrangeFromBottom(this.length);
    }

    //returns all elements in the maxheap
    getelements(){
      return this.elements;
    }

    // return boolean representing whether the maxheap is empty
    isEmpty(){
      if(this.length == 0){
        return true;
      }
      return false;
    }

    // returns a boolean representing whether the element at index1 or index2 should be above or below the other.
    compareIndices(index1, index2) {
      if(this.elements[index1].num == this.elements[index2].num){
        if(this.elements[index1].pos[0] == this.elements[index2].pos[0]){
          return this.elements[index1].pos[1] < this.elements[index2].pos[1];
        }
        return this.elements[index1].pos[0] < this.elements[index2].pos[0];
      }
      return this.elements[index1].num < this.elements[index2].num;
    }

    // returns null: swaps the elements at index1 and index2
    changePosition(index1, index2) {
      const temp = this.elements[index1];
      this.elements[index1] = this.elements[index2];
      this.elements[index2] = temp;
    }

    //returns null: balances the maxheap to make sure the maximum element is on top after an insertion
    arrangeFromBottom(index) {
      while (index > 1 && this.compareIndices(Math.floor(index / 2), index)) {
        this.changePosition(index, Math.floor(index / 2));
        index = Math.floor(index / 2);
      }
    }

    // returns null:balances the maxheap to make sure the maximum element is on top after a rootdeletion
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

//exports the classes as a module accesible by other files
module.exports.MaxHeap = MaxHeap;
module.exports.MatrixIndex = MatrixIndex;

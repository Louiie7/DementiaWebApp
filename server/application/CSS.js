//this file contains everything related to common substrings.

let PQ = require(__dirname +"/maxheap");

/*return a sum of common substring found between str1 and str2 based on the input of String str1 and String str2.
The sum is the length of longest substring elevated to the power of 2.
The solution is not perfect since some matrix positions exlude other matrix positions. Therefore another dynamic solution is needed to optimize the sum. Although the importance is just that the result is equevalent for all cases.*/
function CSS_optimized(str1, str2) {
  let DPmatrix = new Array(str1.length+1); // initializes the table to store the previously calculated values
  for(let i = 0; i <= str1.length; i++) { // all the characters in str1
    DPmatrix[i] = new Array(str2.length+1); //subarrays with length str2.length are initialized to make the table of size str1.length * str2.length;
  }
  for(let i = 0; i <= str2.length; i++) { //all base cases for str2.
    DPmatrix[0][i] = 0;
  }
  for(let i = 0; i <= str1.length; i++) { //all base cases for str1.
    DPmatrix[i][0] = 0;
  }
  // then the actual algorithm runs
  for(let i = 0; i < str1.length; i++) { // all positions/characters in str1.
    for(let j = 0; j < str2.length; j++) { // all positions/characters in str2.
      let newI = i+1; let newJ = j+1;// the table is not zero-indexed and therefore we add 1 because of the basecases
      if(str1.charAt(i) == str2.charAt(j)) { // if newJ'th character in str1 is equal to the newJ'th character in str2
        DPmatrix[newI][newJ] = DPmatrix[i][j] + 1; /* the table value at newJ, newI is set to be the longest common substring at the previous position (newI-1, newJ-1) plus 1.*/
      }
      else {
        DPmatrix[newI][newJ] = 0; //Otherwise the table value at newJ, newI is 0.
      }
    }
  }
  let visitedstr1 = new Array(str1.length+1); // Keeps track of which characters have been used from str1.
  for(let i = 0; i <= str1.length; i++) {
    visitedstr1[i] = false; //at first no characters has been used in str1.
  }
  let visitedstr2 = new Array(str2.length+1);
  for(let i = 0; i <= str2.length; i++) { // Keeps track of which characters have been used from str2.
    visitedstr2[i] = false; //at first no characters has been used in str2.
  }
  let pq = new PQ.MaxHeap([]); // initializes a new MaxHeap to keep track of the "current" longest common substring.
  for(let i = str1.length; i > -1; i--){
    for(let j = str2.length; j > -1; j--){
      if(DPmatrix[i][j] != 0){
        let element = new PQ.MatrixIndex(DPmatrix[i][j], [i,j]); // a MaxHeap compatible element is initialized with the substring in the table at position i,j
        pq.insert(element); // the element is inserted in the MaxHeap.
      }
    }
  }
  let sum = 0; // a variable that keeps track of the current sum of substrings lengths elevated to the power of 2
  while(!pq.isEmpty()){ // checks all the elements in the MaxHeap
    let curr = pq.rootdelete(); // the "next" greatest element is extracted from the MaxHeap
    if(isValid(curr, visitedstr1, visitedstr2)){ // if none of the characters has yet been visited
      for(let k = 0; k < curr.num; k++){ // mark all the characters in this substring as visited
        visitedstr1[curr.pos[0] - k] = true;
        visitedstr2[curr.pos[1] - k] = true;
      }
      sum += Math.pow(curr.num, 2); //append the length of the substring elevated to the power of 2 to the sum
    }
  }
  return sum; // return the result
}

function isValid(curr, visitedstr1, visitedstr2){
  for(let k = 0; k < curr.num; k++){
    if(visitedstr1[curr.pos[0] - k]) return false;
    if(visitedstr2[curr.pos[1] - k]) return false;
  }
  return true;
}

function LCS(str1, str2) {
  let pos = new Array(2);
  let maxLength = 0;
  let DP = new Array(str1.length+1);
  for(let i = 0; i <= str1.length; i++) {
    DP[i] = new Array(str2.length+1);
  }
  for(let i = 0; i <= str2.length; i++) {
    DP[0][i] = 0;
  }
  for(let i = 0; i <= str1.length; i++) {
    DP[i][0] = 0;
  }
  for(let i = 0; i < str1.length; i++) {
    //Maybe it should be i-1 and j-1
    for(let j = 0; j < str2.length; j++) {
      let newI = i+1;
      let newJ = j+1;
      if(str1.charAt(i) == str2.charAt(j)) {
        DP[newI][newJ] = DP[i][j] + 1;
        if(DP[newI][newJ] >= maxLength) {
          maxLength = DP[newI][newJ];
          pos[0] = i;
          pos[1] = j;
        }
      }
      else {
        DP[newI][newJ] = 0;
      }
    }
  }
  //console.log(DP);
  return{
    maxLength: maxLength,
    pos: pos
  }
}

function CSSvalue(str1, str2){
  let timestart = console.time("timer");
  let res = LCS(str1, str2)
  let sum = 0;
  while(res.maxLength != 0) {
    sum += Math.pow(res.maxLength, 2);
    console.log(res.maxLength, res.pos);
    str2 = str2.substring(0, res.pos[1]-res.maxLength+1) + buildStringOf("§", res.maxLength) +str2.substring(res.pos[1]+1, str2.length)
    str1 = str1.substring(0, res.pos[0]-res.maxLength+1) + buildStringOf("#", res.maxLength) + str1.substring(res.pos[0]+1, str1.length)
    //console.log(str1, str2);
    res = LCS(str1, str2);
  };
  return sum;
}

function buildStringOf(str, amount){
  let newS = ""
  for(let i = 0; i < amount+1; i++){
    newS += str;
  }
  return newS;
}

// return a normalized value based on the numerical value from css.CSS and the total length of either the note or the request.
function normalize(numericalValue, request){
  return numericalValue / (request.length * request.length)
}

module.exports.CSS = CSS_optimized;
module.exports.normalize = normalize;

/*
console.time("timer");
console.log(CSS_optimized("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more str1ently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."))
console.timeEnd("timer");

console.time("timer");
console.log(CSSvalue("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more str1ently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."))
console.timeEnd("timer");

console.time("timer");
console.log(CSS_optimized("Lorem Ipsumtext of the", "established  that a rea"))
console.timeEnd("timer");

console.time("timer");
console.log(CSSvalue("Lorem Ipsumtext of the", "established  that a rea"))
console.timeEnd("timer");
*/
/*
console.time("timer");
console.log(CSS_optimized("It is a long established", "It is a long established"))
console.timeEnd("timer");

console.time("timer");
console.log(CSSvalue("It is a long established", "It is a long established"))
console.timeEnd("timer");

console.time("timer");
console.log(CSS_optimized("abcdefg", "fbcdegh"))
console.timeEnd("timer");

console.time("timer");
console.log(CSSvalue("abcdefg", "fbcdegh"))
console.timeEnd("timer");*/

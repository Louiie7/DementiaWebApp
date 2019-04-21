// https://www.geeksforgeeks.org/longest-common-substring-dp-29/

let PQ = require(__dirname +"/maxheap");

//it is not perfect since some matrix positions exlude other matrix positions. Therefore another dynamic solution is needed to optimize the sum. Although the importance is just that the result is equevalent for all cases.
function LCSS_optimized(rec, memo) {
  let DPmatrix = new Array(rec.length+1);
  for(let i = 0; i <= rec.length; i++) {
    DPmatrix[i] = new Array(memo.length+1);
  }
  for(let i = 0; i <= memo.length; i++) {
    DPmatrix[0][i] = 0;
  }
  for(let i = 0; i <= rec.length; i++) {
    DPmatrix[i][0] = 0;
  }
  for(let i = 0; i < rec.length; i++) {
    //Maybe it should be i-1 and j-1
    for(let j = 0; j < memo.length; j++) {
      let newI = i+1;
      let newJ = j+1;
      if(rec.charAt(i) == memo.charAt(j)) {
        DPmatrix[newI][newJ] = DPmatrix[i][j] + 1;
      }
      else {
        DPmatrix[newI][newJ] = 0;
      }
    }
  }
  let visitedREC = new Array(rec.length+1);
  //let amountREC = new Array(rec.length+1);
  for(let i = 0; i <= rec.length; i++) {
    visitedREC[i] = false;
    //amountREC[i] = 0;
  }
  let visitedMEMO = new Array(memo.length+1);
  //let amountMEMO = new Array(memo.length+1);
  for(let i = 0; i <= memo.length; i++) {
    visitedMEMO[i] = false;
    //amountMEMO[i] = 0;
  }
  let pq = new PQ.MaxHeap([]);
  //let counter = 0;
  for(let i = rec.length; i > -1; i--){
    for(let j = memo.length; j > -1; j--){
      if(DPmatrix[i][j] != 0){
        let element = new PQ.MatrixIndex(DPmatrix[i][j], [i,j]); //minus ?
        pq.insert(element);
        //counter++;
      }
    }
  }
  let sum = 0;
  //console.log(counter);
  //counter = 0;
  while(!pq.isEmpty()){
    //console.log(pq.getArray())
    let curr = pq.rootdelete();
    //counter++;
    //console.log(curr)
    if(isValid(curr, visitedREC, visitedMEMO)){
      //console.log(curr.num, curr.pos);
      for(let k = 0; k < curr.num; k++){
        visitedREC[curr.pos[0] - k] = true;
        visitedMEMO[curr.pos[1] - k] = true;
      }
      sum += Math.pow(curr.num, 2)
    }
  }
  //console.log(counter);
  /*for(let i = rec.length; i > -1; i--){
    for(let j = memo.length; j > -1; j--){
      if(!visitedREC[i] && !visitedMEMO[j]){
        sum += Math.pow(DPmatrix[i][j], 2)
        for(let k = 0; k < DPmatrix[i][j]; k++){
          visited[i-k][j-k] = true;
        }
      }
    }
  }*/
  //console.log(DPmatrix);
  return sum;
}

function isValid(curr, visitedREC, visitedMEMO){
  for(let k = 0; k < curr.num; k++){
    if(visitedREC[curr.pos[0] - k]) return false;
    if(visitedMEMO[curr.pos[1] - k]) return false;
  }
  return true;
}

function LCSS(rec, memo) {
  let pos = new Array(2);
  let maxLength = 0;
  let DP = new Array(rec.length+1);
  for(let i = 0; i <= rec.length; i++) {
    DP[i] = new Array(memo.length+1);
  }
  for(let i = 0; i <= memo.length; i++) {
    DP[0][i] = 0;
  }
  for(let i = 0; i <= rec.length; i++) {
    DP[i][0] = 0;
  }
  for(let i = 0; i < rec.length; i++) {
    //Maybe it should be i-1 and j-1
    for(let j = 0; j < memo.length; j++) {
      let newI = i+1;
      let newJ = j+1;
      if(rec.charAt(i) == memo.charAt(j)) {
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

function LCSvalue(rec, memo){
  let timestart = console.time("timer");
  let res = LCSS(rec, memo)
  let sum = 0;
  while(res.maxLength != 0) {
    sum += Math.pow(res.maxLength, 2);
    console.log(res.maxLength, res.pos);
    memo = memo.substring(0, res.pos[1]-res.maxLength+1) + buildStringOf("§", res.maxLength) +memo.substring(res.pos[1]+1, memo.length)
    rec = rec.substring(0, res.pos[0]-res.maxLength+1) + buildStringOf("#", res.maxLength) + rec.substring(res.pos[0]+1, rec.length)
    //console.log(rec, memo);
    res = LCSS(rec, memo);
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

module.exports.LCS = LCSS_optimized;
module.exports.normalize = (numericalValue, request) => {
  return numericalValue / (request.length * request.length)
};

/*
console.time("timer");
console.log(LCSS_optimized("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."))
console.timeEnd("timer");

console.time("timer");
console.log(LCSvalue("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."))
console.timeEnd("timer");

console.time("timer");
console.log(LCSS_optimized("Lorem Ipsumtext of the", "established  that a rea"))
console.timeEnd("timer");

console.time("timer");
console.log(LCSvalue("Lorem Ipsumtext of the", "established  that a rea"))
console.timeEnd("timer");
*/
/*
console.time("timer");
console.log(LCSS_optimized("It is a long established", "It is a long established"))
console.timeEnd("timer");

console.time("timer");
console.log(LCSvalue("It is a long established", "It is a long established"))
console.timeEnd("timer");

console.time("timer");
console.log(LCSS_optimized("abcdefg", "fbcdegh"))
console.timeEnd("timer");

console.time("timer");
console.log(LCSvalue("abcdefg", "fbcdegh"))
console.timeEnd("timer");*/

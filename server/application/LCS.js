// https://www.geeksforgeeks.org/longest-common-substring-dp-29/
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
      if(rec.charAt(i) == memo.charAt(j)) {
        DP[i+1][j+1] = DP[i][j] + 1;
        if(DP[i+1][j+1] > maxLength) {
          maxLength = DP[i+1][j+1];
          pos[0] = i;
          pos[1] = j;
        }
      }
      else {
        DP[i+1][j+1] = 0;
      }
    }
  }
  return{
    maxLength: maxLength,
    pos: pos
  }
}
function LCSvalue(rec, memo){
  let res = LCSS(rec, memo)
  let sum = 0;
  while(res.maxLength != 0) {
    sum += Math.pow(res.maxLength, 2);
    memo =  memo.substring(0, res.pos[1]-res.maxLength+1) + "§" +memo.substring(res.pos[1]+1, memo.length)
    rec =  rec.substring(0, res.pos[0]-res.maxLength+1) + "#" + rec.substring(res.pos[0]+1, rec.length)
    res = LCSS(rec, memo);
  }
  return sum;
}
let timestart = console.time("timer");
console.log(LCSvalue("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."))
console.timeEnd("timer");

let weights = [1, 1, 0.4]

module.exports = {
  //train(){}
  evaluate(factors){
    let result = 0;
    for(let i = 0; i < factors.length; i++){
      result += weights[i] * factors[i];
    }
    return result;
  }
}

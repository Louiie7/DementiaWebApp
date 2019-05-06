// This file contains everything related to the statistical multivariable linear model.

let weights = [1, 0.5, 0.5] // factor 2 and factor 3 counts as on factor and therefore shares an equally distributed weigth.

module.exports = {
  train(){}, // there is no need to implement the train function to train the linearModel

  // returns a weigthed sum of the factors (the prediction of the linearmodel)
  evaluate(factors){
    let result = 0; // a result variable to keep track of the sum of weigthed values
    for(let i = 0; i < factors.length; i++){ // all the factors are looped over
      result += weights[i] * factors[i]; // the weight of a given factor times the actual factor value is appended to the result variable.
    }
    return result; // result of evaluation is returned
  }
}

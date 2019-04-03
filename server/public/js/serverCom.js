console.log("Recieved ServerFile and index.html")

async function sendRequest(relativeUrl, data){
  var xhttp = new XMLHttpRequest();
  let promise = new Promise(function(resolve, reject){
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          resolve(xhttp.responseText)
        }
    };
  })
  xhttp.open("POST", relativeUrl, true);
  xhttp.setRequestHeader('Content-Type', 'application/json')
  var bodyData = JSON.stringify(data);
  xhttp.send(bodyData);
  let result = await promise
  result.then(function(value){
      return value;
  })
}

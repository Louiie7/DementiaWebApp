console.log("Recieved ServerFile and index.html")

function send(text, id){
  console.log(text)
  let response = sendRequest(id, {
    "data":text
  })
  response.then((data) => {
    if(id == "Receive"){
      speechSynthesise(data);
    }
  })
}

async function sendRequest(relativeUrl, data){
  var xhttp = new XMLHttpRequest();
  let promise = new Promise(function(resolve, reject){
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          resolve(xhttp.responseText)
        }
    };
  })
  xhttp.open("POST",  relativeUrl);
  xhttp.setRequestHeader('Content-Type', 'application/json')
  var bodyData = JSON.stringify(data);
  xhttp.send(bodyData);
  console.log(bodyData)
  let result = await promise
  return result;
}

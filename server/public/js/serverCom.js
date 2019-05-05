/*returns null: sendRequestToServer(String text, String id) sends the recording (text)
 to the server along with the type of recording (id)*/
function sendRequestToServer(text, id){
  console.log(text);
  let response = sendPostRequest(id, {
    "data":text
  }) //initialize the object for the body of the post request
  response.then((data) => { //if type of recording is a request then response is spoken aloud.
    if(id == "Receive"){
      speechSynthesise(data);
    }
  })
}

/*returns a promise containing the response from the post request: sendPostRequest(String relativeUrl, Object data) is called to sends
to send a post request with the url (relativeUrl) and the post request body (data)
The function is asyncronous the caller of the function will have to use sendPostRequest(relativeUrl, data).then to access the data returned.*/
async function sendPostRequest(relativeUrl, data){
  var xhttp = new XMLHttpRequest(); //initialize new request object
  let promise = new Promise(function(resolve, reject){ //initialize the promise with a callback.
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) { // checks if the request was succesful
          resolve(xhttp.responseText) //when the promise is resolved sendPostRequest the response data is accesible in the promise object.
        }
    };
  })
  xhttp.open("POST",  relativeUrl); //configures the post request
  xhttp.setRequestHeader('Content-Type', 'application/json') //type of request
  var bodyData = JSON.stringify(data); //converts the data object to a String which can be send
  xhttp.send(bodyData); // request is send
  let result = await promise
  return result;
}

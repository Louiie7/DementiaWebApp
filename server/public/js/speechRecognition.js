let speechRecEngine;

let currentAccuRecording = [];

//rekursiv funktion der akkumulere web speech data
function startRecording(type){
  speechRecEngine = {
    "engine": new webkitSpeechRecognition(),
    "sender":type
  };
  speechRecEngine.engine.lang = 'en-US';
  speechRecEngine.engine.start();
  speechRecEngine.engine.onresult = function(recording){
    currentAccuRecording.push(recording.results[0][0].transcript);
    if(speechRecEngine.sender.isOn){
      startRecording(speechRecEngine.sender);
    }
  }
}

function stopRecording(){
  speechRecEngine.engine.stop();
  send(accumulate(currentAccuRecording), speechRecEngine.sender.id)
}

function accumulate(list){
  return list.join("");
}
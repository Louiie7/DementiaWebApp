let speechRecEngine; //SpeechRecognition butt initially null: contains the speach recognition engine

let currentAccuRecording = []; //String[]: contains a list of the strings recorded for the current recording

//returns null, startRecording(Element type) starts a recording. Type is a customized dom element to identify the type of recording: record or request.
function startRecording(type){
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
  speechRecEngine = { //initializes a custom speech reqocnition objekt with the actual engine and the button that was clicked as a property
    "engine": new SpeechRecognition(),
    "sender": type //type is the dom element - the button
  };
  speechRecEngine.engine.onerror = (e) => {console.log(e)} //error handling
  speechRecEngine.engine.lang = 'en-US'; //makes is reqocnize english
  speechRecEngine.engine.start(); //starts the recording
  speechRecEngine.engine.onresult = onResult; //sets the callback. Look below.
}

/* returns null: onResult(recording) when the speech recognition engine stops after a preset time limit
  or no speech the onResult function is called as a callback. The recording object contains the transcript of the recording*/
function onResult(recording){
  currentAccuRecording.push(recording.results[0][0].transcript);
  if(speechRecEngine.sender.isOn){
    startRecording(speechRecEngine.sender);
  }else{
    sendRequestToServer(currentAccuRecording.join("").toLowerCase(), speechRecEngine.sender.id)
    currentAccuRecording = []
  }
}

function stopRecording(){
  speechRecEngine.engine.stop();
}

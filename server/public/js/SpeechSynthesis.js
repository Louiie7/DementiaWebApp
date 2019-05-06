//this file contains everything related to speech synthesis

let last_data; // String: contains the last string to be speechsynthesised.
                //Initially is is null and will throw error if replay button is clicked

//returns null: speechSynthesise(String data) speaks aloud the data.
function speechSynthesise(data){
  last_data = data; // updates last_data to make sure replay button always speaks the newest note
  let speechSynthesiser = window.speechSynthesis;
  let stringToSpeak = new SpeechSynthesisUtterance(data); // create new instance of the built in speachSynthesis class.
  stringToSpeak.rate = 1; //speaking pace
  speechSynthesiser.speak(stringToSpeak); // speaks aloud
}

// returns null:  replay() replays the last string that was speechsynthesised.
function replay(){
  speechSynthesise(last_data)
}

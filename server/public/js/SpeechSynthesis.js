let last_data;

function speechSynthesise(data){
  last_data = data;
  let speechSynthesiser = window.speechSynthesis;
  let stringToSpeak = new SpeechSynthesisUtterance(data);
  stringToSpeak.rate = 1;
  speechSynthesiser.speak(stringToSpeak)
}

function replay(){
  speechSynthesise(last_data)
}

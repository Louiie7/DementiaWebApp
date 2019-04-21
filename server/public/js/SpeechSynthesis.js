function speechSynthesise(data){
  let speechSynthesiser = window.speechSynthesis;
  let stringToSpeak = new SpeechSynthesisUtterance(data);
  stringToSpeak.rate = 1;
  speechSynthesiser.speak(stringToSpeak)
}

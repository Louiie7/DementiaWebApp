function speechSynthesise(data){
  let speechSynthesiser = window.speechSynthesis;
  let stringToSpeak = new SpeechSynthesisUtterance(data);
  stringToSpeak.rate = 1.5;
  speechSynthesiser.speak(stringToSpeak)
}

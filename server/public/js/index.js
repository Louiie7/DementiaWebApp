let rcbutton;
let rcvbutton;

window.onload = function() {
  rcbutton = document.getElementById("Record");
  rcbutton.isOn = false;
  rcvbutton = document.getElementById("Receive");
  rcvbutton.isOn = false;
  changetext(rcbutton, rcvbutton)
  changetext(rcvbutton, rcbutton)
}

function changetext(element, other) {
  element.addEventListener("click", function() {
    if(element.value == "Record" && !other.isOn) {
      element.value = "Stop recording"
      element.isOn = true;
      element.style.backgroundColor = "red";
      startRecording(element);
    }
    else {
      element.value = "Record"
      element.style.backgroundColor = "#42f450";
      element.isOn = false;
      stopRecording();
    }
  });
}

window.onload = onLoad; // the onLoad function is now called when the page is loaded

//returns null: onLoad() configures eventlisteners for the record and receive buttons.
function onLoad(){
  let recordButton, reiceiveButton; //instantiate variables for the two buttons
  recordButton = document.getElementById("Record"); //sets the variables equal to the record button dom element
  recordButton.isOn = false; //the isON boolean property indicates if the button has been pressed and is still recording
  reiceiveButton = document.getElementById("Receive"); //sets the variables equal to the request/recieve button dom element
  reiceiveButton.isOn = false; //the isON boolean property indicates if the button has been pressed and is still recording
  // the custom eventlisteners are set
  initialiseButtonEventlistener(recordButton, reiceiveButton);
  initialiseButtonEventlistener(reiceiveButton, recordButton);
}

// returns null: initialiseButtonEventlistener(element, otherelement) sets the click eventlistener of a button (element)
function initialiseButtonEventlistener(element, otherElement) {
  element.addEventListener("click", function() { // when one of the buttons is pressed this callback is called.
    if(!element.isOn && !otherElement.isOn) { // a recording should only be started if no recording is currently being recorded
      element.value = "Stop recording";
      element.isOn = true;
      element.style.backgroundColor = "#ff5e57";
      startRecording(element); //starting the new recording
    }
    else {
      element.value = "Record";
      element.style.backgroundColor = "#0be881";
      element.isOn = false;
      stopRecording(); //stopping the current recording
    }
  });
}

window.onload = function() {
  let rcbutton = document.getElementById("Record"));
  let rcvbutton = document.getElementById("Receive"));

}

function changetext(element, other) {
  element.addEventListener("click", function() {
    if(element.value== "Record") {
      element.value = "Stop recording"

    }
    else {
      element.value = "Record"
    }
  });
}

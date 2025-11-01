let form = document.querySelector("#options");
form.elements["slope-field"].checked = displaySlopeField

form.onchange = (event) => {
    displaySlopeField = form.elements["slope-field"].checked
}
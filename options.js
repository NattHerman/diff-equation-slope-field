let form = document.querySelector("#options");

// Update script with options on-load
displaySlopeField = form.elements["slope-field"].checked
displayIVPPath = form.elements["IVP-path"].checked

// Update script with options on-change
form.onchange = (event) => {
    displaySlopeField = form.elements["slope-field"].checked
    displayIVPPath = form.elements["IVP-path"].checked
}
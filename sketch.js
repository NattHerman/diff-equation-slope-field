var resizeTimeout = false
var resizeDelay = 50

// Increase performance by disabling these
p5.disableFriendlyErrors = true;
let grid

let zoomSensitivity = 0.2
let zoomSmoothingSpeed = 0.02
let gridScaleTarget = 50

let equationIndex = 0 
const diffEquations = [
	(x, y) => sin(x)**2,
	(x, y) => sin(y),
	(x, y) => sin(y) - sin(x),
	(x, y) => sin(x*y),
	(x, y) => x,
	(x, y) => x * y,
	(x, y) => x - y,
	(x, y) => x + y,
	(x, y) => x / y,
	(x, y) => 2*y / x,
	(x, y) => x / (-y),
	(x, y) => x**2 + y**2,
]


function drawDiffEquationInitialCondition(diffEquation, initialPoint, stepLength, count) {
	let x = initialPoint.x
	let y = initialPoint.y

	let p = grid.getPixelPos(x, y)

	stroke("gray")
	circle(p.x, p.y, 10)

	let prevX = p.x
	let prevY = p.y

	stroke(255)

	/*
	// Draw using a constant step-size in x-direction
	// Draw in positive direction
	// stepLength is the length traveled in x-direction
	for (let i = 0; i < count; i++) {
		x += stepLength
		y -= diffEquation(x, y) * stepLength

		let p = grid.getPixelPos(x, y)

		line(p.x, p.y, prevX, prevY)

		prevX = p.x
		prevY = p.y
	}
	*/
	
	// Draw in the direction of the slope.
	// stepLength is the total length traveled per step
	for (let i = 0; i < count; i++) {
		let slope = diffEquation(x, y)
		let angle = atan(slope)

		x += stepLength * cos(angle)
		y += stepLength * sin(angle)

		let p = grid.getPixelPos(x, y)

		line(p.x, p.y, prevX, prevY)

		prevX = p.x
		prevY = p.y
	}
}

function drawDiffEquationGrid(diffEquation, slopeLength, spacing, count) {
	//let h = 0.5

	strokeWeight(2)

	for (let x = -spacing * count / 2; x <= spacing * count / 2; x += spacing) {
		for (let y = -spacing * count / 2; y <= spacing * count / 2; y += spacing) {

			let result = diffEquation(x, y)

			//let h = sqrt(slopeLength**2 / (1 + (1/(result**2))))

			let theta = atan(result)
			let dx = slopeLength * cos(theta)
			let dy = slopeLength * sin(theta)

			let backwardSlopePos = grid.getPixelPos(x + dx, y + dy)
			let forwardSlopePos = grid.getPixelPos(x - dx, y - dy)

			let p = grid.getPixelPos(x, y)


			if (result >= 0) {
				stroke("#53cc51")
			} else {
				stroke("#ee7056")
			}

			//circle(p.x, p.y, 10)
			line(backwardSlopePos.x, backwardSlopePos.y,
				forwardSlopePos.x, forwardSlopePos.y
			)
		}
	}
}

// Better than lerp smoothing
function expDecay(a, b, decay, dt) {
	return b + (a - b) * exp(-decay*dt)
}

function panGrid(grid) {
	if (mouseButton == "center" && mouseIsPressed) {
		let movement = createVector(movedX, movedY)
		grid.offset.add(movement)
	}
}


function keyPressed() {
if (key == " ") {
	equationIndex = (equationIndex + 1) % diffEquations.length
		print(equationIndex)
	}
}

function mouseWheel(event) {
	gridScaleTarget *= 1 - zoomSensitivity * (event.delta / 100)

	/*
	if (event.delta > 0) {
		gridScaleTarget *= 1 - zoomSensitivity * (event.delta / 100)
		//grid.scale.mult(0.9)
		//grid.scale.x *= 0.9
		//grid.scale.y *= 0.9
	} else {
		gridScaleTarget *= 1 + zoomSensitivity
		//grid.scale.mult(1.1)
		//grid.scale.x *= 1.1
		//grid.scale.y *= 1.1
	}
	*/
}

// Update canvas size with window resize
addEventListener("resize", (event) => {
	clearTimeout(resizeTimeout)

	resizeTimeout = setTimeout(setup, resizeDelay)
})

function setup() {
	let mainCanvas = document.getElementById("mainCanvas")
	createCanvas(windowWidth, windowHeight, mainCanvas);
	background("#1d1f2d");

	let gridScale = gridScaleTarget
	let gridSpacing = 1

	grid = new Grid(
		createVector(gridScale, gridScale), // scale
		createVector(width / 2, height / 2), // offset
		createVector(gridSpacing, gridSpacing), // spacing
	)
}

function draw() {
	background("#1d1f2d");

	grid.scale.x = expDecay(
		grid.scale.x,
		gridScaleTarget,
		zoomSmoothingSpeed,
		deltaTime
	)
	grid.scale.y = expDecay(
		grid.scale.y,
		gridScaleTarget,
		zoomSmoothingSpeed,
		deltaTime
	)

	panGrid(grid)

	grid.draw()

	drawDiffEquationGrid(
		diffEquations[equationIndex],
		0.1, // length
		0.5, // spacing
		20 // count
	)

	let initPos = grid.getWorldPos(mouseX, mouseY)

	drawDiffEquationInitialCondition(diffEquations[equationIndex], initPos, 0.1, 1600)
	drawDiffEquationInitialCondition(diffEquations[equationIndex], initPos, -0.1, 1600)
}

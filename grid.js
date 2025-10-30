class Grid {
	constructor(scale, offset, spacing, count) {
		// gridspace = screenspace / scale
		this.scale = scale.copy(); // 2d vector
		// Spacing between the grid lines in x and y direction
		this.spacing = spacing.copy(); // 2d vector

		this.count = count.copy()

		this.offset = offset.copy()
		this.zoomTarget
	}

	getPixelPos(x, y) {
		return createVector(
			x * this.scale.x + this.offset.x,
			-y * this.scale.y + this.offset.y
		)
	}

	getPixelX(x) {
		return x * this.scale.x + this.offset.x
	}

	getPixelY(y) {
		return -y * this.scale.y + this.offset.y
	}

	getWorldPos(x, y) {
		return createVector(
			(x - this.offset.x) / this.scale.x,
			-(y - this.offset.y) / this.scale.y
		)
	}

	getWorldX(x) {
		return (x - this.offset.x) / this.scale.x
	}

	getWorldY(y) {
		return -(y - this.offset.y) / this.scale.y
	}

	draw() {
		strokeWeight(1)
		stroke("#707497")

		// –– Vertical lines ––
		// Start at left edge
		let x = -floor(this.offset.x / (this.spacing.x * this.scale.x));
		let screenX = this.getPixelX(x)
		while (screenX <= width) {
			line(screenX, 0, screenX, height)

			x += this.spacing.x
			screenX = this.getPixelX(x)
		}

		// –– Horizontal lines ––
		// Start at top edge
		let y = floor(this.offset.y / (this.spacing.y * this.scale.y));
		let screenY = this.getPixelY(y)
		while (screenY <= height) {
			line(0, screenY, width, screenY)

			y -= this.spacing.y
			screenY = this.getPixelY(y)
		}

		/*
		for (let y = 0; y < this.count.y / 2; y++) {
			let verticalPos = -y * this.spacing.y * this.scale.y + this.offset.y
			line(0, verticalPos, width, verticalPos)
		}
		for (let y = 0; y > -this.count.y / 2; y--) {
			let verticalPos = -y * this.spacing.y * this.scale.y + this.offset.y
			line(0, verticalPos, width, verticalPos)
		}
		*/

		// x-axis
		strokeWeight(2)
		stroke("#4E52A8")
		let origin = this.getPixelPos(0, 0)
		line(0, origin.y, width, origin.y)
		line(origin.x, 0, origin.x, height)
	}
}


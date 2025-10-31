class Grid {
	constructor(scale, offset, spacing, minPixelSpace = 15) {
		// gridspace = screenspace / scale
		this.scale = scale.copy(); // 2d vector
		// Spacing between the grid lines in x and y direction
		this.spacing = spacing.copy(); // 2d vector

		// Minimum number of pixels between lines before the spacing is doubled
		this.minPixelSpace = minPixelSpace

		this.offset = offset.copy()
		this.zoomTarget

		//this.mainColor = color("#707497")
		this.mainColor = color("#515472")
		this.secondaryColor = color("#36384e")
		this.highlightColor = color("#4E52A8")
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
		stroke(this.mainColor)

		let spacingFactor = 1

		let pixelsBetweenLines = this.spacing.x * this.scale.x
		while (pixelsBetweenLines < this.minPixelSpace) {
			spacingFactor *= 4

			pixelsBetweenLines = this.spacing.x * spacingFactor * this.scale.x
		}

		// –– Vertical lines ––
		// Start at left edge
		let x = -floor(this.offset.x / (this.spacing.x * this.scale.x * spacingFactor)) * spacingFactor;
		//if (abs(x % 2) == 1) { x -= 1 } // Prevent x from starting at an odd number
		let screenX = this.getPixelX(x)
		while (screenX <= width) {
			if (abs(x/spacingFactor % 4) == 0) {
				stroke(this.mainColor)
			} else {
				stroke(this.secondaryColor)
			}

			line(screenX, 0, screenX, height)
			
			x += this.spacing.x * spacingFactor
			screenX = this.getPixelX(x)
		}

		// –– Horizontal lines ––
		// Start at top edge
		let y = floor(this.offset.y / (this.spacing.y * this.scale.y * spacingFactor)) * spacingFactor;
		//if (abs(y % 2) == 1) { y -= 1 } // Prevent y from starting at an odd number
		let screenY = this.getPixelY(y)
		while (screenY <= height) {
			if (abs(y/spacingFactor % 4) == 0) {
				stroke(this.mainColor)
			} else {
				stroke(this.secondaryColor)
			}
			line(0, screenY, width, screenY)

			y -= this.spacing.y * spacingFactor
			screenY = this.getPixelY(y)
		}

		strokeWeight(2)
		stroke(this.highlightColor)
		let origin = this.getPixelPos(0, 0)
		line(0, origin.y, width, origin.y)
		line(origin.x, 0, origin.x, height)
	}
}


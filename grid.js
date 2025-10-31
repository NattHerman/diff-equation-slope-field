// Better than lerp smoothing
function expDecay(a, b, decay, dt) {
	return b + (a - b) * exp(-decay*dt)
}


class Grid {
	constructor(scale, offset, spacing, scaleInterpolationSpeed, minPixelSpace = 15) {
		// gridspace = screenspace / scale
		this.scale = scale.copy(); // 2d vector
		this.scaleTarget = 50
		this.scaleInterpolationSpeed = scaleInterpolationSpeed
		// Spacing between the grid lines in x and y direction
		this.spacing = spacing.copy(); // 2d vector

		// Minimum number of pixels between lines before the spacing is scaled by a factor
		this.scalingGrowthFactor = 4
		this.minPixelSpace = minPixelSpace
		this.maxPixelSpace = minPixelSpace * this.scalingGrowthFactor
		this.spacingFactor = 1

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

	update(dt) {
		this.scale.x = expDecay(
			this.scale.x,
			this.scaleTarget,
			zoomSmoothingSpeed,
			dt
		)
		this.scale.y = expDecay(
			this.scale.y,
			this.scaleTarget,
			zoomSmoothingSpeed,
			dt
		)
	}

	draw() {
		strokeWeight(1)
		stroke(this.mainColor)

		this.spacingFactor = 1
		let pixelsBetweenLines = this.spacing.x * this.scale.x

		if (pixelsBetweenLines < this.minPixelSpace) {
			while (pixelsBetweenLines < this.minPixelSpace) {
				this.spacingFactor *= this.scalingGrowthFactor

				pixelsBetweenLines = this.spacing.x * this.spacingFactor * this.scale.x
			}

		} else {
			while (pixelsBetweenLines > this.maxPixelSpace) {
				this.spacingFactor /= this.scalingGrowthFactor

				pixelsBetweenLines = this.spacing.x * this.spacingFactor * this.scale.x
			}

		}
		
		
		// –– Vertical lines ––
		// Start at left edge
		let x = -floor(this.offset.x / (this.spacing.x * this.scale.x * this.spacingFactor)) * this.spacingFactor * this.spacing.x;
		//if (abs(x % 2) == 1) { x -= 1 } // Prevent x from starting at an odd number
		let screenX = this.getPixelX(x)
		while (screenX <= width) {
			if (abs(x/this.spacingFactor % this.scalingGrowthFactor) == 0) {
				stroke(this.mainColor)
			} else {
				stroke(this.secondaryColor)
			}

			line(screenX, 0, screenX, height)
			
			x += this.spacing.x * this.spacingFactor
			screenX = this.getPixelX(x)
		}

		// –– Horizontal lines ––
		// Start at top edge
		let y = floor(this.offset.y / (this.spacing.y * this.scale.y * this.spacingFactor)) * this.spacingFactor * this.spacing.x;
		//if (abs(y % 2) == 1) { y -= 1 } // Prevent y from starting at an odd number
		let screenY = this.getPixelY(y)
		while (screenY <= height) {
			if (abs(y/this.spacingFactor % this.scalingGrowthFactor) == 0) {
				stroke(this.mainColor)
			} else {
				stroke(this.secondaryColor)
			}
			line(0, screenY, width, screenY)

			y -= this.spacing.y * this.spacingFactor
			screenY = this.getPixelY(y)
		}

		strokeWeight(2)
		stroke(this.highlightColor)
		let origin = this.getPixelPos(0, 0)
		line(0, origin.y, width, origin.y)
		line(origin.x, 0, origin.x, height)
	}
}

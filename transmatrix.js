/*global require:false*/

var tm = {};

tm.identityMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
tm.matrix = tm.identityMatrix;
tm.initialVertices = [
	[75, 75],
	[100, 50],
	[125, 75],
	[125, 120],
	[75, 120]
];
tm.vertices = tm.initialVertices.slice();

tm.inputs = null;
tm.ctx = null;

tm.calculateMatrix = function() {
	var matrix;
	matrix = this.matrix = 
			this.inputs.map(function(input) {
				var value = input.value;
				// Check if sin() or cos() is
				// used, and if so, translate 
				// them to the appropriate values.
				value = value.replace(/(sin|cos)\((\d(?:\.\d+)?)\)/, function(all, type, number) {
						return Math[type](number);
				});
				// Replace PI with the real value.
				value = value.replace(/\bPI\b/, function() {
					return Math.PI;
				});
				return parseFloat(value) || 0; 
			});
	this.vertices = this.vertices.map(function(vertex, i) {
		return [matrix[0] * vertex[0] + matrix[1] * vertex[1] + matrix[2],
		        matrix[3] * vertex[0] + matrix[4] * vertex[1] + matrix[5]];
	});
};

tm.draw = function() {
	var ctx = this.ctx;
	var canvas = ctx.canvas;
	var i;
	var pixelGapBetweenPoints = 30;
	var currentValue;
	var midWidth = canvas.width / 2;
	var midHeight = canvas.height / 2;
	var textWidth;
 	ctx.clearRect(-midWidth, -midHeight, canvas.width, canvas.width);

	ctx.strokeStyle = ctx.fillStyle = "#ccc";
	ctx.beginPath();

	// Draw X axis.
	for (i = -midWidth; i < midWidth; i += pixelGapBetweenPoints) {
		currentValue = Math.floor(i / pixelGapBetweenPoints);
		if ( ! currentValue) {
			continue;
		}
     	if ( ! (currentValue % 2)) {
     		textWidth = ctx.measureText(i).width;
     		ctx.fillText(i, i - textWidth / 2, -5);
     	}
		ctx.moveTo(i + .5, -3);
		ctx.lineTo(i + .5, 0);
	}

	ctx.moveTo(-midWidth, .5);
	ctx.lineTo(midWidth, .5);

	// Draw Y axis.
	for (i = -midHeight; i < midHeight; i += pixelGapBetweenPoints) {
		currentValue = Math.floor(i / pixelGapBetweenPoints);
		if ( ! currentValue) {
			continue;
		}
     	if ( ! (currentValue % 2)) {
	     	ctx.fillText(i, 3, i + 5);
     	}
		ctx.moveTo(-3, i + .5);
		ctx.lineTo(0, i + .5);
	}

	ctx.moveTo(-3.5, -midHeight);
	ctx.lineTo(-3.5, midHeight);

	ctx.closePath();
	ctx.stroke();

	// Draw object.
	ctx.fillStyle = "goldenrod";
	ctx.strokeStyle = "#000";
	ctx.beginPath();
	this.vertices.forEach(function(vertex) {
		ctx.lineTo(vertex[0] + .5, vertex[1] + .5);
	});
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
};
 
tm.updateInputs = function() {
	var matrix = this.matrix;
	this.inputs.forEach(function(input, index) {
		input.value = matrix[index];
	});
};

tm.init = function() {

	var syncStates = function() {
		var isCustom = !!this.transformationType.value;
		this.transformationTypeInput.disabled = ! isCustom;
		this.inputs.forEach(function(input) {
			input.disabled = isCustom;
		});
	}.bind(this);

	var presetCallbacks = function(type, value) {
		var matrix = this.matrix;
		({
			"translate-x": function() {
				matrix[2] = value;
			},
			"translate-y": function() {
				matrix[5] = value;
			},
			"scale-x": function() {
				matrix[0] = value;
			},
			"scale-y": function() {
				matrix[4] = value;
			},
			"rotate-cw": function() {
				matrix[0] = Math.cos(value);
				matrix[1] = Math.sin(value);
				matrix[3] = -Math.sin(value);
				matrix[4] = Math.cos(value);			
			},
			"rotate-ccw": function() {
				matrix[0] = Math.cos(value);
				matrix[1] = -Math.sin(value);
				matrix[3] = Math.sin(value);
				matrix[4] = Math.cos(value);	
			},
			"shear-x": function() {
				matrix[1] = value;
			},
			"shear-y": function() {
				matrix[3] = value;
			}

		})[type]();
		this.updateInputs();
	}.bind(this);

	document.addEventListener("DOMContentLoaded", function() {
		var form = document.forms[0];
		var matrixInputsContainer = form.querySelector("ol");
		this.ctx = document.querySelector("canvas").getContext("2d");
		this.ctx.translate(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
		this.transformationType = form.querySelector("select");
		this.transformationTypeInput = form.querySelector("#transformation-type-value");

		this.draw();
		this.inputs = [].slice.call(matrixInputsContainer.querySelectorAll("input[type='number']"));
		this.updateInputs();
		form.addEventListener("submit", function(event) {
			event.preventDefault();
			this.calculateMatrix();
			this.draw();
		}.bind(this));
		form.addEventListener("reset", function(event) {
			event.preventDefault();
			this.matrix = this.identityMatrix;
			tm.vertices = tm.initialVertices.slice();
			this.updateInputs();
			this.transformationType.selectedIndex = this.transformationTypeInput.value = 0;
			syncStates();
			this.calculateMatrix();
			this.draw();
		}.bind(this));
		matrixInputsContainer.addEventListener("keyup", function(event) {
			var value = event.target.value;
			event.target.type = /^-?\d+(?:\.\d+)?$/.test(value) ? "number" : "text";
		}.bind(this));
		this.transformationType.addEventListener("change", function() {
			syncStates();
		}.bind(this));
		this.transformationTypeInput.addEventListener("input", function() {
			presetCallbacks(this.transformationType.value, this.transformationTypeInput.value);
		}.bind(this));
		syncStates();
	}.bind(this));
};

tm.init();
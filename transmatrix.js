/*global require:false*/

var tm = {};

tm.identityMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
tm.matrix = tm.identityMatrix;
tm.vertices = [
	[75, 75],
	[125, 75],
	[125, 150],
	[75, 150]
];

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
				debugger;
				value = value.replace(/(math|cos)\((\d(?:\.\d+)?)\)/, function(all, type, number) {
						return Math[type](number);
				});
				return parseFloat(value) || 0; 
			});
	this.updateInputs();
	this.vertices.forEach(function(vertex, i) {
		vertex[0] = matrix[0] * vertex[0] + matrix[1] * vertex[1] + matrix[2];
		vertex[1] = matrix[3] * vertex[0] + matrix[4] * vertex[1] + matrix[5];
	});
};

tm.draw = function() {
	var ctx = this.ctx;
	ctx.fillStyle = "goldenrod";
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.beginPath();
	this.vertices.forEach(function(vertex) {
		ctx.lineTo(vertex[0] + .5, vertex[1] + .5);
	});
	ctx.closePath();
	ctx.fill();
};
 
tm.updateInputs = function() {
	var matrix = this.matrix;
	this.inputs.forEach(function(input, index) {
		input.value = matrix[index];
	});
};

tm.init = function() {
	document.addEventListener("DOMContentLoaded", (function() {
		var form = document.forms[0];
		this.ctx = document.querySelector("canvas").getContext("2d");
		this.draw();
		this.inputs = [].slice.call(form.querySelectorAll("input[type='number']"));
		this.updateInputs();
		form.addEventListener("submit", (function(event) {
			event.preventDefault();
			this.calculateMatrix();
			this.draw();
		}).bind(this));
		form.addEventListener("reset", (function(event) {
			event.preventDefault();
			this.matrix = this.identityMatrix;
			this.updateInputs();
			this.calculateMatrix();
			this.draw();
		}).bind(this));
		form.addEventListener("input", (function(event) {
			var value = event.target.value;
			event.target.type = /^\d+(?:\.\d+)?$/.test(value) ? "number" : "text";
		}).bind(this));
	}).bind(this));
};

tm.init();
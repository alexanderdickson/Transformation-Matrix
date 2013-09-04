;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function(){/*global require:false*/

var tm = {};


tm.matrix = [1, 0, 0, 1];
tm.vertices = [
	[5, 5],
	[10, 10]
];

tm.inputs = null;
tm.ctx = null;

tm.draw = function() {
	var ctx = this.ctx;

	ctx.beginPath();

	ctx.closePath();
	ctx.stroke();
};

tm.updateInputs = function() {
	var matrix = this.matrix;
	this.inputs.forEach(function(input, index) {
		input.value = matrix[index];
	})
};

tm.init = function() {

	document.addEventListener("DOMContentLoaded", (function() {
		this.ctx = document.querySelector("canvas").getContext("2d");
		this.draw();
		this.inputs = [].slice.call(document.querySelectorAll("input[type='number']"));
		this.updateInputs();
	}).bind(this));


};

tm.init();
})()
},{}]},{},[1])
;
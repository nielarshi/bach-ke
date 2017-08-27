define(function(require, exports, module) {

	var View = require('famous/core/View');
	var CanvasSurface = require('famous/surfaces/CanvasSurface');
	var Modifier = require("famous/core/Modifier");
	var Transform = require("famous/core/Transform");

	var Timer = require("famous/utilities/Timer");

	var WaveCanvas = function() {
		View.apply(this, arguments);

		_create.call(this);
		_init.call(this);
	};
	WaveCanvas.prototype = Object.create(View.prototype);
	WaveCanvas.prototype.constructor = WaveCanvas;

	WaveCanvas.DEFAULT_OPTIONS = {
		visible : false,
		wave : {
			unit : 3,
			speed : 0.2,
			strength : 60
		}
	};

	var _createCanvasSurface = function() {
		this.canvasSurface = new CanvasSurface({
			size : [this.options.size[0]+40, WaveCanvas.DEFAULT_OPTIONS.wave.unit*2],
			classes : ['wave-canvas']
		});

    	this.canvasModifier = new Modifier({
        	transform : Transform.translate(0, WaveCanvas.DEFAULT_OPTIONS.wave.unit)
    	});
	};

	var Wave = function (options) {
		this.unit = options.unit;
		this.speed = options.speed;
		this.strength = options.strength;
	};

	var _initCanvas = function() {

		//create wave with default options
		this.wave = new Wave(WaveCanvas.DEFAULT_OPTIONS.wave);

		this.context = this.canvasSurface.getContext("2d");
    	this.context.font = '18px sans-serif';
    	this.context.strokeStyle = '#000';
    	this.context.lineJoin = 'round';
    	this.xAxis = WaveCanvas.DEFAULT_OPTIONS.wave.unit;
    	this.yAxis = 0;
    	this.context.save();
    	this.seconds = 0;
		this.t = 0;
		
		this.height = this.canvasSurface._canvasSize[1];
		this.width = this.canvasSurface._canvasSize[0];
		this.context.save();
	};

	WaveCanvas.prototype.draw = function () {
		this.context = this.canvasSurface.getContext("2d");
    	this.context.clearRect(0, 0, this.width, this.height);
    
    	// Set styles for animated graphics
    	this.context.save();
  
  		//draw sine wave
    	drawSine.call(this);
    	this.context.restore();

    	//change t for next wave
    	this.seconds = this.seconds - this.wave.speed;
    	this.t = this.seconds*Math.PI;
	};

	var drawSine = function() {
		//set style for waves
		this.context.strokeStyle = '#fff';
    	this.context.fillStyle = '#fff';
    	this.context.lineWidth = 1;

    	//begin path
    	this.context.beginPath();
    	var x = this.t;
    	var y = Math.sin(x);
    	this.context.moveTo(this.yAxis, this.wave.unit*y+this.xAxis);
    	var initialPoint = this.wave.unit*y+this.xAxis;
    	for (i = this.yAxis; i <= this.width; i += this.wave.strength) {
        	x = this.t+(-this.yAxis+i)/this.wave.unit;
        	y = Math.sin(x);
        	this.context.lineTo(i, this.wave.unit*y+this.xAxis);
    	}
    	//draw
    	this.context.stroke();
	};

	var _create = function() {
		_createCanvasSurface.call(this);
	};

	var _init = function() {

		_initCanvas.call(this);
		this.add(this.canvasModifier).add(this.canvasSurface);
		this.show();
	};

	WaveCanvas.prototype.show = function() {
		this.visible = true;
	};

	WaveCanvas.prototype.hide = function() {
		this.visible = false;
	};

	WaveCanvas.prototype.render = function() {
		return this.visible ? this._node.render() : undefined;
	};

	module.exports = WaveCanvas;

});
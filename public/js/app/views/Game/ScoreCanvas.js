define(function(require, exports, module) {

	var View = require('famous/core/View');
	var CanvasSurface = require('famous/surfaces/CanvasSurface');
	var Modifier = require("famous/core/Modifier");
	var Transform = require("famous/core/Transform");

	var Timer = require("famous/utilities/Timer");

	var ScoreCanvas = function() {
		View.apply(this, arguments);

		_create.call(this);
		_init.call(this);
	};
	ScoreCanvas.prototype = Object.create(View.prototype);
	ScoreCanvas.prototype.constructor = ScoreCanvas;

	ScoreCanvas.DEFAULT_OPTIONS = {
		visible : false
	};

	var _createCanvasSurface = function() {
		this.canvasSurface = new CanvasSurface({
			size : [100, 24],
			classes : ['score-canvas']
		});

    	this.canvasModifier = new Modifier({
        	transform : Transform.translate(0, 0)
    	});
	};

	var _initCanvas = function() {

		this.context = this.canvasSurface.getContext("2d");
    	this.context.font = '18px sans-serif';
    	this.context.strokeStyle = '#000';
    	this.context.lineJoin = 'round';
    	
    	this.context.save();
    	
		this.height = this.canvasSurface._canvasSize[1];
		this.width = this.canvasSurface._canvasSize[0];
		this.context.save();
	};

	ScoreCanvas.prototype.draw = function (score) {
		this.context = this.canvasSurface.getContext("2d");
    	this.context.clearRect(0, 0, this.width, this.height);
  		//draw sine wave
    	drawScore.call(this, score);
	};

	var drawScore = function(score) {
		var text = this.context.measureText(score);
    	this.context.font = "24px serif";
  		this.context.fillText(score, this.width/2 - text.width/2, 20);
	};

	var _create = function() {
		_createCanvasSurface.call(this);
	};

	var _init = function() {

		_initCanvas.call(this);
		this.add(this.canvasModifier).add(this.canvasSurface);
		this.show();
	};

	ScoreCanvas.prototype.show = function() {
		this.visible = true;
	};

	ScoreCanvas.prototype.hide = function() {
		this.visible = false;
	};

	ScoreCanvas.prototype.render = function() {
		return this.visible ? this._node.render() : undefined;
	};

	module.exports = ScoreCanvas;

});
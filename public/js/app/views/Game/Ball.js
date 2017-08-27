define(function(require, exports, module) {
	var View = require('famous/core/View');
	var Surface = require('famous/core/Surface');
	var Modifier = require("famous/core/Modifier");
	var StateModifier = require("famous/modifiers/StateModifier");
	var Transform = require("famous/core/Transform");
	var Circle = require("famous/physics/bodies/Circle");

	var Timer = require("famous/utilities/Timer");

	var PhysicsEngineFactory = require("app/helpers/PhysicsEngineFactory");
	var GameUtil = require("app/helpers/GameUtil");

	var Ball = function() {
		View.apply(this, arguments);

		_create.call(this);
		_init.call(this);
	};
	Ball.prototype = Object.create(View.prototype);
	Ball.prototype.constructor = Ball;

	Ball.DEFAULT_OPTIONS = {
		visible : false,
		radius : 10
	};

    var _createBallParticle = function() {
    	//Create a physical particle
        this.particle = new Circle({
        	mass : 1,
        	radius : this.radius,
            position : [this.radius/2,this.radius/2,0]
        });

    	this.physicsEngine.addBody(this.particle);
    };

	var _createBall = function() {
		var ball = this;
		this.modifier = new Modifier({
    		origin : [0, 0],
    		align : [0, 0],
    		transform : function() {
    			return ball.particle.getTransform();
    		}
    	});

		console.log(this.options.color);
		this.surface = new Surface({
			size : [2*this.radius, 2*this.radius],
			classes : ['ball'],
			properties : {
				borderRadius : '100%',
				background : this.options.color
			}
		});
	};

	var _create = function() {
		this.physicsEngine = PhysicsEngineFactory.getEngine();

		this.radius = this.options.radius;

		_createBallParticle.call(this);
		_createBall.call(this);
	};

	var _init = function() {
		this.add(this.modifier).add(this.surface);
		this.show();
	};

	Ball.prototype.getPosition = function() {
		return this.modifier.getTransform(); 
	};

	Ball.prototype.show = function() {
		this.visible = true;
	};

	Ball.prototype.hide = function() {
		this.visible = false;
	};

	Ball.prototype.render = function() {
		return this.visible ? this._node.render() : undefined;
	};

	module.exports = Ball;

});
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

	var BlockerBall = function() {
		View.apply(this, arguments);

		_create.call(this);
		_init.call(this);
	};
	BlockerBall.prototype = Object.create(View.prototype);
	BlockerBall.prototype.constructor = BlockerBall;

	BlockerBall.DEFAULT_OPTIONS = {
		visible : false,
		radius : 10
	};


    var _createBallParticle = function() {
    	//Create a physical particle
        this.particle = new Circle({
        	mass : 5,
        	radius : this.radius,
            position : [this.radius/2,this.radius/2,0]
        });

    	this.physicsEngine.addBody(this.particle);
    };

	var _createBall = function() {
		var ball = this;
		this.modifier = new Modifier({
    		origin : [0.25, 0.25],
    		align : [0, 0],
    		transform : function() {
    			return ball.particle.getTransform();
    		}
    	});

		this.surface = new Surface({
			size : [2*this.radius, 2*this.radius],
			properties : {
				borderRadius : '100%',
				background : GameUtil.getRandomColor() || 'rgb(201, 242, 75)'
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

	BlockerBall.prototype.getPosition = function() {
		return this.modifier.getTransform(); 
	};

	BlockerBall.prototype.show = function() {
		this.visible = true;
	};

	BlockerBall.prototype.hide = function() {
		this.visible = false;
	};

	BlockerBall.prototype.render = function() {
		return this.visible ? this._node.render() : undefined;
	};

	module.exports = BlockerBall;

});
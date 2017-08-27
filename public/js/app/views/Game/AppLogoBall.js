define(function(require, exports, module) {
	var View = require('famous/core/View');
	var Surface = require('famous/core/Surface');
	var Modifier = require("famous/core/Modifier");
	var StateModifier = require("famous/modifiers/StateModifier");
	var Transform = require("famous/core/Transform");
	var Circle = require("famous/physics/bodies/Circle");
	var Timer = require("famous/utilities/Timer");
	var PhysicsEngineFactory = require("app/helpers/PhysicsEngineFactory");
	var Transitionable = require("famous/transitions/Transitionable");
	var SnapTransition = require("famous/transitions/SnapTransition");
	var GameUtil = require("app/helpers/GameUtil");

	Transitionable.registerMethod("wall", SnapTransition);


	var AppLogoBall = function() {
		View.apply(this, arguments);

		_create.call(this);
		_init.call(this);
	};
	AppLogoBall.prototype = Object.create(View.prototype);
	AppLogoBall.prototype.constructor = AppLogoBall;

	AppLogoBall.DEFAULT_OPTIONS = {
		visible : false,
		radius : 45,
		transition : {
        	method: 'wall',
        	period: 350,
        	dampingRatio : 0.1,
        	velocity: 0,
        	restitution : .5
    	}
	};

	var _createBall = function() {
		var ball = this;

		this.scale = this.radius/100;

		this.modifier = new Modifier({
    		origin : [0, 0],
    		align : [0, 0],
    		transform : Transform.scale(this.scale/this.radius, this.scale/this.radius, 1),
    		opacity : 0.8
    	});

		this.surface = new Surface({
			content : "Bach ke",
			size : [2*this.radius, 2*this.radius],
			properties : {
				borderRadius : '100%',
				background : this.options.color[0] || '#27AE60',
				textAlign : 'center',
				color : this.options.color[1] || 'yellow',
				lineHeight : 2*this.radius+'px',
				fontSize : '0.6em',
				zIndex : 0
			}
		});

		this.surface.pipe(this._eventOutput);
	};

	var _createBallParticle = function() {
    	//Create a physical particle
        this.particle = new Circle({
        	mass : 10,
        	radius : this.radius,
            position : [this.radius/2,this.radius/2,0]
        });

    	this.physicsEngine.addBody(this.particle);

    	var optionBall = this;
    	this.particleModifier = new Modifier({
    		transform : function() {
    			return optionBall.particle.getTransform();
    		}
    	});
		var randomX = GameUtil.getRandomInt(0, (8*this.radius));
    	var randomY = GameUtil.getRandomInt(6*this.radius, (10*this.radius));

    	this.particle.setPosition([randomX, randomY, 0]);

    	var randomXVelocity = 0.3;
    	var randomYVelocity = GameUtil.getRandomInt(4,7)/10;

    	this.particle.setVelocity([randomXVelocity, randomYVelocity, 0]);
    };

	var _create = function() {
		this.physicsEngine = PhysicsEngineFactory.getEngine();
		
		this.radius = this.options.radius ? this.options.radius : AppLogoBall.DEFAULT_OPTIONS.radius;
		_createBallParticle.call(this);
		_createBall.call(this);
	};

	var _init = function() {
		this.add(this.modifier).add(this.particleModifier).add(this.surface);
		this.show();
	};

	AppLogoBall.prototype.show = function() {
		this.modifier.setTransform(Transform.scale(1, 1, 1), AppLogoBall.DEFAULT_OPTIONS.transition);
		this.visible = true;
	};

	AppLogoBall.prototype.hide = function() {
		this.modifier.setTransform(Transform.translate(800, 0, 0), AppLogoBall.DEFAULT_OPTIONS.transition);
		setTimeout(function() {
        	 this.visible = false;
        }, 350);
	};

	AppLogoBall.prototype.render = function() {
		return this.visible ? this._node.render() : undefined;
	};

	module.exports = AppLogoBall;

});
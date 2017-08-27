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


	var OptionBall = function() {
		View.apply(this, arguments);

		_create.call(this);
		_init.call(this);
	};
	OptionBall.prototype = Object.create(View.prototype);
	OptionBall.prototype.constructor = OptionBall;

	OptionBall.DEFAULT_OPTIONS = {
		visible : false,
		radius : 80,
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

		var content = this.options.title
		this.surface = new Surface({
			content : content,
			size : [2*this.radius, 2*this.radius],
			properties : {
				borderRadius : '100%',
				background : this.options.color[0] || '#27AE60',
				textAlign : 'center',
				color : this.options.color[1] || 'yellow',
				lineHeight : 2*this.radius+'px',
				fontSize : '0.6em',
				zIndex : 9999
			}
		});

		this.surface.pipe(this._eventOutput);
	};

	var _createBallParticle = function() {
    	//Create a physical particle
        this.particle = new Circle({
        	mass : 1,
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
		var randomX = GameUtil.getRandomInt(0, (4*this.radius));
    	var randomY = GameUtil.getRandomInt(0, (4*this.radius));

    	this.particle.setPosition([randomX, randomY, 0]);

    	var randomXVelocity = GameUtil.getRandomInt(-5,5)/10;
    	var randomYVelocity = GameUtil.getRandomInt(-4,4)/10;

    	this.particle.setVelocity([randomXVelocity, randomYVelocity, 0]);
    };

	var _create = function() {
		this.physicsEngine = PhysicsEngineFactory.getEngine();
		
		this.radius = this.options.radius ? this.options.radius : OptionBall.DEFAULT_OPTIONS.radius;
		_createBallParticle.call(this);
		_createBall.call(this);
	};

	var _init = function() {
		this.add(this.modifier).add(this.particleModifier).add(this.surface);
		this.show();
	};

	OptionBall.prototype.show = function() {
		this.modifier.setTransform(Transform.scale(1, 1, 1), OptionBall.DEFAULT_OPTIONS.transition);
		this.visible = true;
	};

	OptionBall.prototype.hide = function() {
		this.modifier.setTransform(Transform.translate(800, 0, 0), OptionBall.DEFAULT_OPTIONS.transition);
		setTimeout(function() {
        	 this.visible = false;
        }, 350);
	};

	OptionBall.prototype.render = function() {
		return this.visible ? this._node.render() : undefined;
	};

	module.exports = OptionBall;

});
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
	var WallTransition = require("famous/transitions/WallTransition");

	Transitionable.registerMethod("wall", WallTransition);


	var RandomBall = function() {
		View.apply(this, arguments);

		_create.call(this);
		_init.call(this);
	};
	RandomBall.prototype = Object.create(View.prototype);
	RandomBall.prototype.constructor = RandomBall;

	RandomBall.DEFAULT_OPTIONS = {
		visible : false,
		radius : 10,
		transition : {
        	method: 'wall',
        	period: 600,
        	dampingRatio : 0.8,
        	velocity: 0,
        	restitution : .1
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

		var content = this.options.content
		this.surface = new Surface({
			content : content,
			size : [2*this.radius, 2*this.radius],
			properties : {
				borderRadius : '100%',
				background : this.options.color[0] || '#27AE60',
				textAlign : 'center',
				color : this.options.color[1] || 'yellow',
				lineHeight : 2*this.radius+'px',
				fontSize : '0.4em'
			}
		});
	};

	var _createBallParticle = function() {
    	//Create a physical particle
        this.particle = new Circle({
        	mass : 1,
        	radius : this.radius,
            position : [this.radius/2,this.radius/2,0]
        });

    	this.physicsEngine.addBody(this.particle);

    	var randomBall = this;
    	this.particleModifier = new Modifier({
    		transform : function() {
    			return randomBall.particle.getTransform();
    		}
    	});
    };

	var _create = function() {
		this.physicsEngine = PhysicsEngineFactory.getEngine();

		this.radius = this.options.radius ? this.options.radius : RandomBall.DEFAULT_OPTIONS.radius;
		_createBallParticle.call(this);
		_createBall.call(this);
	};

	var _init = function() {
		this.add(this.modifier).add(this.particleModifier).add(this.surface);
		this.show();
	};

	RandomBall.prototype.show = function() {
		this.modifier.setTransform(Transform.scale(1, 1, 1), RandomBall.DEFAULT_OPTIONS.transition);
		this.visible = true;
	};

	RandomBall.prototype.hide = function() {
		this.modifier.setTransform(Transform.translate(-1000, 0, 0), RandomBall.DEFAULT_OPTIONS.transition);
		setTimeout(function() {
        	 this.visible = false;
        }, 800);
	};

	RandomBall.prototype.render = function() {
		return this.visible ? this._node.render() : undefined;
	};

	module.exports = RandomBall;

});
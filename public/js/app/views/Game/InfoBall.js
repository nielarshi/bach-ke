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

	Transitionable.registerMethod("wall", SnapTransition);


	var InfoBall = function() {
		View.apply(this, arguments);

		_create.call(this);
		_init.call(this);
	};
	InfoBall.prototype = Object.create(View.prototype);
	InfoBall.prototype.constructor = InfoBall;

	InfoBall.DEFAULT_OPTIONS = {
		visible : false,
		radius : 80,
		transition : {
        	method: 'wall',
        	period: 800,
        	dampingRatio : 0.5,
        	velocity: 0,
        	restitution : .2
    	}
	};

	var _createBall = function() {
		var ball = this;

		this.scale = this.radius/100;

		this.modifier = new Modifier({
    		origin : [0, 0],
    		align : [0, 0],
    		transform : Transform.scale(this.scale/this.radius, this.scale/this.radius, 1),
    		opacity : 0.9
    	});

		var content = "<div class='info-header'>How to play</div>"+
						"<hr>"+
						"<p class='info-body'>Avoid the ball to touch the wave to be in the game. Every touch generates a ball at touched position, which can be used to deflect the ball. Screen edges on the left, top and right deflects ball on collision.</p>";
		this.surface = new Surface({
			content : content,
			size : [2*this.radius, 2*this.radius],
			properties : {
				borderRadius : '100%',
				background : '#26739c',
				textAlign : 'center',
				padding : '10px',
				color : 'yellow'
			}
		});


	};

	var _createBallParticle = function() {
    	//Create a physical particle
        this.particle = new Circle({
        	mass : 5,
        	radius : this.radius,
            position : [this.radius/2,this.radius/2,0]
        });

    	this.physicsEngine.addBody(this.particle);

    	var infoBall = this;
    	this.particleModifier = new Modifier({
    		transform : function() {
    			return infoBall.particle.getTransform();
    		}
    	});

    	this.particle.setVelocity([-0.4, 0.1, 0]);
    };

	var _create = function() {
		this.physicsEngine = PhysicsEngineFactory.getEngine();

		this.radius = this.options.radius ? this.options.radius : InfoBall.DEFAULT_OPTIONS.radius;
		_createBallParticle.call(this);
		_createBall.call(this);
	};

	var _init = function() {
		this.add(this.modifier).add(this.particleModifier).add(this.surface);
		this.show();
	};

	InfoBall.prototype.show = function() {
		this.modifier.setTransform(Transform.scale(1, 1, 1), InfoBall.DEFAULT_OPTIONS.transition);
		this.visible = true;
	};

	InfoBall.prototype.hide = function(callback) {
		this.modifier.setTransform(Transform.translate(600, 0, 0), InfoBall.DEFAULT_OPTIONS.transition);
		var infoBall = this;
		setTimeout(function() {
			if(callback) callback();
        	infoBall.visible = false;
        }, 800);
	};

	InfoBall.prototype.render = function() {
		return this.visible ? this._node.render() : undefined;
	};

	module.exports = InfoBall;

});
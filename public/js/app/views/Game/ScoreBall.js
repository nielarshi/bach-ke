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


	var ScoreBall = function() {
		View.apply(this, arguments);

		_create.call(this);
		_init.call(this);
	};
	ScoreBall.prototype = Object.create(View.prototype);
	ScoreBall.prototype.constructor = ScoreBall;

	ScoreBall.DEFAULT_OPTIONS = {
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

		var content = "<div class='score-header'>Your Score</div>"+
						"<hr>"+
						"<p class='score-body'>Your score is </p><p>"+this.options.score+"</p>";
		this.surface = new Surface({
			content : content,
			size : [2*this.radius, 2*this.radius],
			properties : {
				borderRadius : '100%',
				background : this.options.color[0] || '#26739c',
				textAlign : 'center',
				padding : '10px',
				color : this.options.color[1] || 'yellow'
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

    	var infoBall = this;
    	this.particleModifier = new Modifier({
    		transform : function() {
    			return infoBall.particle.getTransform();
    		}
    	});

    	this.particle.setPosition([this.options.size[0] - this.radius/2, this.options.size[1] - (this.radius*4/3), 0]);
    };

	var _create = function() {
		this.physicsEngine = PhysicsEngineFactory.getEngine();

		this.radius = this.options.radius ? this.options.radius : ScoreBall.DEFAULT_OPTIONS.radius;
		_createBallParticle.call(this);
		_createBall.call(this);
	};

	var _init = function() {
		this.add(this.modifier).add(this.particleModifier).add(this.surface);
		this.show();
	};

	ScoreBall.prototype.show = function() {
		this.modifier.setTransform(Transform.scale(1, 1, 1), ScoreBall.DEFAULT_OPTIONS.transition);
		this.visible = true;
	};

	ScoreBall.prototype.hide = function(callback) {
		this.modifier.setTransform(Transform.translate(600, 0, 0), ScoreBall.DEFAULT_OPTIONS.transition);
		var infoBall = this;
		setTimeout(function() {
			if(callback) callback();
        	infoBall.visible = false;
        }, 800);
	};

	ScoreBall.prototype.render = function() {
		return this.visible ? this._node.render() : undefined;
	};

	module.exports = ScoreBall;

});
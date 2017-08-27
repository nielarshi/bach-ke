define(function(require, exports, module) {

	var View = require("famous/core/View");
	var Wall = require("famous/physics/constraints/Wall");
	var PhysicsEngine = require("famous/physics/PhysicsEngine");
	var EventHandler = require("famous/core/EventHandler");
	var OptionBall = require("app/views/Game/OptionBall");
	var PhysicsEngineFactory = require("app/helpers/PhysicsEngineFactory");
	var GameUtil = require("app/helpers/GameUtil");
	var RandomBall = require("app/views/Game/RandomBall");
	var ScoreService = require("app/helpers/ScoreService");
	
	var HistoryPanel = function() {
		View.apply(this, arguments);

		_create.call(this);
		_init.call(this);
	};
	HistoryPanel.prototype = Object.create(View.prototype);
	HistoryPanel.prototype.constructor = HistoryPanel;

	var setWalls = function(particle, size) {
        
        var leftWall    = new Wall({normal : [1,0,0],  distance : size, restitution : 0});
        var rightWall   = new Wall({normal : [-1,0,0], distance : this.options.size[0]-(size), restitution : 0});
        var topWall     = new Wall({normal : [0,1,0],  distance : size, restitution : 1, restitution : 0});
        var bottomWall  = new Wall({normal : [0,-1,0], distance : this.options.size[1]-(size), restitution : 0.1});

        this.physicsEngine.attach(leftWall, [particle]);
        this.physicsEngine.attach(rightWall, [particle]);
        this.physicsEngine.attach(topWall, [particle]);
        this.physicsEngine.attach(bottomWall, [particle]);

    };

	var _createHomeBall = function() {
		this.homeBall = new OptionBall({
			title : "Go Home",
			radius : 80,
			color : GameUtil.getComplimentaryColors()
		});

		this.add(this.homeBall);
		setWalls.call(this, this.homeBall.particle, this.homeBall.radius);

		var historyPanel = this;
		this.homeBall.on('click', function() {
			historyPanel.eventOutput.emit('home.clicked');
		});
	};

	
	var _createRandomBall = function(content, radius, colors) {

    	var randomBall = new RandomBall({
    		content : content,
    		radius : radius,
    		color : colors
    	});
    	var randomX = GameUtil.getRandomInt(0, this.options.size[0]-(2*randomBall.radius));
    	var randomY = GameUtil.getRandomInt(0, this.options.size[1]-(2*randomBall.radius));
    	randomBall.particle.setPosition([randomX, randomY, 0]);

    	var randomXVelocity = GameUtil.getRandomInt(-5,5)/10;
    	var randomYVelocity = GameUtil.getRandomInt(-4,4)/10;
    	randomBall.particle.setVelocity([randomXVelocity, randomYVelocity, 0]);

    	setWalls.call(this, randomBall.particle, randomBall.radius);
    	this.add(randomBall);

    	this.randomBalls.push(randomBall);

    };

    var _createRandomBalls = function() {

        this.randomBalls = [];

        var scores = ScoreService.getScore();
        var noOfBalls = scores.length;
    	for(var i = 0; i < noOfBalls; i++) {
    		_createRandomBall.call(this, scores[i].score, GameUtil.getRandomInt(15, 30), GameUtil.getComplimentaryColors());
    	}
    };

	var _create = function() {

		this.eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this.eventOutput);

		this.physicsEngine = PhysicsEngineFactory.getEngine();

		_createRandomBalls.call(this);
		
		_createHomeBall.call(this);
		
	};

	var _init = function() {
		this.show();
	};

	HistoryPanel.prototype.show = function() {
		this.visible = true;
	};

	HistoryPanel.prototype.hide = function() {
		this.visible = false;
	};

	HistoryPanel.prototype.render = function() {
		return this.visible ? this._node.render() : undefined;
	};

	module.exports = HistoryPanel;

});
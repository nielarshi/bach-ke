define(function(require, exports, module) {

	var View = require("famous/core/View");
	var Wall = require("famous/physics/constraints/Wall");
	var PhysicsEngine = require("famous/physics/PhysicsEngine");
	var EventHandler = require("famous/core/EventHandler");
	var OptionBall = require("app/views/Game/OptionBall");
	var PhysicsEngineFactory = require("app/helpers/PhysicsEngineFactory");
	var GameUtil = require("app/helpers/GameUtil");
	var RandomBall = require("app/views/Game/RandomBall");
	var ScoreBall = require("app/views/Game/ScoreBall");


	var ScorePanel = function() {
		View.apply(this, arguments);

		_create.call(this);
		_init.call(this);
	};
	ScorePanel.prototype = Object.create(View.prototype);
	ScorePanel.prototype.constructor = ScorePanel;

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

	var _createScoreBall = function() {
		this.scoreBall = new ScoreBall({
			title : "Score",
			radius : 280,
			color : GameUtil.getComplimentaryColors(),
			size : this.options.size,
			score : this.options.score
		});

		this.add(this.scoreBall);
		setWalls.call(this, this.scoreBall.particle, this.scoreBall.radius);

	};

	var _createHistoryBall = function() {
		this.historyBall = new OptionBall({
			title : "History",
			radius : 50,
			color : GameUtil.getComplimentaryColors()
		});

		this.add(this.historyBall);
		setWalls.call(this, this.historyBall.particle, this.historyBall.radius);

		var scorePanel = this;
		this.historyBall.on('click', function() {
			scorePanel.eventOutput.emit('history.clicked');
		});
	};

	var _createReloadBall = function() {
		this.reloadBall = new OptionBall({
			title : "Reload",
			radius : 60,
			color : GameUtil.getComplimentaryColors()
		});

		this.add(this.reloadBall);
		setWalls.call(this, this.reloadBall.particle, this.reloadBall.radius);

		var scorePanel = this;
		this.reloadBall.on('click', function() {
			scorePanel.eventOutput.emit('game.reload');
		});
	};

	var _createHomeBall = function() {
		this.homeBall = new OptionBall({
			title : "Home",
			radius : 40,
			color : GameUtil.getComplimentaryColors()
		});

		this.add(this.homeBall);
		setWalls.call(this, this.homeBall.particle, this.homeBall.radius);

		var scorePanel = this;
		this.homeBall.on('click', function() {
			scorePanel.eventOutput.emit('home.clicked');
		});
	};

	
	var _createRandomBall = function(radius, color) {

    	var randomBall = new RandomBall({
    		radius : radius,
    		color : color
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
    	for(var i = 0; i < 10; i++) {
    		_createRandomBall.call(this, GameUtil.getRandomInt(4, 25), GameUtil.getComplimentaryColors());
    	}
    };

	var _create = function() {
		
		this.eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this.eventOutput);

		this.physicsEngine = PhysicsEngineFactory.getEngine();

		_createRandomBalls.call(this);
		_createScoreBall.call(this);
		_createHomeBall.call(this);
		_createReloadBall.call(this);
		_createHistoryBall.call(this);
		
	};

	var _init = function() {
		this.show();
	};

	ScorePanel.prototype.show = function() {
		this.visible = true;
	};

	ScorePanel.prototype.hide = function() {
		this.visible = false;
	};

	ScorePanel.prototype.render = function() {
		return this.visible ? this._node.render() : undefined;
	};

	module.exports = ScorePanel;

});
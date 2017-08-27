define(function(require, exports, module) {
	var View = require("famous/core/View");
	var InfoBall = require("app/views/Game/InfoBall");
    var OptionBall = require("app/views/Game/OptionBall");
    var RandomBall = require("app/views/Game/RandomBall");
    var PhysicsEngineFactory = require("app/helpers/PhysicsEngineFactory");
    var Wall = require("famous/physics/constraints/Wall");
    var Force = require("famous/physics/forces/Force");
    var EventHandler = require("famous/core/EventHandler");
    var GameUtil = require("app/helpers/GameUtil");
    var AppLogoBall = require("app/views/Game/AppLogoBall");
    var GameSounds = require("app/audio/GameSounds");


	var StartPanel = function() {
		View.apply(this, arguments);

		_create.call(this);
		_init.call(this);
	};

	StartPanel.prototype = Object.create(View.prototype);
	StartPanel.prototype.constructor = StartPanel;


    var setWalls = function(particle, size) {
        
        var leftWall    = new Wall({normal : [1,0,0],  distance : size, restitution : 0});
        var rightWall   = new Wall({normal : [-1,0,0], distance : this.options.size[0]-(size), restitution : 0});
        var topWall     = new Wall({normal : [0,1,0],  distance : size, restitution : 1, restitution : 0});
        var bottomWall  = new Wall({normal : [0,-1,0], distance : this.options.size[1]-(size), restitution : 0.1});

        this.physicsEngine.attach(leftWall, [particle]);
        this.physicsEngine.attach(rightWall, [particle]);
        this.physicsEngine.attach(topWall, [particle]);
        this.physicsEngine.attach(bottomWall, [particle]);

    }

    var _createHistoryBall = function() {
        this.historyBall = new OptionBall({
            title : "History",
            radius : 50,
            color : GameUtil.getComplimentaryColors()
        });

        this.add(this.historyBall);
        setWalls.call(this, this.historyBall.particle, this.historyBall.radius);

        var startPanel = this;
        this.historyBall.on('click', function() {
            startPanel.historyBall.hide();
            startPanel.eventOutput.emit('history.clicked');
        });
    };

	var _createInfoBall = function() {
    	var radius = (this.options.size[0] < this.options.size[1]) ? this.options.size[0]/2 - 15 : this.options.size[1]/2 - 15;
    	this.infoBall = new InfoBall({
    		radius : radius
    	});

    	this.add(this.infoBall);
    	setWalls.call(this, this.infoBall.particle, this.infoBall.radius);

    };

    var _createStartOptionBall = function() {
    	var radius = (this.options.size[0] < this.options.size[1]) ? this.options.size[0]/5 - 15 : this.options.size[1]/5 - 15;
    	this.startBall = new OptionBall({
    		title : "Start",
            color : GameUtil.getComplimentaryColors(),
    		radius : radius
    	});
    	this.startBall.particle.setPosition([(this.infoBall.radius*2 + this.startBall.radius), this.startBall.radius, 0]);
    	this.add(this.startBall);

		setWalls.call(this, this.startBall.particle, this.startBall.radius);
		this.gravity.applyForce([this.startBall.particle]);

		var startPanel = this;

    	this.startBall.on('click', function() {
			startPanel.eventOutput.emit('start.clicked');
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
    	for(var i = 0; i < 40; i++) {
    		_createRandomBall.call(this, GameUtil.getRandomInt(4, 25), GameUtil.getComplimentaryColors());
    	}
    };

	var _createPanel = function() {
		this.eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this.eventOutput);

		this.physicsEngine = PhysicsEngineFactory.getEngine();
		this.gravity = new Force([0, 0.015, 0]);
		_createRandomBalls.call(this);
		_createInfoBall.call(this);
        _createHistoryBall.call(this);
		_createStartOptionBall.call(this);
        //_createAppLogo.call(this);
	};

    var _createAppLogo = function() {
        this.appLogo = new AppLogoBall({
            color : GameUtil.getComplimentaryColors()
        });

        this.add(this.appLogo);
        setWalls.call(this, this.appLogo.particle, this.appLogo.radius);
    };


	var _create = function() {
        
		_createPanel.call(this);

	};

	var _init = function() {
		this.show();
	};

	StartPanel.prototype.show = function() {
		this.visible = true;
	};

	StartPanel.prototype.hide = function() {
		var startPanel = this;
		this.startBall.hide();
		
		this.randomBalls.forEach(function(randomBall) {
			randomBall.hide();
		});

		this.infoBall.hide(function() {
			startPanel.visible = false;
		});
	};

	StartPanel.prototype.render = function() {
		return this.visible ? this._node.render() : undefined;
	};


	module.exports = StartPanel;
});
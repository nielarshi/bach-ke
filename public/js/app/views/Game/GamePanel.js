define(function(require, exports, module) {

	var View = require("famous/core/View");
	var Surface = require("famous/core/Surface");
	var Modifier = require("famous/core/Modifier");
	var StateModifier = require("famous/modifiers/StateModifier");
	var Transform = require("famous/core/Transform");
	var Vector = require("famous/math/Vector");
	
    var WaveCanvas = require("app/views/Game/WaveCanvas");
    var ScoreCanvas = require("app/views/Game/ScoreCanvas");
    var Ball = require("app/views/Game/Ball");
    var BlockerBall = require("app/views/Game/BlockerBall");
    
    var PhysicsEngineFactory = require("app/helpers/PhysicsEngineFactory");
    var Wall = require("famous/physics/constraints/Wall");
    var TouchSync = require("famous/inputs/TouchSync");
    var Force = require("famous/physics/forces/Force");

    var Collision = require("famous/physics/constraints/Collision");
    var Timer = require("famous/utilities/Timer");
    var EventHandler = require("famous/core/EventHandler");
    var ScoreCalculator = require("app/helpers/ScoreCalculator");
    var ScoreService = require("app/helpers/ScoreService");
    var GameUtil = require("app/helpers/GameUtil");
    var GameSounds = require("app/audio/GameSounds");

	var GamePanel = function() {
		View.apply(this, arguments);

		_create.call(this);
		_init.call(this);
	};

	GamePanel.prototype = Object.create(View.prototype);
	GamePanel.prototype.constructor = GamePanel;

	var _createWaveCanvas = function() {
        
        this.waveModifier = new StateModifier({
            origin : [0, 0],
            align : [0, 0],
            transform: Transform.translate(0, this.options.size[1]-40)
        });

        this.waveCanvas = new WaveCanvas({
            size : this.options.size,
        });
    };

    var _createScoreCanvas = function() {
        
        this.scoreModifier = new StateModifier({
            origin : [0, 0],
            align : [0, 0],
            transform: Transform.translate(this.options.size[0] - 100, 20)
        });

        this.scoreCanvas = new ScoreCanvas({
            size : this.options.size,
        });
    };

    var _createResult = function() {

    };

    var _createBall = function() {
    	
    	this.ball = new Ball({
    		radius : 20,
        color : GameUtil.getDarkRandomColor()
    	});

    	this.ball.particle.setPosition([GameUtil.getRandomInt(2*this.ball.radius, this.options.size[0] - 2*this.ball.radius), 10, 0]);
    	
    	setWallsForBall.call(this, this.ball.particle, this.ball.radius);

    	this.gravity.applyForce([this.ball.particle]);
    };


    var setWallsForBall = function(particle, size) {
        
        var leftWall    = new Wall({normal : [1,0,0],  distance : size, restitution : 1, restitution : 1});
        var rightWall   = new Wall({normal : [-1,0,0], distance : this.options.size[0]-size, restitution : 1});
        var topWall     = new Wall({normal : [0,1,0],  distance : size, restitution : 1, restitution : 1});
        var bottomWall  = new Wall({normal : [0,-1,0], distance : this.options.size[1]-size-35});

        this.physicsEngine.attach(leftWall, [particle]);
        this.physicsEngine.attach(rightWall, [particle]);
        this.physicsEngine.attach(topWall, [particle]);
        var bottomWallAttachId = this.physicsEngine.attach(bottomWall, [particle]);

        var gamePanel = this;
        bottomWall.on('collision', function() {
        	console.log('collided');
        	(function(bottomWallAttachId) {

            //game ends

            gamePanel.score.endsAt = ScoreService.getTime() - gamePanel.score.startAt;
            gamePanel.score.value = ScoreCalculator.getScore(gamePanel.score.hit, gamePanel.score.endsAt);
            
        		gamePanel.physicsEngine.detach(bottomWallAttachId);
        		gamePanel.physicsEngine.removeBody(gamePanel.ball.particle);

        		gamePanel.eventOutput.emit('game.over', gamePanel.score.value);

            ScoreService.setScore(gamePanel.score);

        	})(bottomWallAttachId);
        });

        leftWall.on('collision', function() {
          (function() {
            GameSounds().playSound(1, 0.2);
            gamePanel.score.hit++;
            gamePanel.score.break++;

            if(gamePanel.score.break > 8) {
              gamePanel.ball.particle.setVelocity([0.1, 0.1, 0]);
            }
          })();
        });

        rightWall.on('collision', function() {
          (function() {
            GameSounds().playSound(1, 0.2);
            gamePanel.score.hit++;
            gamePanel.score.break++;

            if(gamePanel.score.break > 8) {
              gamePanel.ball.particle.setVelocity([-0.1, 0.1, 0]);
            }
          })();
        });

        topWall.on('collision', function() {
          (function() {
            GameSounds().playSound(1, 0.2);
            gamePanel.score.hit++;
            gamePanel.score.break = 0;
          })();
        });
        
    }

    var setWallsForBlockerBall = function(particle, size) {
        
        var leftWall    = new Wall({normal : [1,0,0],  distance : size/2, restitution : 1});
        var rightWall   = new Wall({normal : [-1,0,0], distance : this.options.size[0]-(size/2), restitution : 1});
        var topWall     = new Wall({normal : [0,1,0],  distance : size/2, restitution : 1, restitution : 1});
        var bottomWall  = new Wall({normal : [0,-1,0], distance : this.options.size[1]-(size/2), restitution : 1});

        this.physicsEngine.attach(leftWall, [particle]);
        this.physicsEngine.attach(rightWall, [particle]);
        this.physicsEngine.attach(topWall, [particle]);
        this.physicsEngine.attach(bottomWall, [particle]);

    }

    var _createTouchEventCapturePanel = function() {
    	this.touchPanelModifier = new Modifier({
			align : [0, 0],
			origin : [0, 0]
		});
		this.touchSurface = new Surface({ 
      size: [1000, 1000]
    });
  		var touchSync = new TouchSync();
  		this.touchSurface.pipe(touchSync);

  		var gamePanel = this;

  		var x1 = 0,
  			y1 = 0,
  			x2 = 0,
  			y2 = 0;

  		touchSync.on('start', function (e) { 
  			x1 = e.clientX;
  			y1 = e.clientY;
  		});

  		touchSync.on('update', function (e) { 

  		});

  		touchSync.on('end', function (e) { 
  			x2 = e.clientX;
  			y2 = e.clientY;
  			_createBlockerBall.call(gamePanel, x1, y1, x2, y2);
  		});

    };

    var _createBlockerBall = function(x1, y1, x2, y2) {
    	
    	if(this.blockerBall) {
    		this.physicsEngine.removeBody(this.blockerBall.particle);
    		this.blockerBall.hide();
    	}

    	this.blockerBall = new BlockerBall({
    		radius : 30
    	});

    	this.blockerBall.particle.setPosition([x2-this.blockerBall.radius/2, y2-this.blockerBall.radius/2, 0]);

    	var blockerBall = this.blockerBall;
    	
    	setWallsForBlockerBall.call(this, this.blockerBall.particle, this.blockerBall.radius);


    	this.add(this.blockerBall);

    	this.physicsEngine.attach(this.collision, this.ball.particle, this.blockerBall.particle);

    };

	var _create = function() {
		this.eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this.eventOutput);

		this.physicsEngine = PhysicsEngineFactory.getEngine();
    	this.collision = new Collision({
    		restitution: 1
    	});
      this.collision.on('collision', function() {
        GameSounds().playSound(1, 0.2);
      });

      if(this.options.size[0] > this.options.size[1]) {
        this.gravity = new Force([0, 0.006, 0]);
      } else {
        this.gravity = new Force([0, 0.01, 0]);
      }
    	

      //initialise score
      this.score = {};
      this.score.hit = 0;
      this.score.startAt = ScoreService.getTime();
      this.score.break = 0;

      //game colors
      this.gameColors = GameUtil.gameColors();

		_createWaveCanvas.call(this);
    _createScoreCanvas.call(this);
		_createBall.call(this);
		
		_createTouchEventCapturePanel.call(this);
	};

	var _init = function() {
		this.add(this.waveModifier).add(this.waveCanvas);
    this.add(this.scoreModifier).add(this.scoreCanvas);
		this.add(this.ball);
		
  		this.add(this.touchPanelModifier).add(this.touchSurface);
  		
  		var gamePanel = this;

  		var waveCanvas = this.waveCanvas;
      var scoreCanvas = this.scoreCanvas;
    	Timer.every(function() {
    		waveCanvas.draw.call(waveCanvas);
        if(gamePanel.score) {
          if(gamePanel.score.hit > 0) {
            scoreCanvas.draw.call(scoreCanvas, Math.ceil((ScoreService.getTime() - gamePanel.score.startAt)*gamePanel.score.hit /  100));
          } else {
            scoreCanvas.draw.call(scoreCanvas, Math.ceil((ScoreService.getTime() - gamePanel.score.startAt)/ 100));
          }
        } 
    	}, 2);

    	this.show();
  };

  GamePanel.prototype.show = function() {
		this.visible = true;
	};

	GamePanel.prototype.hide = function() {
		this.visible = false;
	};

	GamePanel.prototype.render = function() {
		return this.visible ? this._node.render() : undefined;
	};

	module.exports = GamePanel;
});
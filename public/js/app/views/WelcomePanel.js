define(function(require, exports, module) {
	
	var BouncingPanel = require("app/widgets/BouncingPanel");
	var View = require("famous/core/View");
	var Surface = require("famous/core/Surface");
	var Modifier = require("famous/core/Modifier");
    var StateModifier = require("famous/modifiers/StateModifier");
	var Transform = require("famous/core/Transform");
	var RenderNode = require("famous/core/RenderNode");
    var GameSounds = require("app/audio/GameSounds");
    var GamePanel = require("app/views/Game/GamePanel");
    var StartPanel = require("app/views/Game/StartPanel");
    var ScorePanel = require("app/views/Game/ScorePanel");
    var HistoryPanel = require("app/views/Game/HistoryPanel");
    var GameUtil = require("app/helpers/GameUtil");
    var GameSounds = require("app/audio/GameSounds");
    
	var WelcomePanel = function() {
		View.apply(this, arguments);

        _create.call(this);
		_init.call(this);   
	}
	WelcomePanel.prototype = Object.create(View.prototype);
	WelcomePanel.prototype.constructor = WelcomePanel;

    var _createBackgroundPanel = function() {
        //background panel
        this.backgroundPanel = new BouncingPanel({
            size : this.options.size || [],
            classes : ["welcome-panel"]
        });
        this.backgroundPanel.show();
    };

    var _createHeader = function() {
        //header
        this.headerModifier = new StateModifier({
            origin : [0.5, 0],
            align : [0.5, 0]
        });

        this.header = new Surface({
            size : [true, true],
            content : "",
            properties : {
                textAlign : 'center'
            }  
        });
    };

    var _createScorePanel = function(score) {
        this.scorePanelModifier = new Modifier({
            origin : [0, 0],
            align : [0.5, 0.5]
        });

        this.scorePanel = new ScorePanel({
            size : this.options.size,
            score : score
        })

        this.add(this.scorePanelModifier).add(this.scorePanel);

        var welcomePanel = this;
        this.scorePanel.on('home.clicked', function() {
            GameSounds().playSound(0);
            welcomePanel.scorePanel.hide();
            _createStartPanel.call(welcomePanel);
        });

        this.scorePanel.on('game.reload', function() {
            GameSounds().playSound(0);
            welcomePanel.scorePanel.hide();
            _createGamePanel.call(welcomePanel);
        });

        this.scorePanel.on('history.clicked', function() {
            GameSounds().playSound(0);
            welcomePanel.scorePanel.hide();
            _createHistoryPanel.call(welcomePanel);
        });

    };  

    var _createHistoryPanel = function(score) {
        this.historyPanelModifier = new Modifier({
            origin : [0, 0],
            align : [0.5, 0.5]
        });

        this.historyPanel = new HistoryPanel({
            size : this.options.size,
            score : score
        })

        this.add(this.historyPanelModifier).add(this.historyPanel);

        var welcomePanel = this;
        this.historyPanel.on('home.clicked', function() {
            GameSounds().playSound(0);
            welcomePanel.historyPanel.hide();
            _createStartPanel.call(welcomePanel);
        });
    };  

    var _createGamePanel = function() {
        this.gamePanelModifier = new Modifier({
            origin : [0, 0],
            align : [0.5, 0.5]
        });
        this.gamePanel = new GamePanel({
            size : this.options.size
        });

        this.add(this.gamePanelModifier).add(this.gamePanel);
        var welcomePanel = this;
        this.gamePanel.on('game.over', function(score) {
            GameSounds().playSound(0);
            welcomePanel.gamePanel.hide();
            _createScorePanel.call(welcomePanel, score);
        });
    };

    var _createStartPanel = function() {
        this.startPanel = new StartPanel({
            size : this.options.size
        })

        this.add(this.startPanel);

        this.startPanel.pipe(this._eventOutput);
        var welcomePanel = this;
        this.startPanel.on('start.clicked', function() {
            GameSounds().playSound(0);
            if(welcomePanel.startPanel.historyBall) {
                welcomePanel.startPanel.historyBall.hide();
            }
            welcomePanel.startPanel.hide();
            _createGamePanel.call(welcomePanel);
        });

        this.startPanel.on('history.clicked', function() {
            GameSounds().playSound(0);
            welcomePanel.startPanel.hide();
            _createHistoryPanel.call(welcomePanel);
        });
    };

    
    var _create = function() {

        _createBackgroundPanel.call(this);
        _createHeader.call(this);
        _createStartPanel.call(this);
        
        GameSounds().playSound(0);
    };

	var _init = function() {
		
        this.add(this.backgroundPanel);
        this.add(this.headerModifier).add(this.header);
	};

	module.exports = WelcomePanel;

});
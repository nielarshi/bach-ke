define(function(require, exports, module){
	var Engine = require("famous/core/Engine");
	var Modifier = require("famous/core/Modifier");
	var Transform = require("famous/core/Transform");

	var Game = require("app/views/Game");
	var GameSounds = require("app/audio/GameSounds");

	var context = null;

	var modifier = new Modifier({
		size : [500, 300],
		origin : [0, 0]
	});

	function getAppDims(){
        var scaleY = window.innerHeight / 960;
        var scaleX = window.innerWidth / 640;


        //here we are going to let the bottom of the screen be cut off to allow fit to more
        //devices
        var scale = Math.min(scaleX, scaleY * 1.2);
        //var scale = 1;

        var appWidth = 640 * scale;
        var appHeight = 960 * scale;

        return [appWidth, appHeight, scale];
    }

    function _resize(container){
    	console.log('called');
        var appDims = getAppDims();
        container.style.width = appDims[0] + "px";
        container.style.height = appDims[1] + "px";

        modifier.setTransform(Transform.scale(appDims[2], appDims[2], 1));
    }

	var _init = function() {
		var contextContainer = document.getElementById("contextContainer");

		context = Engine.createContext(contextContainer);
		context.setPerspective(300);

		var game = new Game();
		context.add(modifier).add(game);

		var app = this;

		Engine.on("resize", function(){_resize(contextContainer);});
		Engine.on("orientationchange", function(){_resize(contextContainer);});
	};


	GameSounds(function(){
        GameSounds().playSound(0);
    }.bind(this));
    _init.call(this);
});
define(function(require, exports, module) {
	ScoreService = {};

	ScoreService.getTime = function() {
		
		var n = Date.now();
		return n;
	};

	ScoreService.setScore = function(score) {
		//save game data into local storage
        var gameData = JSON.parse(localStorage.getItem("gameData"));
        if(!gameData) {
            gameData = {

            };
        }
        if(!gameData.scores) {
            gameData.scores = [];
        }
        gameData.scores.push({ score : score.value, date : new Date(), hit : score.hit, duration : score.endsAt });
        localStorage.setItem("gameData", JSON.stringify(gameData));
	};

	ScoreService.getScore = function() {
		var gameData = JSON.parse(localStorage.getItem("gameData"));
        if(!gameData) {
            gameData = {
                scores : []
            };
        }
        return gameData.scores;
	};

	module.exports = ScoreService;
});
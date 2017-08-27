define(function(require, exports, module) {
	
	var ScoreCalculator = {};

	ScoreCalculator.getScore = function(hit, time) {
		var score = 0;
		if(hit > 0) {
			score = Math.ceil(time * hit / 100);
		} else {
			score = Math.ceil(time / 100);
		}
		return score;
	};
	
	module.exports = ScoreCalculator;
});
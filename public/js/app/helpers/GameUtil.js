define(function(require, exports, module) {
	var GameUtil = {};

	var lightColors = [
		"#95AB63", "#BDD684", "#E2F0D6", "#F6FFE0", "#BF734C",
		"#FAD9A0", "#EBBC5E", "#FFFBB8", "#FFD63E", "#FFB54B",
		"#E88638", "#E6F2DA", "#C9F24B", "#F2D7B6", "#BFAC95",
		"#FFFFFF", "#B4BD51", "#B8925A"
	];

	var darkColors = [
		"#10222B", "#362C2A", "#732420", "#736859", "#0D1114",
		"#102C2E", "#695F4C", "#2E2F38", "#8A221C", "#121212",
		"#4D7B85", "#23383D", "#343F40", "#736751", "#8C3F3F",
		"#000000", "#2D2B2A", "#561812", "#B81111", "#333B3A",
		"#543B38", "#61594D"
	];

	var colors = [ 
    		"#10222B", "#95AB63", "#BDD684", "#E2F0D6", "#F6FFE0",
    		"#362C2A", "#732420", "#BF734C", "#FAD9A0", "#736859",
			"#0D1114", "#102C2E", "#695F4C", "#EBBC5E", "#FFFBB8",
			"#2E2F38", "#FFD63E", "#FFB54B", "#E88638", "#8A221C",
			"#121212", "#E6F2DA", "#C9F24B", "#4D7B85", "#23383D",
			"#343F40", "#736751", "#F2D7B6", "#BFAC95", "#8C3F3F",
			"#000000", "#2D2B2A", "#561812", "#B81111", "#FFFFFF",
			"#333B3A", "#B4BD51", "#543B38", "#61594D", "#B8925A"
	];

	GameUtil.getRandomInt = function(min,max) {
    	return Math.floor(Math.random()*(max-min+1)+min);
	};

	GameUtil.getRandomColor = function() {
		return colors[this.getRandomInt(0, 39)];
	};

	GameUtil.getComplimentaryColors = function() {
		var complementaryColors = [];
		var option = this.getRandomInt(0,1);

		if(option==0) {
			complementaryColors.push(lightColors[this.getRandomInt(0, 17)]);
			complementaryColors.push(darkColors[this.getRandomInt(0, 21)]);
		} else {
			complementaryColors.push(darkColors[this.getRandomInt(0, 21)]);
			complementaryColors.push(lightColors[this.getRandomInt(0, 17)]);
		}

		return complementaryColors;
	};

	GameUtil.getDarkRandomColor = function() {
		return darkColors[this.getRandomInt(0, 21)];
	};

	GameUtil.gameColors = function(){
		return GameUtil.getComplimentaryColors();
	};

	module.exports = GameUtil;
});
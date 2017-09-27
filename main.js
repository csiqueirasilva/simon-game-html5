(function() {

	var startBtn = document.getElementById('start-btn');
	var labelStartBtn = document.getElementById('label-marca');
	var tlBtn = document.getElementById('top-left');
	var trBtn = document.getElementById('top-right');
	var blBtn = document.getElementById('bot-left');
	var brBtn = document.getElementById('bot-right');
	
	var score = 0;
	
	var TIME_BTN_PLAY = 1500;
	
	var btns = [tlBtn, trBtn, blBtn, brBtn];

	btns.forEach(function(el, idx) {
		el.idx = idx;
		el.onclick = function() {
			if(gameOn && waitingInput && AUDIO[this.idx].paused) {
				if(GAMESTACK.length === playerCursor) {
					return;
				} else if(GAMESTACK[playerCursor++] !== this.idx) {
					btns[this.idx].style.borderColor = COLORS[this.idx].active;
					waitingInput = false;
					AUDIO.ERROR.play();
				} else {
					if (playerCursor === GAMESTACK.length) {
						waitingInput = false;
					}
					AUDIO[this.idx].play();
				}
			}
		};
	});
	
	var TLBTN = 0;
	var TRBTN = 1;
	var BLBTN = 2;
	var BRBTN = 3;
	
	var COLORS = [];
	
	COLORS[TLBTN] = {idle: '#0b7000', active: '#00ff00'};
	COLORS[TRBTN] = {idle: '#660800', active: '#ff0000'};
	COLORS[BLBTN] = {idle: '#c3b400', active: '#ffff00'};
	COLORS[BRBTN] = {idle: '#196d85', active: '#0000ff'};
	
	var AUDIO = {};
	
	AUDIO[TLBTN] = new Audio("sounds/a_sharp.wav");
	AUDIO[TRBTN] = new Audio("sounds/c_sharp.wav");
	AUDIO[BLBTN] = new Audio("sounds/d_sharp.wav");
	AUDIO[BRBTN] = new Audio("sounds/f_sharp.wav");
	
	AUDIO.ERROR = new Audio("sounds/g_sharp.wav");
	AUDIO.LOSE = new Audio("sounds/lose.mp3");
	AUDIO.WIN = new Audio("sounds/highscore.mp3");
	
	AUDIO.ERROR.load();
	AUDIO.LOSE.load();
	AUDIO.WIN.load();

	AUDIO.ERROR.onended = function() {
		setTimeout(function() {
			var maxScore = parseInt(document.getElementById('highscore').innerHTML);
			if(score > maxScore) {
				AUDIO.WIN.play();
				document.getElementById('highscore').innerHTML = score;
			} else {
				AUDIO.LOSE.play();
			}
		}, 500);
	}
	
	AUDIO.LOSE.onended = AUDIO.WIN.onended = function () {
		endGame();
	}
	
	for(var i = 0; i < 4; i++) {
		var audio = AUDIO[i];
		AUDIO[i].idx = i;
		AUDIO[i].onplay = function() {
			btns[this.idx].style.borderColor = COLORS[this.idx].active;
		};
		AUDIO[i].onended = function() {
			btns[this.idx].style.borderColor = COLORS[this.idx].idle;
			if (playerCursor === GAMESTACK.length) {
				score++;
				document.getElementById('score').innerHTML = score;
				pushGameStack();
			}
		};
		AUDIO[i].load();
	}

	var GAMESTACK;
	
	function playPiece(n) {
		AUDIO[n].play();
	}
	
	var gameOn = false;
	var waitingInput = false;
	var playerCursor = -1;

	labelStartBtn.onclick = function() {
		if(AUDIO.LOSE.paused && AUDIO[TLBTN].paused && AUDIO[TRBTN].paused && AUDIO[BLBTN].paused && AUDIO[BRBTN].paused && AUDIO.WIN.paused) {
			if(!gameOn) {
				startGame();
			} else if (gameOn && waitingInput) {
				endGame();
			}
		}
	};
	
	function startGame() {
		GAMESTACK = [];
		labelStartBtn.innerHTML = 'DESISTIR';
		gameOn = true;
		pushGameStack();
	}
	
	function endGame() {
		btns.forEach(function(el, idx) {
			btns[idx].style.borderColor = COLORS[idx].idle;
		});
		delete GAMESTACK;
		enableInput();
		gameOn = false;
		labelStartBtn.innerHTML = 'INICIAR';		
	}
	
	function disableInput() {
		waitingInput = false;
		labelStartBtn.className = "disableClick";
	}
	
	function enableInput() {
		labelStartBtn.className = "";
		playerCursor = 0;
		waitingInput = true;
	}
	
	function pushGameStack () {
		disableInput();

		var scoreFact = Math.max((100 - score * 2) / 100, 0.8);
		
		GAMESTACK.push(parseInt(Math.random() * btns.length));
		
		GAMESTACK.forEach(function(el, idx) {
			setTimeout(function() {
				AUDIO[el].play();
			}, (idx + 1) * TIME_BTN_PLAY * scoreFact);
		});
		
		setTimeout(function () {
			enableInput();
		}, (GAMESTACK.length + 1) * TIME_BTN_PLAY * scoreFact);
	}
	
})();
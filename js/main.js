/*
#Правила игры

Происхождение игры в «Пьяницу» неизвестно. Есть мнение, что свое название она приобрела из-за простых правил и еще потому, что победа в игре зависит исключительно от везения. Играть в «Пьяницу» очень просто. На старте колода из 52 карт тасуется и делится между всеми игроками поровну. Далее каждый игрок кладет свою стопку карт перед собой «рубашкой» вверх. Игроки одновременно переворачивают верхнюю карту. Тот, у кого карта оказывается больше по достоинству, забирает все открытые карты себе и кладет их под свою стопку. Самой большой картой в «Пьянице» считается туз, самой маленькой — двойка.
Если две карты оказываются одного достоинства, то начинается «война». Игроки кладут «рубашкой» вверх следующую карту, а следом за ней — карту лицом вверх. Игрок с большей картой забирает все карты на кону. Если карты снова оказываются равными, то «война» продолжается таким же образом. Снова одну карту кладут «рубашкой» вверх, а за ней — лицом вверх. И так далее до определения победителя. Выигравший «поединок» забирает все карты на кону. Игра продолжается, пока у одного игрока не окажутся все карты — он и считается победителем.

Кузвесов Артём (arktuz@gmail.com)
***
/*Массивы*/
DIPUTE_PLAYERS     = []; // глобальный массив, который хранит в себе информацию о игроках, между которыми возник спор
DIPUTE_CARDS_THIRT = []; // глобальный массив карт положенных "рубашкой" во время спора
BONUS_CARDS        = []; // глобальный массив карт, который достанется победителю спора

// массив мастей карт
var suitCard       = ['clubs',	  // крести
				      'diamonds', // буби
				      'hearts',   // черви
				      'spades'];  // пики
var weightCards    = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A']; // номинал карт
var deckCards      = []; // колода карт
var playersArr     = []; // игроки


/*Переменные*/
var playersCount = $('#playersCount'); // контейнер количества игроков


/*Конструкторы*/
function card(suit, weight) { // конструктор карт
	this.suit = suit;
	if (weight === 'J') {
		this.weight = 11;
	} else if (weight === 'Q') {
		this.weight = 12;
	} else if (weight === 'K') {
		this.weight = 13;
	} else if (weight === 'A') {
		this.weight = 14;
	} else {
		this.weight = weight;
	}
	this.name = suit+weight;
}

function player(id, playerCards) { // конструктор игроков
	this.name        = 'player'+id;
	this.viewName    = 'Игрок '+(id+1);
	this.playerCards = playerCards;
	($('#player'+(id)+' > .name').text('Игрок '+(id+1)));
	($('#player'+(id)+' > .count').text(playerCards.length));
	($('#player'+(id)).addClass('clubsShirt'));
}

function stepCards(player, card) { // конструктор карт, участвующих в ходе
	this.name = player;
	this.card   = card;
}

/*Функции*/
function shuffle(arr) { // перемешивание карт
    for(var j, x, i = arr.length; i; j = Math.floor(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
    return arr;
};

function deckCardsEnd(arr, count) { // окончатильно формируем колоду карт с учетом количества игроков
	for (var i = arr.length; i > 0; i--) {
		if ((i === arr.length) && (i%count === 0)) {
			deckCards = arr;
			break;
		} else if (i%count === 0) {
			deckCards = arr.splice(1, i);
			break;
		}
	};
}

function countPlayrsInGame() { // определяем количество игроков и раздаем им карты
	if (typeof playersCount !== 'string') {
		// определяем количество игроков
		if ((playersCount.val() > 1) && (playersCount.val() < 9)) {
			playersCount = playersCount.val();
		} else {
			playersCount = playersCount.attr('value');
			$('.error').text('Вы ввели некорректное количество игроков. По умолчанию играют '+playersCount+' участинка.');
		}
		deckCardsEnd(deckCards, playersCount); // формируем конечную колоду карт
		var playersCountCards = deckCards.length/playersCount; // количество карт у каждого игрока

		for (var i = 0; i < playersCount; i++) { // генерируем игроков
			playersArr.push(new player(i, (deckCards.splice(0, playersCountCards))));
		}
	}
}

function stepButton() { // нажатие на кнопку "Следующий ход"

	step(playersArr);
	
	/***/
	if(($('input#debugging').is(':checked') === true)) {
		console.info('ХОД:');
		console.info('Массив всех игроков с картами после хода playersArr:');
		console.log(playersArr);
		console.info('Массив спорящих карт после хода DIPUTE_PLAYERS:');
		console.log(DIPUTE_PLAYERS);
		console.info('Массив BONUS_CARDS  после хода:');
		console.log(BONUS_CARDS);
		console.info('Массив карт РУБАШКОЙ после хода DIPUTE_CARDS_THIRT:');
		console.log(DIPUTE_CARDS_THIRT);
	}
	/***/
}

function startButton() { // нажатие на кнопку "Старт"
	var timer = $('#timer'); // контейнер времени на ход
	// определяем тйамер
	if (timer.val() > 1) {
		timer = timer.val();
	} else {
		timer = timer.attr('value');;
	}
	countPlayrsInGame();
	loop = setInterval('stepButton()', timer);
}


function compare(playerCards) { // сравнение карт в ходе
	var maxWeight   = []; // массив выйгрышных карт
	var playersWins = []; // массив игроков c выйгрышными карты

	playerCards.forEach(function(playerCard) {
		if (typeof playerCard.card !== 'undefined') {
			if ((maxWeight.length === 0) || (maxWeight[0] < playerCard.card.weight)) {
				maxWeight = [];
				maxWeight.push(playerCard.card.weight);
				playersWins = [];
				playersWins.push(playerCard);
			} else if ((maxWeight[0] === playerCard.card.weight)){
				maxWeight.push(playerCard.card.weight);
				playersWins.push(playerCard);
			}
		}
	});
	return playersWins;
}

function dipute(players, nowCards, playersWins) { // проверям, спорная ли ситуация в ходе
	// players - массив игроков с картами
	// playersWins - массив игроков с самой большой картой за данный ход
	// nowCards - массив игроков и карт за данный ход

	/***/
	if(($('input#debugging').is(':checked') === true)) {
		console.info('Массив игроков за этот ход nowCards:');
		console.log(nowCards);
		console.info('Массив победителей за этот ход playersWins:');
		console.log(playersWins);
	}
	/***/
	
	if (playersWins.length === 1) { // если у нас есть явный победитель в ходе

		/***/
		if(($('input#debugging').is(':checked') === true)) {
			console.info('У нас есть явный победитель в ходе!');
			console.log(playersWins);
		}
		/***/
		
		players.forEach(function(player) { // перебираем массив игроков
			if (player.name ===  playersWins[0].name) { // находим победителя
				DIPUTE_CARDS_THIRT.forEach(function(disputeCard) {
					player.playerCards.unshift(disputeCard);
				});
				DIPUTE_CARDS_THIRT = []; // очищаем массив спорящих карт
				BONUS_CARDS.forEach(function(bonusCards) {
					player.playerCards.unshift(bonusCards);
				});
				BONUS_CARDS = []; // очищаем массив карт, , который достанется победителю спора

				players.forEach(function(player) { // отображаем число карт у игрока
					$('#'+player.name+' > .count').text(player.playerCards.length);
				});

				nowCards.forEach(function(player) { // отображаем карты участвующие в ходе
					$('#'+player.name).removeAttr('class');
					$('#'+player.name).addClass(player.card.name);
				});

				nowCards.forEach(function(cards) {
					player.playerCards.unshift(cards.card); // отдаем все карты с хода - победителю
				});
			}

		});
	} else { // возник конфликт между потенциальными победителями

		/***/
		if(($('input#debugging').is(':checked') === true)) {
			console.info('У нас нет явного победитель в ходе!');
		}
		/***/
		
		players.forEach(function(player) {
			$('#'+player.name).removeAttr('class');
			$('#'+player.name).addClass('clubsShirt');
			$('#'+player.name+' > .count').text(player.playerCards.length);	
			playersWins.forEach(function(winner) {
				if (winner.name === player.name) {
					DIPUTE_PLAYERS.push(player);
				}
			});
		});

		/***/
		if(($('input#debugging').is(':checked') === true)) {
			console.info('Массив спорящих карт DIPUTE_PLAYERS:');
			console.log(DIPUTE_PLAYERS);
		}
		/***/

		nowCards.forEach(function(cards) {
			BONUS_CARDS.push(cards.card);
		});
	}
}

function step(players) { // ход

	if (players.length === 1) { // если в массиве остался только один Игрок, то он является победителем

		/***/
		if(($('input#debugging').is(':checked') === true)) {
			console.log('Победил '+players[0].viewName);
		}
		/***/
		$('#findings').append('<div>Победил '+players[0].viewName+'</div>');
		$('#'+players[0].name+' > .count').text(players[0].playerCards.length);
		clearInterval(loop);
		
	} else if (players.length === 0) { // если в массиве осталось 0 игроков, то судя по всем у ничья

		/***/
		if(($('input#debugging').is(':checked') === true)) {
			console.log('Ничья!');
		}
		/***/
		$('#findings').append('<div>Ничья!</div>');
		clearInterval(loop);
		
	}
	else { // если в массиве есть несколько игроков
		var nowCards = []; // массив карт, коорые участвуют в ходе
		if (DIPUTE_PLAYERS.length > 0) { // если массив со спорящими игроками не пустой

			/***/
			if(($('input#debugging').is(':checked') === true)) {
				console.info('Массив DIPUTE_PLAYERS НЕ пуст!');
				console.log(DIPUTE_PLAYERS);
			}
			/***/

			if (DIPUTE_CARDS_THIRT.length > 0) { // если спорящие игроки положили уже карты "рубашкой"

				/***/
				if(($('input#debugging').is(':checked') === true)) {
					console.info('Массив DIPUTE_CARDS_THIRT НЕ пуст!');
				}
				/***/
				
				DIPUTE_PLAYERS.forEach(function(card, i) { // проверяем, если у спорящих игроков карты			
					if (card.playerCards.length === 0) {
						DIPUTE_PLAYERS.splice(i,1);
					} 
				});

				/***/
				if(($('input#debugging').is(':checked') === true)) {
					console.log(players);
				}
				/***/

				players.forEach(function(player, i) { // проверяем, если у игроков карты

					/***/
					if(($('input#debugging').is(':checked') === true)) {
						console.log(players, i);
					}
					/***/

					if (player.playerCards.length === 0) {

						/***/
						if(($('input#debugging').is(':checked') === true)) {
							console.log(player.name+' проиграл!');
						}
						/***/

						$('#findings').append('<div>'+player.viewName+' проиграл!</div>');
						$('#'+player.name+' > .count').text('0');
						$('#'+player.name).removeAttr('class');
						players.splice(i,1);
					}
				});
				DIPUTE_PLAYERS.forEach(function(player) {
					nowCards.push(new stepCards(player.name, player.playerCards.pop()));
				});

				DIPUTE_PLAYERS = []; // очищаем массив спорящих игроков

				/***/
				if(($('input#debugging').is(':checked') === true)) {
					console.info('Массив игроков на второй стадии спора nowCards:');
					console.log(nowCards);
				}
				/***/
				
				var playersWins = compare(nowCards); // получаем массив игроков с выйгрышными картами
				dipute(players, nowCards, playersWins);

			} else {

				/***/
				if(($('input#debugging').is(':checked') === true)) {
					console.info('Массив DIPUTE_CARDS_THIRT пуст, значит мы делаем ход РУБАШКАМИ!');
				}
				/***/

				DIPUTE_PLAYERS.forEach(function(card, i) {
					if (card.playerCards.length === 0) {
						DIPUTE_PLAYERS.splice(i,1);
					} 
				});
				players.forEach(function(player, i) {
					if (player.playerCards.length === 0) {

						/***/
						if(($('input#debugging').is(':checked') === true)) {
							console.log(player.name+' проиграл!');
						}
						/***/

						$('#findings').append('<div>'+player.viewName+' проиграл!</div>');
						$('#'+player.name+' > .count').text('0');
						$('#'+player.name).removeAttr('class');
						players.splice(i,1);
					}
				});
				DIPUTE_PLAYERS.forEach(function(card) {
					DIPUTE_CARDS_THIRT.push(card.playerCards.pop()); // игроки кладут «рубашкой» вверх следующую карту
				});
			}
		} else {

			/***/
						if(($('input#debugging').is(':checked') === true)) {
				console.info('Массив DIPUTE_PLAYERS пуст, значит спорящих игроков нет и это ОБЫЧНЫЙ ХОД!');
			}
			/***/

			players.forEach(function(player, i) {
				if (player.playerCards.length === 0) {
					
						/***/
						if(($('input#debugging').is(':checked') === true)) {
							console.log(player);
							console.log(player.name+' проиграл!');
						}
						/***/

						$('#findings').append('<div>'+player.viewName+' проиграл!</div>');
						$('#'+player.name+' > .count').text('0');
						$('#'+player.name).removeAttr('class');

					players.splice(i,1);
				}
			});
			players.forEach(function(player) {
				nowCards.push(new stepCards(player.name, player.playerCards.pop()));
			});
			
			var playersWins = compare(nowCards); // получаем массив игроков с выйгрышными картами

			dipute(players,nowCards, playersWins);
		}
	}
}


/***/
for (var i = 0; i < suitCard.length; i++) { // собираем колоду карт
	for (var j = 0; j < weightCards.length; j++) {
		deckCards.push(new card(suitCard[i], weightCards[j]));
	}
}
shuffle(deckCards); // и тусуем её

// обрабатываем нажатие на кнопку "Следующий ход"
$('body').on('click', '#step', function() {
	stepButton();
});

// обрабатываем нажатие на кнопку "Старт"
$('body').on('click', '#start', function() {
	$(this).attr('disabled', true);
	$('#step').attr('disabled', true);
	$('#pause').removeAttr('disabled');
	$('#stop').removeAttr('disabled');
	startButton();
});

// обрабатываем нажатие на кнопку "Пауза"
$('body').on('click', '#pause', function() {
	clearInterval(loop);
	$('#start').removeAttr('disabled');
	$('#step').removeAttr('disabled');
	$(this).attr('disabled', true);
});

// обрабатываем нажатие на кнопку "Стоп"
$('body').on('click', '#stop', function() {
	location.reload(true)
});
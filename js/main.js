/*
#Правила игры

Происхождение игры в «Пьяницу» неизвестно. Есть мнение, что свое название она приобрела из-за простых правил и еще потому, что победа в игре зависит исключительно от везения. Играть в «Пьяницу» очень просто. На старте колода из 52 карт тасуется и делится между всеми игроками поровну. Далее каждый игрок кладет свою стопку карт перед собой «рубашкой» вверх. Игроки одновременно переворачивают верхнюю карту. Тот, у кого карта оказывается больше по достоинству, забирает все открытые карты себе и кладет их под свою стопку. Самой большой картой в «Пьянице» считается туз, самой маленькой — двойка.

Если две карты оказываются одного достоинства, то начинается «война». Игроки кладут «рубашкой» вверх следующую карту, а следом за ней — карту лицом вверх. Игрок с большей картой забирает все карты на кону. Если карты снова оказываются равными, то «война» продолжается таким же образом. Снова одну карту кладут «рубашкой» вверх, а за ней — лицом вверх. И так далее до определения победителя. Выигравший «поединок» забирает все карты на кону. Игра продолжается, пока у одного игрока не окажутся все карты — он и считается победителем.

***

/*Массивы*/
// массив мастей карт
var suitCard    = ['clubs',	   // крести
				   'diamonds', // буби
				   'hearts',   // черви
				   'spades'];  // пики
var weightCards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A']; // номинал карт
var deckCards   = []; // колода карт
var playersArr  = []; // игроки


/*Переменные*/
var playersCount = $('#playersCount'); // контейнер количества игроков
var timer		 = '';


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
	($('#player'+(id+1)+' > .name').text('Игрок '+(id+1)));
	($('#player'+(id+1)+' > .count').text(playerCards.length));
	($('#player'+(id+1)).addClass("clubsShirt"));
}

function game(arr) { // конструктор хода

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


/***/
for (var i = 0; i < suitCard.length; i++) { // собираем колоду карт
	for (var j = 0; j < weightCards.length; j++) {
		deckCards.push(new card(suitCard[i], weightCards[j]));
	}
}
shuffle(deckCards); // и тусуем её

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


/*
playersArr.forEach(function(i) {
	console.log(i);
});
*/
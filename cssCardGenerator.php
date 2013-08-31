<?php

// CSS-генератор изображений карт 

$heightCard   = 115;
$widthCard    = 79;
$suitArray    = array('clubs',	  // крести
				      'diamonds', // буби
				      'hearts',   // черви
				      'spades');  // пики
$raitingArray = array('A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K');

foreach($suitArray as $keySuit => $valueSuit) {
	foreach($raitingArray as $keyRaiting => $valueRaiting) {
		$position1 = ($keyRaiting * $widthCard * (-1));
		if (($keyRaiting > 1) && ($keyRaiting < 5)) {
			$position1 += 1;
		} elseif (($keyRaiting > 4) && ($keyRaiting < 9)) {
			$position1 += 2;
		} elseif ($keyRaiting > 8){
			$position1 += 3;
		}
		if ($keySuit == 0) {
			$position2 = 0;
		} elseif (($keySuit > 0) && ($keySuit < 3)) {
			$position2 = ($keySuit * $heightCard * (-1))+1;
		} elseif ($keySuit > 2) {
			$position2 = ($keySuit * $heightCard * (-1))+2;
		}
		echo ".".$valueSuit.$valueRaiting." {<br/>";
		echo "&nbsp;&nbsp;&nbsp;&nbsp;background: url(\"../img/cards.png\") no-repeat scroll ".$position1."px ".$position2."px transparent;<br/>";
		echo "}<br/>";
	}
}
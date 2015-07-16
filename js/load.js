
function load_media()
{
	/*
	ground_images = new Array();
	for (var i in ground_names)
	{
		ground_images[i] = new Image();
		ground_images[i].src = "js/images/ground/" + ground_img_names[i];
	}
	*/
	
	background_image = new Image();
	background_image.src = "js/images/game_background.png";
	
	card_image = new Image();
	card_image.src = "js/images/cards.png";
	
	suits_image = new Image();
	suits_image.src = "js/images/suits.png";
	
	player_image = new Image();
	player_image.src = "js/images/player.png";
	
	table_image = new Image();
	table_image.src = "js/images/table.png";
	
	skip_image = new Image();
	skip_image.src = "js/images/skip.png";
	
	arrow_image = new Image();
	arrow_image.src = "js/images/arrow_down.png";
	
	cards_image = [];
	for (var i = 0; i <= 51; i++)
	{
		cards_image[i] = new Image();
		cards_image[i].src = "js/images/cards/" + i + ".png";
		
		document.getElementById("option_cards").innerHTML += "<span class='option_card_container' style='background:url(js/images/cards/" + i + ".png); background-size: 100% 100%;' id='card_" + i + "'><span class='num'>1x</span><span class='option_cards_add' onclick='add_card_to_deck(this)'>+</span><span class='option_cards_remove' onclick='remove_card_from_deck(this)'>-</span></span>";
	}
	
	bug_audio = new Audio();
	bug_audio .autobuffer = true;
	bug_audio .type= 'audio/mpeg';
	bug_audio .src = 'js/sounds/bug.mp3';
}
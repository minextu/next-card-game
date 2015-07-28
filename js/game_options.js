function show_hide_options(type)
{
	if (type != "hide")
	{
		document.getElementById("game_options").style.display = "block";
		if (is_multiplayer)
			document.getElementById("options_save").style.display = "block";
		else
			document.getElementById("options_save").style.display = "none";
	}
	else
	{
		document.getElementById("game_options").style.display = "none";
	}
}

var default_cards = [20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];
var extra_cards = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];

function update_card_deck(type)
{
	if (type == "custom")
	{
		available_cards = [];
		for (var i = 0; i <= 51; i++)
		{
			document.getElementById("card_" + i).style.opacity = 0.3;
			document.getElementById("card_" + i).getElementsByClassName("num")[0].innerHTML = "0x";
		}
	}
	else
	{
		if (type == "extra")
			var cards = extra_cards.slice();
		else if (type == "default")
			var cards = default_cards.slice();
		else
			var cards = [];
		set_card_deck(cards);
	}
}

function add_card_to_deck(add, is_id)
{
	if (is_id == true)
		var card = add;
	else
	{
		document.getElementById("option_card_deck").selectedIndex = 2;
		var card = add.parentNode.id.replace("card_", "");
	}
	
	available_cards[available_cards.length] = card;
	document.getElementById("card_" + card).style.opacity = 1;
	
	var card_num_in = 0;
	for (var i = 0; i < available_cards.length; i++)
	{
		if (available_cards[i] == card)
			card_num_in++;
	}
	document.getElementById("card_" + card).getElementsByClassName("num")[0].innerHTML = card_num_in + "x";
}

function remove_card_from_deck(d)
{
	document.getElementById("option_card_deck").selectedIndex = 2;
	var card = d.parentNode.id.replace("card_", "");
	

	
	var card_num_in = 0;
	var remove = false;
	for (var i = 0; i < available_cards.length; i++)
	{
		if (available_cards[i] == card)
		{
			card_num_in++;
			if (remove === false)
				remove = i;
		}
	}
	if (card_num_in == 0)
		card_num_in++;
	
	available_cards.splice(remove,1);
	
	if (card_num_in <= 1)
		document.getElementById("card_" + card).style.opacity = 0.3;
	document.getElementById("card_" + card).getElementsByClassName("num")[0].innerHTML = (card_num_in -1) + "x";	
}

function set_card_deck(cards)
{
	update_card_deck("custom");
	for (var i = 0; i < cards.length; i++)
	{
		add_card_to_deck(Number(cards[i]), true);
	}
	check_selected_card_set();
}

function check_selected_card_set()
{
	if (compare_array(available_cards, default_cards))
		document.getElementById("option_card_deck").selectedIndex = 0;
	else if (compare_array(available_cards, extra_cards))
		document.getElementById("option_card_deck").selectedIndex = 1;
	else
		document.getElementById("option_card_deck").selectedIndex = 2;
}

game_first_player = "low";
function set_first_player(type, no_user)
{
	old_game_first_player = game_first_player;
	
	if (type == "low")
	{
		game_first_player = "low";
		document.getElementById("option_first_player").selectedIndex = 0;
	}
	else if (type == "loser")
	{
		game_first_player = "loser";
		document.getElementById("option_first_player").selectedIndex = 1;
	}
	else
	{
		game_first_player = "turn";
		document.getElementById("option_first_player").selectedIndex = 2;
	}
	
	new_game_first_player = game_first_player;
	
	if (is_multiplayer && no_user != true)
		game_first_player = old_game_first_player;
}

function set_waiting_player_position()
{
	var test_player = new Player(0,0,0,0,true);
	for (var i = 0; i < waiting_players.length; i++)
	{
		var drawX = -table_width / 2 - test_player.width / 2 - 100 + (test_player.width*3)*i;
		var drawY = 0;
		waiting_players[i].drawX = drawX;
		waiting_players[i].drawY = drawY;
		waiting_players[i].card_pos = "top";
	}
}

lowest_card = 20;
lowest_num = 7;
highest_num = 14;
function check_lowest_and_highest_card()
{
	lowest_card = 99999;
	lowest_num = 999999;
	highest_num = 0;
	for (var i = 0; i < available_cards.length; i++)
	{
		var tmp_card = new Card(available_cards[i]);
		if (available_cards[i] < lowest_card)
			lowest_card = available_cards[i];
		if (tmp_card.num < lowest_num)
			lowest_num = tmp_card.num;
		if (tmp_card.num > highest_num)
			highest_num = tmp_card.num;
	}
}
var is_skipping = false;

function skip_round(singleplayer)
{
	if (!is_multiplayer || singleplayer == true)
	{
		is_skipping = true;
		console.debug("Skipping round!");
		is_giving = false;
		game_finished = false;
		
		for (var i = 0; i < players.length; i++)
		{
			if (finished_players.indexOf(i) === -1)
			{
				for (var ii = 0; ii < players[i].cards.length; ii++)
				{
					players[i].cards[ii].play(true, -200 + 100*ii, false, true, true);
				}
			}
			finished_players[finished_players.length] = i;
		}
		
		if (is_multiplayer)
		{
			game_finished = true;
			available_cards = [];
			finish_timeout = 200;
			multiplayer_cards_to_play = [];
			can_play = false;
		}
		
	}
	else
	{
		var httpobject = new XMLHttpRequest();
		httpobject.open("POST", server_url + "next_card_game.php?task=skip_round", true);
		httpobject.onload = function ()
		{
			var answer = JSON.parse(httpobject.responseText);
			if (answer['error'] != undefined)
				alert(answer['error']);
		}
		httpobject.send();
	}
}
game_ai_speed = "auto";
function set_ai_speed(speed, singleplayer)
{
	if (!is_multiplayer || singleplayer == true)
	{
		game_ai_speed = speed;
		if (game_ai_speed == "auto")
			document.getElementById("option_ai_speed").selectedIndex = 0;
		else
			document.getElementById("option_ai_speed").selectedIndex = 1;
	}

	new_game_ai_speed = speed
}

game_ai_difficulty = 2;
function set_ai_difficulty(type, singleplayer)
{
	if (!is_multiplayer || singleplayer == true)
	{
		game_ai_difficulty = Number(type);
		if (game_ai_difficulty == 0)
			document.getElementById("option_ai_difficulty").selectedIndex = 0;
		else if (game_ai_difficulty == 1)
			document.getElementById("option_ai_difficulty").selectedIndex = 1;
		else
			document.getElementById("option_ai_difficulty").selectedIndex = 2;
	}
	
	new_game_ai_difficulty = type;
}
	
function compare_array(array1, array2) 
{
	if (!array1 || !array2)
		return false;

	if (array1.length != array2.length)
		return false;

	a1 = array1.slice();
	a1.sort();
	a2 = array2.slice();
	a2.sort();
	
	for (var i = 0, l = a1.length; i < l; i++) 
	{      
		if (a1[i] != a2[i]) 
			return false;           
	}       
	return true;
}
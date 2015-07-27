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

function update_card_deck(type)
{
	if (type == "default" || type == "extra" || type == "custom")
	{
		for (var i = 0; i <= 51; i++)
		{
			if (type != "custom" && (i <= 31 || type == "extra"))
			{
				document.getElementById("card_" + i).style.opacity = 1;
				document.getElementById("card_" + i).getElementsByClassName("num")[0].innerHTML = "1x";
			}
			else
			{
				document.getElementById("card_" + i).style.opacity = 0.3;
				document.getElementById("card_" + i).getElementsByClassName("num")[0].innerHTML = "0x";
			}
		}
		
		if (type == "extra")
		{
			available_cards = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];
			document.getElementById("option_card_deck").selectedIndex = 1;
		}
		else if (type == "default")
		{
			available_cards = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
			document.getElementById("option_card_deck").selectedIndex = 0;
		}
		else
		{
			available_cards = [];
			document.getElementById("option_card_deck").selectedIndex = 2;
		}
	}
}

function add_card_to_deck(add)
{
	document.getElementById("option_card_deck").selectedIndex = 2;
	var card = add.parentNode.id.replace("card_", "");
	
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
game_first_player = "7";
function set_first_player(type, no_user)
{
	old_game_first_player = game_first_player;
	
	if (type == "7")
	{
		game_first_player = "7";
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
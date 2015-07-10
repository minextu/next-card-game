table_width = 520;
table_height = 440;

highlight = 0;

function new_game(num, type)
{
	if (type == "multiplayer")
		is_multiplayer = true;
	else
		is_multiplayer = false;
	is_menu = false;
	
	if (!is_multiplayer)
		game_type = "game";
	
	if (is_multiplayer)
		available_cards = [];
	else
	{
		update_card_deck("default");
	}
	
	set_first_player("7");
	
	available_card_num = available_cards.length;
	cards_played = 0;
	cards_requested = false;
	new_cards_ready = false;
	
	player_num = num + 1;
	players = [];
	set_players_position();
	
	player_turn = 0;
	last_player_turn = false;
	
	skipped_players = [];
	finished_players = [];
	can_play = false;

	first_player_give = 0;
	game_finished = false;
	ai_speed = "auto";
	is_giving = false;
	give_timeout = 0;
	give_player = first_player_give;
	
	table_cards = [];
	for (var i = 0; i < available_cards.length; i++)
	{
		table_cards[i] = new Card(available_cards[i], 0, 0, false, 0, false, false);
	}
	hide_cards();
	
	camera = new Camera(true);
	redraw_canvas = true;
	
	if (is_multiplayer == false)
		is_giving = true;
	
	if (is_multiplayer)
		handle_multiplayer();
}

function set_players_position()
{
	var test_player = new Player(0,0,0,0,true);
	
	for (i = 0; i < player_num; i++)
	{
		if (i == 0)
			var drawX = - test_player.width / 2;
		else if (i >= 1 && i <= 2)
			var drawX = -table_width / 2 - test_player.width / 2 - 100;
		else if (i >= 3 && i <= 4)
			var drawX = -table_width / 2 - 200 - test_player.width / 2 + (i-2)*300;
		else
			var drawX = table_width / 2 + 40;

		
		if (i == 0)
			var drawY = original_height / 2 + table_width / 2 + 20;
		else if (i >= 1 && i <= 2)
			var drawY = original_height / 2 - table_height / 2 + 200 - (i-1)*200 + 70;
		else if (i >= 3 && i <= 4)
			var drawY = original_height / 2 - table_width / 2 - test_player.width - 20;
		else
			var drawY = original_height / 2 - table_height / 2 + (i-5)*200 + 70;

	
		
		if (i == 0)
			show_cards = true;
		else
			show_cards = false;
		
		if (i == 0)
			card_pos = "bottom";
		else if (i == 1 || i == 2)
			card_pos = "left";
		else if (i == 3 || i == 4)
			card_pos = "top";
		else
			card_pos = "right";
		
		if (players[i] == undefined)
			players[i] = new Player(drawX, drawY, show_cards, card_pos, false, i);
		else
		{
			players[i].drawX = drawX;
			players[i].drawY = drawY;
			players[i].show_cards = show_cards;
			players[i].card_pos = card_pos;
			
			if (i != 0)
				players[i].enable_ai = true;
			
			players[i].enable_multiplayer = false;
		}
	}
	
	if (player_num < players.length)
		players.splice(player_num,players.length - player_num);
}
function game()
{
	if (redraw_canvas == true)
		bg_ctx.drawImage(background_image, 0,0,original_width, original_height, 0,0, game_width, game_height);
	
	//camera.pre();
	
	if (is_giving)
	{
		if (give_timeout <= 0)
			give_cards(give_player);
		else
			give_timeout -= (1).speed();
	}
	
	
	if (game_finished == true && !is_giving && !cards_requested)
	{
		player_turn = first_player_give;
		
		last_player_turn = false;
		if (finish_timeout <= 0)
		{
			if (!is_multiplayer)
			{
				available_card_num = available_cards.length;
				table_cards = [];
				for (var i = 0; i < available_cards.length; i++)
				{
					table_cards[i] = new Card(available_cards[i], 0, 0, false, 0, false, false);
				}	
			}
			finished_players = [];
			if (is_multiplayer && !new_cards_ready)
			{
				table_cards = [];
				multiplayer_request_cards();
			}
			else if (is_multiplayer)
				new_cards_ready = false;
			
			if (table_cards.length > 0)
			{
				skipped_players = [];
				can_play = false;
				hide_cards();
				give_player = first_player_give;
				is_giving = true;
			}
			else
				console.debug("no cards available!");
		}
		else
			finish_timeout -= (1).speed();
	}
	else if (!is_giving)
	{
			
		if (player_turn != last_player_turn)
			turn_send = false;
		
		if (!game_finished)
			last_player_turn = player_turn;
		
		if (players[player_turn].disabled == true)
		{
			console.debug("skipping disabled player " + player_turn);
			if (player_turn < players.length - 1)
				player_turn++;
			else
				player_turn = 0;
			console.debug("to " + player_turn);
		}
		
		if (finished_players.length == player_num-1)
		{
			if (first_player_give < players.length - 1)
				first_player_give++;
			else
				first_player_give = 0;
			
			game_finished = true;
			finish_timeout = 200;
			
			console.debug("game finished");
			for (var i = 0; i < players.length; i++)
			{
				if (finished_players.indexOf(i) === -1)
				{
					for (var ii = 0; ii < players[i].cards.length; ii++)
					{
						players[i].cards[ii].play(true, -200 + 100*ii, false, true);
					}
				}
			}
			
			can_play = false;
		}
		
		if (skipped_players.indexOf(player_turn) !== -1)
		{
			for (var i = 0; i < players.length; i++)
			{
				console.debug("skipping player " + player_turn + " on skiplist");
				players[player_turn].skip_timeout = false;
				if (player_turn < players.length - 1)
					player_turn++;
				else
					player_turn = 0;
				
				if (skipped_players.indexOf(player_turn) === -1)
					break;
			}
		}
		
		if (finished_players.indexOf(player_turn) !== -1)
		{
			if (skipped_players.indexOf(player_turn) === -1)
			{
				skipped_players[skipped_players.length] = player_turn;
				console.debug("adding finished player to skiplist");
			}
		}
		
		if (table_cards.length > 0 && skipped_players.length >= players.length - 1)
		{
			console.debug(skipped_players.length + " Players skipped the round");
			hide_cards();
			player_turn = table_cards[table_cards.length - 1].from_player;
		}
	}
	main_ctx.drawImage(table_image, game_width / 2 - (table_width / 2).ratio(0,1), game_height / 2 - (table_height / 2).ratio(1,1), table_width.ratio(0,1), table_height.ratio(1,1));
	
	
	for (var i = 0; i < table_cards.length; i++)
	{
		table_cards[i].draw();
	}
	
	if (is_multiplayer && multiplayer_cards_to_play.length > 0 && players[0].enable_multiplayer)
	{
		for (var i = 0; i < players.length; i++)
		{
			for (var ii = 0; ii < 10; ii++)
			{
				for (var iii = 0; iii < players[i].cards.length; iii++)
				{
					players[i].cards[iii].draw();
				}
			}
			players[i].draw();
		}
	}
	else
	{
		for (var i = 0; i < players.length; i++)
		{
			players[i].draw();
		}
	}
	
	//camera.post();
}

function give_cards(player_id)
{
	if (player_id == "switch")
	{
		handle_card_switch();
		is_giving = false;
		return false;
	}
	console.debug("give");
	is_giving = true;
	
	can_play = false;
	
	var player = players[player_id];
	
	var test_card = new Card(0,0,0, player.show_cards);
	var card_num = available_card_num / player_num;

	if (player.card_pos == "top" || player.card_pos == "bottom")
		var drawX = player.drawX - (card_num*test_card.width) / 2 + test_card.width*player.cards.length + player.width / 2;
	else if (player.card_pos == "left")
		var drawX = player.drawX - test_card.width - test_card.width*player.cards.length;
	else
		var drawX = player.drawX + player.width + test_card.width*player.cards.length;
			
	if (player.card_pos == "top")
		var drawY = player.drawY - test_card.height;
	else if (player.card_pos == "bottom")
		var drawY = player.drawY + player.height;
	else
		var drawY = player.drawY + player.height / 2 - test_card.height / 2;
			
	if (is_multiplayer == false)
		var card_key = Math.round(Math.random()*(table_cards.length - 1));
	else
		var card_key = table_cards.length - 1;
	
	if (card_key < 0)
		console.warn("Unknown Cardkey: " + card_key);
	
	player.cards[player.cards.length] = new Card(table_cards[card_key].id, table_cards[card_key].drawX, table_cards[card_key].drawY, player.show_cards, 0, player.key, player.cards.length);
	
	if (table_cards[card_key].id == 0 && game_first_player == "7")
		player_turn = player_id;
		
	table_cards.splice(card_key, 1);
	player.updated_cards = true;
	
	if (table_cards.length > 0)
	{
		give_player = player_id;
		for (var i = 0; i < players.length; i++)
		{
			if (players[give_player+1] != undefined)
				give_player = give_player + 1;
			else
				give_player = 0;
			
			if (players[give_player].disabled == false)
				break;
		}
		
		if (!is_multiplayer || multiplayer_cards_to_play.length <= 0)
			give_timeout = 10;
	}
	else
	{
		give_player = "switch";
		if (!is_multiplayer || multiplayer_cards_to_play.length <= 0)
			give_timeout = 100;
	}
}

function handle_card_switch()
{
	card_players = [];
	for (var i = 0; i < players.length; i++)
	{
		if (players[i].win_cards === 2)
			card_players["win2"] = players[i];
		else if (players[i].win_cards === 1)
			card_players["win1"] = players[i];
		else if (players[i].win_cards === -1)
			card_players["give1"] = players[i];
		else if (players[i].win_cards === -2)
			card_players["give2"] = players[i];
	}
	
	if (card_players["win2"] != undefined && card_players["give2"] != undefined && card_players["win2"].cards.length >= 2 && card_players["give2"].cards.length >= 2)
	{
		if (game_first_player == "loser")
			player_turn = card_players["give2"].key;
		
		console.debug("switch cards");
		card_players["win2"].cards.sort(compare_card);
		card1 = card_players["win2"].cards[card_players["win2"].cards.length-1];
		card2 = card_players["win2"].cards[card_players["win2"].cards.length-2];
		card1.disabled = true;
		card2.disabled = true;
		
		card_players["give2"].cards[card_players["give2"].cards.length] = new Card(card1.id, card1.drawX, card1.drawY, card_players["give2"].show_cards);
		if (card1.id == 0 && game_first_player == "7")
			player_turn = card_players["give2"].key;
		
		card_players["give2"].cards[card_players["give2"].cards.length] = new Card(card2.id, card2.drawX, card1.drawY, card_players["give2"].show_cards);
		
		if (card2.id == 0 && game_first_player == "7")
			player_turn = card_players["give2"].key;
		
		card_players["give2"].cards.sort(compare_card);
		card1 = card_players["give2"].cards[0];
		card2 = card_players["give2"].cards[1];
		card1.disabled = true;
		card2.disabled = true;
		
		card_players["win2"].cards[card_players["win2"].cards.length] = new Card(card1.id, card1.drawX, card1.drawY, card_players["win2"].show_cards);
		if (card1.id == 0 && game_first_player == "7")
			player_turn = card_players["win2"].key;
		
		card_players["win2"].cards[card_players["win2"].cards.length] = new Card(card2.id, card2.drawX, card1.drawY, card_players["win2"].show_cards);
		
		if (card2.id == 0 && game_first_player == "7")
			player_turn = card_players["win2"].key;
		
		card_players["win2"].updated_cards = true;
		card_players["give2"].updated_cards = true;
		
		if (card_players["win1"] != undefined && card_players["give1"] != undefined && card_players["win1"].cards.length >= 2 && card_players["give1"].cards.length >= 2)
		{
			card_players["win1"].cards.sort(compare_card);
			card1 = card_players["win1"].cards[card_players["win1"].cards.length-1];
			card1.disabled = true;
			
			card_players["give1"].cards[card_players["give1"].cards.length] = new Card(card1.id, card1.drawX, card1.drawY, card_players["give1"].show_cards);
			if (card1.id == 0 && game_first_player == "7")
				player_turn = card_players["give1"].key;
			
			card_players["give1"].cards.sort(compare_card);
			card1 = card_players["give1"].cards[0];
			card1.disabled = true;
			
			card_players["win1"].cards[card_players["win1"].cards.length] = new Card(card1.id, card1.drawX, card1.drawY, card_players["win1"].show_cards);
			if (card1.id == 0 && game_first_player == "7")
				player_turn = card_players["win1"].key;
			
			card_players["win1"].updated_cards = true;
			card_players["give1"].updated_cards = true;
		}
	}
	else
		console.debug("No cards to switch!")

	skipped_players = [];
	game_finished = false;
	can_play = true;
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

function set_first_player(type)
{
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
}
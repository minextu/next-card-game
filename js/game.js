table_width = 520;
table_height = 440;

highlight = 0;

function new_game()
{
	is_menu = false;
	game_type = "game";
	
	available_cards = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	available_card_num = available_cards.length;
	cards_played = 0;
	table_cards = [];
	player_num = 4;
	players = [];
	player_turn = 0;
	skipped_players = [];
	finished_players = [];
	can_play = true;
	
	var test_player = new Player(0,0,0,0,true);
	
	for (i = 0; i < player_num; i++)
	{
		if (i == 0)
			var drawX = - test_player.width / 2;
		else if (i >= 1 && i <= 2)
			var drawX = -table_width / 2 - test_player.width / 2 - 100;
		else if (i >= 3 && i <= 4)
			var drawX = table_width / 2 + 40;
		else
			var drawX = -table_width / 2 - 200 - test_player.width / 2 + (i-4)*300
		
		if (i == 0)
			var drawY = original_height / 2 + table_width / 2 + 20;
		else if (i >= 1 && i <= 2)
			var drawY = original_height / 2 - table_height / 2 + 200 - (i-1)*200 + 70;
		else if (i >= 3 && i <= 4)
			var drawY = original_height / 2 - table_height / 2 + (i-3)*200 + 70;
		else
			var drawY = original_height / 2 - table_width / 2 - test_player.width - 20;
	
		
		if (i == 0)
			show_cards = true;
		else
			show_cards = false;
		
		if (i == 0)
			card_pos = "bottom";
		else if (i == 1 || i == 2)
			card_pos = "left";
		else if (i == 3 || i == 4)
			card_pos = "right";
		else
			card_pos = "top";
		
		players[i] = new Player(drawX, drawY, show_cards, card_pos, false, i);
	}
	
	camera = new Camera(true);
	redraw_canvas = true;
}
function game()
{
	if (redraw_canvas == true)
		bg_ctx.drawImage(background_image, 0,0,original_width, original_height, 0,0, game_width, game_height);
	
	//camera.pre();
	if (skipped_players.length == player_num - 1)
	{
		console.debug(skipped_players.length + " Players skipped the round");
		hide_cards();
		player_turn = table_cards[table_cards.length - 1].from_player;
	}
	
	if (finished_players.indexOf(player_turn) !== -1)
	{
		skipped_players[skipped_players.length] = player_turn;
		if (player_turn < player_num - 1)
			player_turn++;
		else
			player_turn = 0;
	}
	
	main_ctx.drawImage(table_image, game_width / 2 - (table_width / 2).ratio(0,1), game_height / 2 - (table_height / 2).ratio(1,1), table_width.ratio(0,1), table_height.ratio(1,1));
	
	for (var i = 0; i < table_cards.length; i++)
	{
		table_cards[i].draw();
	}
	
	for (var i = 0; i < players.length; i++)
	{
		players[i].draw();
	}
	
	
	
	
	//camera.post();
}
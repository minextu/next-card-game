function new_game()
{
	is_menu = false;
	game_type = "game";
	
	
	available_cards = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	available_card_num = available_cards.length;
	player_num = 5;
	players = [];
	
	for (i = 0; i < player_num; i++)
	{
		if (i >= 0 && i <= 2)
			var drawX = 0;
		else 
			var drawX = original_width - 200;
		
		if (i >= 0 && i <= 2)
			var drawY = 0 + i*200;
		else
			var drawY = 0 + (i - 3)*200;
		
		players[i] = new Player(drawX, drawY);
	}
	
	camera = new Camera(true);
}
function game()
{
	bg_canvas.style.background = "gray";
	
	camera.pre();
	
	for (var i = 0; i < players.length; i++)
	{
		players[i].draw();
	}
	
	
	
	
	camera.post();
}